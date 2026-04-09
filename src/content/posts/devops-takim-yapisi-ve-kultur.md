---
title: "DevOps Takım Yapısı ve Kültür Dönüşümü Rehberi"
excerpt: "DevOps sadece araç değil, bir kültürdür. Takım yapıları, sorumluluk modelleri ve organizasyonel dönüşüm stratejileri."
category: "Collaboration & Project"
date: "2026-03-25"
readTime: "9 dk"
featured: false
tags: ["devops-kultur", "takim-yapisi", "donusum", "sre"]
---

DevOps dönüşümü başlatan organizasyonların büyük çoğunluğu, araç seçimiyle işe başlar. Kubernetes kurarlar, CI/CD pipeline'ları oluştururlar, monitoring stack deploy ederler. Ancak birkaç ay sonra fark ederler ki araçlar değişti ama sonuçlar aynı: deployment'lar hala riskli, takımlar arası iletişim hala kopuk, sorunlar hala birinin üstüne kalıyor. Bunun nedeni, DevOps'un bir araç seti değil bir kültürel dönüşüm olmasıdır.

## Team Topologies

Matthew Skelton ve Manuel Pais'in geliştirdiği Team Topologies framework'ü, yazılım organizasyonlarında dört temel takım tipi tanımlar:

### 1. Stream-Aligned Teams

İş akışına hizalanmış takımlardır. Bir ürün özelliğinin veya iş alanının baştan sona sahipliğini üstlenirler. Kendi servislerini geliştirip, deploy edip, operate ederler.

Özellikleri:
- End-to-end sorumluluk (you build it, you run it)
- İş değerini doğrudan müşteriye ulaştırma yeteneği
- Minimum dış bağımlılık ile otonom çalışma
- Genellikle 5-9 kişilik takımlar

Stream-aligned team, DevOps dönüşümünün birincil yapı taşıdır. Organizasyondaki takımların büyük çoğunluğu bu tipte olmalıdır.

### 2. Platform Teams

Stream-aligned takımların ihtiyaç duyduğu ortak altyapı hizmetlerini sunan internal platform takımlarıdır. Kubernetes cluster yönetimi, CI/CD platform'u, monitoring altyapısı, database-as-a-service gibi hizmetler sağlarlar.

Platform team'in amacı, stream-aligned takımların bilişsel yükünü azaltmaktır. Bir geliştirici, veritabanı oluşturmak için DBA'ya ticket açmak yerine self-service bir portal üzerinden dakikalar içinde veritabanını provision edebilmelidir.

```yaml
# Platform team'in sunduğu self-service örneği
# Developer bu YAML'ı commit eder, platform otomatik provision eder
apiVersion: platform.internal/v1
kind: DatabaseClaim
metadata:
  name: user-service-db
  namespace: team-alpha
spec:
  engine: postgresql
  version: "16"
  size: small       # small: 2 vCPU, 4GB RAM
  backup:
    enabled: true
    retention: 30d
  monitoring:
    alerts: true
```

### 3. Enabling Teams

Belirli teknik alanlarda uzmanlık sağlayan ve diğer takımların yetkinlik kazanmasına yardımcı olan takımlardır. Security, observability veya cloud migration gibi alanlarda çalışırlar. Kalıcı değil, geçici olarak diğer takımlarla etkileşirler. Amaçları, bildiklerini öğretip takımları bağımsız hale getirmektir.

### 4. Complicated-Subsystem Teams

Özel uzmanlık gerektiren karmaşık alt sistemleri yöneten takımlardır. Video codec'leri, makine öğrenimi modelleri veya finans hesaplama motorları gibi derin domain bilgisi gerektiren bileşenler bu takımların sorumluluğundadır.

## DevOps vs SRE

DevOps ve SRE (Site Reliability Engineering) birbirini tamamlayan yaklaşımlardır. Google'ın ifadesiyle SRE, DevOps'un spesifik bir implementasyonudur.

| Kriter | DevOps | SRE |
|--------|--------|-----|
| Odak | Kültür ve iş birliği | Güvenilirlik ve ölçeklenebilirlik |
| Metrikler | Deployment frequency, lead time | SLI/SLO, error budget |
| Sorumluluk | Paylaşılan sahiplik | Tanımlı on-call rotation |
| Yaklaşım | Araç ve pratik odaklı | Mühendislik odaklı |

Küçük-orta ölçekli organizasyonlarda ayrı bir SRE takımı oluşturmak yerine, embedded SRE modeli daha uygun olabilir. Bu modelde deneyimli SRE mühendisleri stream-aligned takımların içinde çalışarak reliability kültürünü doğrudan yayar.

## Blameless Postmortem Kültürü

Blameless postmortem, bir olay sonrası "kim hata yaptı?" yerine "sistem neden bu hataya izin verdi?" sorusunu soran bir yaklaşımdır. Bu kültürün yerleşmesi, DevOps dönüşümünün en kritik adımlarından biridir.

Etkili bir postmortem şablonu:

```markdown
## Olay Özeti
- Başlangıç: 2026-03-15 14:23 UTC
- Tespit: 2026-03-15 14:31 UTC (8 dk)
- Çözüm: 2026-03-15 15:12 UTC (49 dk)
- Etki: %12 kullanıcı 500 hatası aldı

## Zaman Çizelgesi
- 14:23 - Yeni config deploy edildi
- 14:25 - Error rate artmaya başladı
- 14:31 - PagerDuty alerti tetiklendi
- 14:35 - On-call mühendis investigate etmeye başladı
- 14:52 - Root cause olarak hatalı config tespit edildi
- 15:05 - Config rollback yapıldı
- 15:12 - Servis tamamen recover etti

## Root Cause
Config değişikliği, validation olmadan doğrudan production'a
uygulandı. Staging ortamında test edilmemişti.

## Action Items
- [ ] Config değişiklikleri için staging-first policy uygula
- [ ] Config validation CI step'i ekle
- [ ] Config rollback süresini 5 dk'nın altına düşür
```

Postmortem'in amacı cezalandırma değil, öğrenmedir. Action item'lar assign edilmeli ve takip edilmelidir. Aksi halde postmortem sadece bir formaliteye dönüşür.

## On-Call Pratikleri

Sağlıklı bir on-call rotasyonu, DevOps kültürünün sürdürülebilirliği için hayati önem taşır.

**On-call best practices:**

- **Rotasyon süresi**: Haftalık rotasyon en yaygın modeldir. Bir kişi art arda iki hafta on-call olmamalıdır.
- **Primary ve secondary**: Her zaman bir backup on-call bulunmalıdır. Primary'nin ulaşılamaması durumunda escalation otomatik olmalıdır.
- **Runbook'lar**: Her alert için bir runbook olmalıdır. On-call mühendis gece 3'te uyandığında, problem hakkında düşünmek yerine runbook'u takip edebilmelidir.
- **Alert kalitesi**: Actionable olmayan alertler, on-call yorgunluğunun birincil sebebidir. Her sprint'te en az bir alert hygiene çalışması yapılmalıdır.
- **Kompanzasyon**: On-call karşılığı ek ücret veya izin verilmelidir. Karşılıksız on-call, uzun vadede tükenmişliğe yol açar.

```yaml
# PagerDuty escalation policy örneği
escalation_policy:
  name: "backend-team"
  rules:
    - escalation_delay_in_minutes: 5
      targets:
        - type: schedule_reference
          id: primary-on-call
    - escalation_delay_in_minutes: 10
      targets:
        - type: schedule_reference
          id: secondary-on-call
    - escalation_delay_in_minutes: 15
      targets:
        - type: user_reference
          id: engineering-manager
  repeat_enabled: true
  num_loops: 2
```

## İletişim Kalıpları

Takımlar arası etkileşim modları, organizasyonel performansı doğrudan etkiler. Team Topologies'de üç iletişim modu tanımlanır:

1. **Collaboration**: İki takım belirli bir süre yakın çalışır. Yeni bir alan keşfedilirken kullanılır. Yüksek bant genişliği gerektirir, sürekli olmamalıdır.

2. **X-as-a-Service**: Bir takım, diğerine iyi tanımlanmış bir API veya platform sunar. Minimum koordinasyon gerektirir. Platform team'lerin temel iletişim modudur.

3. **Facilitating**: Bir takım (genellikle enabling team), diğerine koçluk yapar. Bilgi transferi sonrası etkileşim azalır.

## Dönüşüm Stratejisi

DevOps dönüşümü big-bang yaklaşımıyla başarılamaz. Aşamalı bir strateji izlenmelidir:

**Faz 1 - Pilot (1-3 ay)**: Gönüllü ve yetkin bir takımla başlayın. Bu takım ilk başarı hikayesini oluşturur.

**Faz 2 - Yayılım (3-6 ay)**: Pilot takımın deneyimlerini diğer takımlarla paylaşın. Platform team oluşturmaya başlayın.

**Faz 3 - Standardizasyon (6-12 ay)**: Ortak pratikleri, araçları ve platformları standartlaştırın. Enabling team'ler aracılığıyla bilgi transferini hızlandırın.

**Faz 4 - Optimizasyon (sürekli)**: DORA metriklerini ölçün, darboğazları tespit edin, sürekli iyileştirin.

Her fazda yönetim desteği kritiktir. DevOps dönüşümü, sadece mühendislerin inisiyatifiyle değil, organizasyonun her seviyesinden commitment ile başarıya ulaşır. Teknik mükemmellik, ancak sağlıklı bir kültür üzerine inşa edildiğinde sürdürülebilir olur.
