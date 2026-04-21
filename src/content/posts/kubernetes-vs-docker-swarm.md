---
title: "Kubernetes vs Docker Swarm: Doğru Orchestration Aracını Seçin"
excerpt: "Container orchestration seçimi: Kubernetes'in gücü vs Docker Swarm'ın basitliği. Ölçek, karmaşıklık ve maliyet analizi."
category: "Container & Orchestration"
date: "2026-04-07"
readTime: "9 dk"
featured: false
tags: ["kubernetes", "docker-swarm", "orchestration", "karşılaştırma"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

# Kubernetes vs Docker Swarm: Doğru Orchestration Aracını Seçin

Container sayınız arttığında bir orchestration aracına ihtiyaç duyarsınız. Kubernetes (K8s) ve Docker Swarm bu alandaki iki temel seçenektir. Bu yazıda her iki platformu kurulum kolaylığı, ölçeklenebilirlik, ekosistem ve maliyet açısından karşılaştırıyoruz.

## Kısa Tanımlar

**Kubernetes**, Google tarafından geliştirilen ve CNCF'e devredilen açık kaynaklı container orchestration platformudur. Büyük ölçekli, karmaşık dağıtık sistemler için tasarlanmıştır.

**Docker Swarm**, Docker Engine'e entegre gelen native orchestration aracıdır. Docker CLI bilgisiyle hızlıca cluster kurabilmenizi sağlar.

## Kurulum ve Başlangıç Karşılaştırması

### Docker Swarm: Dakikalar İçinde Cluster

Docker Swarm kurulumu son derece basittir. Docker yüklü herhangi bir makinede tek komutla başlatılır.

```bash
# Manager node başlatma
docker swarm init --advertise-addr 192.168.1.10

# Worker node ekleme (manager'ın verdiği token ile)
docker swarm join --token SWMTKN-1-xxx 192.168.1.10:2377

# Cluster durumunu kontrol etme
docker node ls
```

Bir servis deploy etmek de aynı derecede kolaydır:

```bash
# Servis oluşturma
docker service create --name web --replicas 3 -p 80:80 nginx

# Ölçeklendirme
docker service scale web=5
```

### Kubernetes: Güçlü Ama Karmaşık

Kubernetes kurulumu daha fazla bileşen ve konfigürasyon gerektirir.

```bash
# kubeadm ile cluster kurulumu
kubeadm init --pod-network-cidr=10.244.0.0/16

# kubectl konfigürasyonu
mkdir -p $HOME/.kube
cp /etc/kubernetes/admin.conf $HOME/.kube/config

# Pod network (Flannel örneği)
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml

# Worker node ekleme
kubeadm join 192.168.1.10:6443 --token xxx --discovery-token-ca-cert-hash sha256:xxx
```

Alternatif olarak **k3s** gibi hafif dağıtımlar kurulumu basitleştirir:

```bash
# k3s ile tek komut kurulum
curl -sfL https://get.k3s.io | sh -
```

## Mimari Farklılıklar

| Özellik | Kubernetes | Docker Swarm |
|---------|-----------|--------------|
| En küçük birim | Pod (1+ container) | Task (tek container) |
| Service discovery | CoreDNS + kube-proxy | Dahili DNS |
| Load balancing | Ingress controller + Service | Dahili routing mesh |
| Config yönetimi | ConfigMap + Secret | Docker Config + Secret |
| Storage | PersistentVolume + CSI | Docker Volume |
| Networking | CNI plugin (Calico, Cilium) | Overlay network |

Kubernetes'in Pod kavramı, aynı network namespace'i paylaşan birden fazla container'ı bir arada çalıştırabilmenizi sağlar. Bu, sidecar pattern gibi gelişmiş dağıtık sistem desenlerini mümkün kılar.

## Deployment Tanımları

### Docker Swarm Stack

```yaml
# docker-compose.yml (Swarm stack)
version: "3.8"
services:
  web:
    image: myapp:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    ports:
      - "80:3000"

  redis:
    image: redis:7-alpine
    deploy:
      replicas: 1
```

```bash
docker stack deploy -c docker-compose.yml myapp
```

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

Kubernetes YAML dosyaları daha uzun ve detaylıdır, ancak resource limits, health check, rolling update stratejisi gibi **production-critical** özellikler native olarak desteklenir.

## Ölçeklenebilirlik

### Docker Swarm

- **Yatay ölçeklendirme** basit ve hızlıdır
- Küçük-orta ölçekte (10-50 node) iyi performans gösterir
- Auto-scaling için harici araçlara ihtiyaç duyar
- Büyük cluster'larda performans düşüşü yaşanabilir

### Kubernetes

- Binlerce node ve on binlerce pod yönetebilir
- **Horizontal Pod Autoscaler (HPA)** ile otomatik ölçeklendirme
- **Cluster Autoscaler** ile node sayısını otomatik ayarlama
- KEDA ile event-driven autoscaling

```yaml
# HPA tanımı
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## Ekosistem ve Topluluk

Kubernetes'in ekosistemi çok daha geniştir:

- **Helm** ile paket yönetimi
- **Istio/Linkerd** ile service mesh
- **ArgoCD/Flux** ile GitOps
- **Prometheus/Grafana** ile monitoring
- **Cert-Manager** ile otomatik TLS sertifika yönetimi
- **Operator framework** ile karmaşık uygulamaların otomatik yönetimi

Docker Swarm'ın ekosistemi daha sınırlıdır. Portainer gibi yönetim araçları mevcuttur, ancak Kubernetes ekosistemiyle kıyaslanamaz.

## Maliyet Analizi

| Maliyet Kalemi | Kubernetes | Docker Swarm |
|----------------|-----------|--------------|
| Altyapı | Daha fazla kaynak gerektirir | Minimal overhead |
| Öğrenme eğrisi | Yüksek (haftalarca) | Düşük (saatler) |
| Operasyon maliyeti | Yüksek (veya managed servis) | Düşük |
| Managed servis | EKS/GKE/AKS (~$72/ay/cluster) | Yok |
| Takım yetkinliği | Uzman gerektirir | Docker bilgisi yeterli |

## Doğru Aracı Nasıl Seçersiniz?

### Docker Swarm İdeal Senaryolar

- **Küçük takımlar** (2-5 kişi) ve basit mimariler
- Docker bilgisinin yeterli olduğu, hızlı başlangıç gereken projeler
- 10-20 servislik uygulamalar
- Öğrenme eğrisinin düşük tutulması gereken durumlar

### Kubernetes İdeal Senaryolar

- **Büyük ölçekli** mikroservis mimarileri (50+ servis)
- Auto-scaling, canary deployment, blue-green deployment gereksinimleri
- Multi-cloud veya hybrid-cloud stratejileri
- Güçlü ekosistem ve community desteğine ihtiyaç duyan projeler
- Compliance ve güvenlik gereksinimlerinin yüksek olduğu ortamlar

## Sonuç

Docker Swarm basitliği ile küçük projeler için mükemmel bir başlangıç noktasıdır. Kubernetes ise karmaşıklığına rağmen büyük ölçekli production ortamları için endüstri standardıdır. 2026 itibarıyla Kubernetes'in pazar hakimiyeti tartışmasızdır, ancak her proje Kubernetes gerektirmez.

Kubernetes ile production ortamı yönetimi hakkında detaylı bilgi için [Kubernetes production rehberi](/blog/kubernetes-production-rehberi) yazımıza göz atın. Container güvenliği konusunda ise [container güvenlik best practices](/blog/container-guvenlik-best-practices) makalemizi incelemenizi öneririz.
