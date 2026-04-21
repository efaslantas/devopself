---
title: "Kubernetes Production Ortamı: Kapsamlı Hazırlık Rehberi"
excerpt: "Production'a geçmeden önce kontrol edilmesi gereken kritik Kubernetes konfigürasyonları, güvenlik ayarları ve performans optimizasyonları."
category: "Container & Orchestration"
date: "2026-04-05"
readTime: "12 dk"
featured: true
tags: ["kubernetes", "production", "devops", "container"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

Kubernetes cluster'ınızı development ortamından production'a taşımak, sadece `kubectl apply` komutunu çalıştırmaktan çok daha fazlasını gerektirir. Production ortamında karşılaşabileceğiniz sorunları minimize etmek için titiz bir hazırlık süreci şarttır. Bu rehberde, production'a geçmeden önce mutlaka kontrol etmeniz gereken kritik konfigürasyonları ele alıyoruz.

## Resource Limits ve Requests

Production ortamında resource tanımlamadan pod çalıştırmak, en sık yapılan hatalardan biridir. Bir pod'un kontrolsüz şekilde kaynak tüketmesi, aynı node üzerindeki diğer workload'ları doğrudan etkiler.

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

**Requests**, scheduler'ın pod'u hangi node'a yerleştireceğini belirler. **Limits** ise pod'un kullanabileceği maksimum kaynağı sınırlar. Memory limit aşıldığında pod OOMKilled olur; CPU limit aşıldığında ise throttle edilir.

Önemli kurallar:
- Her container için mutlaka requests ve limits tanımlayın
- `LimitRange` objesi ile namespace düzeyinde varsayılan değerler belirleyin
- `ResourceQuota` ile namespace bazında toplam kaynak kullanımını sınırlayın
- CPU limits konusunda dikkatli olun; bazı ekipler CPU limits kullanmamayı tercih eder çünkü throttling beklenmedik performans sorunlarına yol açabilir

## Liveness ve Readiness Probes

Probes tanımlanmamış pod'lar, uygulama crash olsa bile Kubernetes tarafından sağlıklı kabul edilir. Bu durum production'da sessiz arızalara neden olur.

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3

startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
```

- **Liveness Probe**: Uygulama yanıt vermiyorsa pod'u yeniden başlatır
- **Readiness Probe**: Uygulama trafiğe hazır değilse Service'den çıkarır
- **Startup Probe**: Yavaş başlayan uygulamalar için liveness kontrolünü geciktirir

Startup probe kullanmak, özellikle JVM tabanlı uygulamalar veya büyük model yükleyen servisler için kritiktir.

## RBAC ve Güvenlik

Production cluster'da varsayılan `default` service account'u kullanmak ciddi bir güvenlik açığıdır. Her uygulama için ayrı bir ServiceAccount oluşturun ve minimum yetki prensibini uygulayın.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: app-reader
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: app-reader-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: my-app-sa
  namespace: production
roleRef:
  kind: Role
  name: app-reader
  apiGroup: rbac.authorization.k8s.io
```

Ek güvenlik önlemleri:
- `automountServiceAccountToken: false` ile gereksiz token mount'larını engelleyin
- Pod Security Standards (PSS) ile pod güvenlik politikalarını uygulayın
- Privileged container'ları kesinlikle yasaklayın

## Network Policies

Varsayılan olarak Kubernetes'te tüm pod'lar birbirleriyle iletişim kurabilir. Production'da bu kabul edilemez. Network Policy'ler ile mikro-segmentasyon uygulayın.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

Calico veya Cilium gibi CNI plugin'leri, gelişmiş network policy özellikleri sunar. Cilium özellikle eBPF tabanlı gözlemlenebilirlik ve L7 policy desteğiyle öne çıkar.

## Monitoring ve Observability

Production ortamında görünürlük olmadan çalışmak, gözleri kapalı araba kullanmak gibidir. Üç temel sütun üzerinden observability stratejinizi oluşturun:

**Metrics**: Prometheus + Grafana kombinasyonu endüstri standardıdır. `kube-prometheus-stack` Helm chart'ı ile hızlıca kurulum yapabilirsiniz. Özel uygulama metrikleri için Prometheus client library'lerini kullanın.

**Logging**: Fluentd veya Fluent Bit ile log toplama, Elasticsearch veya Loki ile depolama ve sorgulama yapın. Structured logging (JSON format) kullanmak, log analizi için kritiktir.

**Tracing**: OpenTelemetry ile distributed tracing uygulayın. Jaeger veya Tempo ile trace verilerini görselleştirin.

Ayrıca şu alerting kurallarını mutlaka tanımlayın:
- Pod restart sayısı belirli bir eşiği geçtiğinde
- Node disk veya memory kullanımı kritik seviyeye ulaştığında
- API response time SLA dışına çıktığında
- PersistentVolume kapasitesi dolmak üzereyken

## Auto-Scaling Stratejisi

Production workload'ları dinamiktir. HPA (Horizontal Pod Autoscaler) ve VPA (Vertical Pod Autoscaler) ile uygulamalarınızı otomatik ölçeklendirin.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

KEDA (Kubernetes Event-driven Autoscaling) kullanarak queue depth, cron schedule veya custom metrics gibi event'lere dayalı ölçeklendirme de yapabilirsiniz.

## Backup ve Disaster Recovery

etcd backup'ı almadan production cluster çalıştırmak büyük risk taşır. Velero gibi araçlarla düzenli backup planı oluşturun.

```bash
# Velero ile backup alma
velero backup create production-backup \
  --include-namespaces production \
  --storage-location default \
  --ttl 720h

# Scheduled backup
velero schedule create daily-backup \
  --schedule="0 2 * * *" \
  --include-namespaces production \
  --ttl 720h
```

Backup stratejinizde şunlara dikkat edin:
- etcd snapshot'larını düzenli alın ve offsite depolayın
- PersistentVolume verilerini ayrıca yedekleyin (CSI snapshot veya Velero Restic entegrasyonu)
- Disaster recovery planınızı düzenli olarak test edin; test edilmemiş backup, backup değildir

## Secrets Management

Kubernetes Secret'ları base64 encoded olarak saklanır, bu şifreleme değildir. Production'da mutlaka harici bir secrets management çözümü kullanın.

- **HashiCorp Vault**: En yaygın çözüm. Vault Agent Injector ile pod'lara otomatik secret enjeksiyonu yapabilirsiniz
- **External Secrets Operator**: AWS Secrets Manager, Azure Key Vault veya GCP Secret Manager ile entegrasyon sağlar
- **Sealed Secrets**: GitOps workflow'larında secret'ları güvenle Git'te saklamanızı sağlar

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: db-credentials
  data:
  - secretKey: password
    remoteRef:
      key: secret/data/production/db
      property: password
```

## Production Checklist

Son olarak, go-live öncesi kontrol listesi:

- [ ] Tüm container'lar için resource requests ve limits tanımlı
- [ ] Liveness, readiness ve startup probes yapılandırılmış
- [ ] RBAC ile minimum yetki prensibi uygulanmış
- [ ] Network policies ile pod iletişimi kısıtlanmış
- [ ] Monitoring, logging ve alerting aktif
- [ ] HPA veya KEDA ile auto-scaling yapılandırılmış
- [ ] Backup ve DR planı oluşturulmuş ve test edilmiş
- [ ] Secrets harici bir vault çözümüyle yönetiliyor
- [ ] Pod Disruption Budget (PDB) tanımlanmış
- [ ] Ingress TLS sertifikaları cert-manager ile otomatikleştirilmiş

Bu rehberdeki adımları uygulayarak Kubernetes cluster'ınızı production'a güvenle taşıyabilirsiniz. Unutmayın, production hazırlığı bir kez yapılıp bırakılan bir süreç değil; sürekli iyileştirme gerektiren bir disiplindir.
