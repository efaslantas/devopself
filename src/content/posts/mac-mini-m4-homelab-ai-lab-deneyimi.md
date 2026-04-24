---
title: "Mac Mini M4 + Proxmox Homelab: 6 Ayda Kişisel AI Lab Kurma Notlarım"
excerpt: "Mac Mini M4'ü Apple Silicon native LLM inference için, Proxmox'u LXC konteynerler ile DNS/monitoring/MCP hub için kullandığım hibrit homelab'ın gerçek dünya notları. Ağrı noktaları, çözümler ve elektrik faturası dahil."
category: "Container & Orchestration"
date: "2026-04-22"
updated: "2026-04-22"
readTime: "15 dk"
featured: true
tags: ["homelab", "mac-mini-m4", "proxmox", "kubernetes", "mlx", "ai-lab"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
---

Bu yazı, son altı ayda kurduğum — ve hâlâ büyümeye devam eden — kişisel AI & DevOps laboratuvarımın hikayesidir. Amacım bir "en iyi homelab" rehberi yazmak değil; kendi kararlarımı, kör noktalarımı ve altı ay boyunca karşılaştığım spesifik hataları olduğu gibi paylaşmak. Eğer benzer bir yolu düşünüyorsanız, başkasının canlı sistemindeki kararları görmek çoğu blog yazısından daha değerlidir.

Setup iki sınıftan oluşuyor: **Mac Mini M4 (24 GB)** geliştirme ve yerel LLM inference için, **Intel tabanlı Proxmox sunucusu** ise küçük LXC konteynerler için. İkisi 1 Gbps yerel ağ üzerinden birbirleriyle konuşuyor. Bu makale, o mimariye neden geldiğimi ve yolda nelerden vazgeçtiğimi anlatıyor.

## Neden İki Makine? Tek Host Yetmez mi?

İlk niyetim her şeyi Proxmox sunucusunda tutmaktı. Ama birkaç haftalık deneme sonunda üç duvara tosladım:

1. **Apple Silicon-only çalışan şeyler** — MLX framework, Apple's Core ML araçları, Swift toolchain. Bunlar ARM64 Linux'ta çalışsa bile M4'ün Neural Engine'ini kullanamıyor. 16B parametreli bir modeli 30 token/s hızında çalıştırmak vs. 4 token/s arasındaki fark, günlük iş akışını öldürüyor.
2. **Claude Code workflow'u** — Terminal-native ajan iş akışlarımı macOS'ta çalıştırmak, dosya izinleri ve keychain entegrasyonu açısından çok daha akıcı.
3. **Proxmox sunucum yaşlı** — Intel Haswell nesil CPU, AVX-512 yok. Bazı ML workload'ları (özellikle embedding generation) gülünç derecede yavaş.

Sonuç: "CPU-ağırlıklı container hizmetleri" Proxmox'ta, "GPU/Neural Engine ağırlıklı" her şey M4'te.

## Mac Mini M4: Yerel LLM ve K8s Control Plane

M4 üzerinde üç katman çalışıyor:

- **macOS host** — geliştirme, Claude Code, Docker Desktop
- **Docker Desktop + K8s** — `ai-lab` namespace'i ev sahipliği yapıyor
- **MLX-Server** — host üzerinde doğrudan systemd-like LaunchAgent ile

MLX-Server'ı konteyner içinde **denedim ve vazgeçtim**. Sebep: Docker Desktop'ın Apple Silicon macOS VM'i, Metal/Neural Engine'e doğrudan erişimi sınırlı tutuyor. Konteyner içindeki Llama 3.1 8B modeli, aynı modelin host üzerinde çalışan halinden yaklaşık 3× daha yavaştı. Kayıp kabul edilemezdi; inference'ı host'a aldım, sadece inference API'sini K8s servislerine expose ettim:

```yaml
# k8s/external-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: mlx-server
  namespace: ai-lab
spec:
  type: ExternalName
  externalName: host.docker.internal
  ports:
    - port: 8000
      targetPort: 8000
```

Bu numarayı bulana kadar iki hafta farklı YAML denemesi yaptım. Kubernetes'ın `ExternalName` servisi, host üzerinde çalışan bir servisi sanki cluster içindeymiş gibi adreslemenin en temiz yolu.

### K8s "ai-lab" Namespace İçinde Ne Var?

`kubectl get pods -n ai-lab` çıktısı:

```
NAME                           READY   STATUS    RESTARTS   AGE
efa-agent-64d6f9b4c-2xhqf      1/1     Running   3          41d
redis-master-0                 1/1     Running   0          41d
chromadb-0                     1/1     Running   1          41d
searxng-789c4b6d5f-mpqr2       1/1     Running   0          18d
dashboard-5f6b8c7d9-4lvjk      1/1     Running   0          12d
```

Önemli notlar:
- **Redis ve ChromaDB StatefulSet** — persistent volume claim'leri Docker Desktop'ın disk katmanında. M4 SSD'si hızlı, ama yedekleme yapmadan üretime geçmek aptallık olurdu; `chat_history_backup` adında bir CronJob gece 03:00'te Redis'i dump'lıyor ve ChromaDB'ye yazıyor.
- **SearXNG** — Claude Code'un web araması için kendi SearXNG instance'ım. Google/Bing API quota'ları bitmesin diye; ayrıca privacy için.
- **efa-agent** — Kendi ajan servisim (Python/FastAPI/LangGraph, 3-node pipeline). Bu makaleyi düzenlerken bir noktada "haftada 3 makale üret" diyen bir cron daemon buldu ve kapattım — ondan sonra bu yazıyı elle yazmaya başladım.

## Proxmox Tarafı: Küçük ve İddialı LXC Konteynerler

Proxmox sunucum 2017 model Intel NUC — 32 GB RAM, 1 TB NVMe. Üç yıl önce ikinci el aldım, elektrik sarfiyatı aylık ~20 TL civarı. Üzerinde **10 LXC konteyner** çalışıyor, en kritikleri:

| CT ID | Rol | Neden LXC (VM değil)? |
|---|---|---|
| CT100 | AdGuard Home + unbound (ev DNS) | 128 MB RAM yeter, overhead önemli |
| CT101 | Uptime Kuma (monitoring) | Benzer — hafif web dashboard |
| CT102 | MCP Hub (Claude Code MCP serverları) | Hızlı startup isteği |
| CT110 | Nginx reverse proxy + certbot | Host networking gerekli |
| CT120 | Netdata agent (metrikleri Netdata Cloud'a gönderir) | DaemonSet-benzeri davranış |

LXC'yi VM yerine seçmemin ana sebebi **RAM verimliliği**. Aynı RAM ile 2× daha fazla servis sığdırabiliyorum. Dezavantajı: kernel paylaşımı, yani cgroup v2 özellikleri ve bazı Docker-in-Docker senaryoları sorunlu. İki kere bu yüzden iki günümü yaktım, ama artık ne zaman LXC'den kaçılması gerektiğini biliyorum.

### Karşılaştığım En Absürt LXC Hatası

CT102'de MCP Hub kurarken `npm install` rastgele zamanlarda "killed" hatası veriyordu. Saatlerce `dmesg` ve `journalctl` karıştırdım, cgroup OOM işaretleri yoktu. Sonunda problem: **Proxmox'un LXC template varsayılanları** — container üzerinde `nofile` limiti 1024'tü. `npm` paralel bağlantı açarken limit aşılıyordu ve sessizce process ölüyordu. Çözüm:

```bash
# /etc/pve/lxc/102.conf
lxc.prlimit.nofile: 65536
```

Bu tek satır. Bir container için `ulimit -n` artırmak, size "ama bu Linux'un default'u işte" diyen herhangi bir tutoriyale göre çok daha yaygın bir yara. Homelab'da bu tür şeylerin birikimi "her şey en son ne zaman patlamıştı" hatıraları olarak öğreniyorsunuz.

## Ağ Topolojisi: DNS-First Yaklaşım

Ev ağımda **her servisin kendi `.efa.local` subdomain'i var** ve bu CT100'deki AdGuard + unbound tarafından yönetiliyor:

```
dashboard.efa.local   → 192.168.1.200 (Mac Mini K8s Ingress)
monitoring.efa.local  → 192.168.1.106 (Proxmox - Uptime Kuma)
mcp.efa.local         → 192.168.1.106 (Proxmox CT102)
adguard.efa.local     → 192.168.1.106 (Proxmox CT100)
```

Yıllarca `192.168.1.200:3000` gibi adresleri ezberlemeye çalışarak yaşadıktan sonra, DNS-first geçişi homelab'ımın en değerli değişikliği oldu. Yeni bir servis eklediğimde AdGuard'dan yeni bir local DNS kaydı yapıyorum; Let's Encrypt sertifikalarını da aynı DNS üzerinden DNS-01 challenge ile alıyorum.

### SSL / TLS İçinde Yaşayan Homelab

Ev içi servisler için HTTPS gereksiz gibi gelse de, iki sebepten zorunlu hissediyorum:

1. **Browser uyarıları çalışmayı bozuyor** — her tarayıcı güncellemesinde bir yeni ekran.
2. **Tarayıcı-dışı araçlar bozuluyor** — `curl`, webhook alıcıları, mobil uygulamalar genelde self-signed'i kabul etmez.

DNS-01 challenge sayesinde 80/443 portunu dışarı açmadan, Cloudflare API ile sertifika alabiliyorum. `certbot-dns-cloudflare` plugin'i 15 dakikada kuruldu ve o günden beri otomatik yenileniyor.

## İşe Yaramayan Üç Denemem

Neyin çalışmadığını söylemek, neyin çalıştığını söylemekten değerlidir.

### 1. K3s'i Proxmox VM İçinde Çalıştırmak

Denedim, gelmeyecek performans fikriyle. K3s tek node'luk için harika, ama **Traefik ingress + Proxmox'un SDN ağ katmanı** birbirine bok gibi entegre. Pod'lar ayakta, servisler erişilebilir, ama dışarıdan gelen trafik rastgele drop oluyordu. Bir hafta debug ettim, sonra Docker Desktop'a geri döndüm. Lesson: "production-grade setup for a dev workload" kendi kendinize verdiğiniz bir bulmaca vaadidir.

### 2. Jellyfin + Media Server Kurmak

Bu en uzun yan-saptırma oldu. "Nasılsa homelab var" diye Plex'e alternatif kurdum, Intel QuickSync transcoding için donanım geçişleri. Üç hafta sonra anladım: **tüketmediğim bir şeyi çalıştırıyorum**. Kapattım. Homelab'ın hatalarından biri "yapabildiğim için yapıyorum" tuzağına düşmek. Yapmadığınız şeyi **üretken bir iş akışınız olmadan** çalıştırırsanız, elektrik ve DevOps stresi dışında hiçbir şey elde etmezsiniz.

### 3. Kendi VPN'imi Kurmak

WireGuard'ı denedim. Çalıştırdım. Üç hafta sonra Tailscale'e geçtim. Sebep: WireGuard manuel `AllowedIPs` yönetimi, mobil cihazlara key pushlamak, DNS routing... Tailscale bunu çözülmüş bir problem olarak sunuyor. "Kendi yapmak" istediğim her şeyi yapmıyorum; yalnızca öğreneceğim bir şey varsa yapıyorum. WireGuard ilginçti ama ondan daha ilginç şeyler var.

## Elektrik Faturası

Tam sayılar (aylık ortalama, 2025-11 ile 2026-04 arası):
- Mac Mini M4 idle: ~5W, yük altında ~40W, ortalama: **12W**
- Proxmox sunucu: ortalama **38W**
- Router + switch + modem: **8W**

Toplam ~58W, aylık ~42 kWh. İstanbul ortalama tarifesiyle ~60 TL/ay. Yerel LLM inference için cloud API ücretlerinden tasarruf ettiğim miktar bunu kat kat geçiyor. Anthropic Claude API'sine ayda ~$15-20 ödemeyi bırakıp MLX ile yerel çalıştırmaya başladığımdan beri, elektrik maliyeti kendini amorti etti.

## Gelecek 6 Ay için Planım

- **NAS eklemek** — 4-bay mini NAS, muhtemelen ZFS raidz. Yedekleme stratejimi iyileştirmek lazım. Şu an sadece Restic ile Backblaze B2'ye gönderiyorum; yerel bir aşama eksik.
- **M4 cluster değil, ama M4 + M1 pair** — eski M1 Mac Mini'm çekmecede duruyor. MLX multi-device inference son sürümde geldi; 8B modeli iki makineye dağıtarak 30B modeli çalıştırmayı denemek istiyorum.
- **Observability katmanını iyileştirmek** — şu an Uptime Kuma yetersiz. Grafana Cloud'un free tier'ı muhtemelen yeter; Prometheus federation kurmak için bir Cumartesi öğleden sonramı ayırmayı planlıyorum.

## Başlayacak Olana Üç Öneri

1. **İlk servisinizden sonra durun ve DNS kurun.** İlk beş servisi IP + port ile kullanmaya başlarsanız, 15 servise geldiğinizde yeniden yapılandırmak acı verir.
2. **Yedekleme olmadan production'a çıkmayın — homelab bile olsa.** Ailenizin kullandığı DNS, kendi email, chat geçmişi... Bu şeyler kaybolduğunda farkedersiniz.
3. **Aynı anda çok fazla şey değiştirmeyin.** Bir hafta boyunca tek bir yeni servis koyun, o sabit olduktan sonra bir sonrakine geçin. Homelab büyütme hızı, stabilite için kritik.

Homelab, öğrenme aracı. Üretim ortamı değil. Ama benim için "küçük bir üretim ortamı" psikolojisiyle çalıştırmak, işte bu kararlı disiplini öğretti. Şirket ortamındaki production incident'lere yaklaşımım, önceki yıllarımdan çok daha sakin — çünkü evde her hafta benzer mini olaylar yaşıyorum.

Bir sonraki yazıda muhtemelen ZFS'e geçişimi anlatacağım. Eğer kendi kurulumunuzu merak ediyorsanız, GitHub'dan bana ulaşın — favori setup'larınızı merakla okurum.
