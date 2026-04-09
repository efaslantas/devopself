---
title: "Prometheus ve Grafana ile Monitoring Kurulumu: Pratik Rehber"
excerpt: "Kubernetes ortamında Prometheus ile metrik toplama, Grafana ile dashboard oluşturma ve alerting konfigürasyonu."
category: "Monitoring & Observability"
date: "2026-04-04"
readTime: "13 dk"
featured: false
tags: ["prometheus", "grafana", "monitoring", "kubernetes"]
---

# Prometheus ve Grafana ile Monitoring Kurulumu: Pratik Rehber

Monitoring, production sistemlerinin sağlığını anlamanın ve sorunları proaktif olarak tespit etmenin temelidir. Prometheus ve Grafana ikilisi, özellikle Kubernetes ortamlarında en yaygın kullanılan açık kaynaklı monitoring stack'idir. Bu rehberde kurulumdan alerting'e kadar tüm süreci pratik örneklerle ele alıyoruz.

## Prometheus Nedir ve Nasıl Çalışır?

Prometheus, CNCF projesi olan bir zaman serisi veritabanı ve monitoring sistemidir. **Pull-based** model ile çalışır: hedef servislerin `/metrics` endpoint'lerinden belirli aralıklarla metrik toplar.

Temel bileşenleri:

- **Prometheus Server**: Metrik toplama, depolama ve sorgu motoru
- **Exporters**: Servislerin metriklerini Prometheus formatında sunan aracılar
- **Alertmanager**: Alarm kurallarına göre bildirim gönderen bileşen
- **PromQL**: Metrik sorgulama dili

## Kubernetes Üzerinde Kurulum

### Helm ile Kube-Prometheus-Stack

Production ortamlar için en pratik yol **kube-prometheus-stack** Helm chart'ıdır. Bu chart Prometheus, Grafana, Alertmanager ve yaygın exporter'ları tek seferde kurar.

```bash
# Helm repo ekleme
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Namespace oluşturma
kubectl create namespace monitoring

# Kurulum
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.adminPassword=guclu-sifre-123 \
  --set prometheus.prometheusSpec.retention=30d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi
```

```bash
# Kurulumu doğrulama
kubectl get pods -n monitoring
# prometheus-monitoring-kube-prometheus-prometheus-0   Running
# monitoring-grafana-xxx                               Running
# alertmanager-monitoring-kube-prometheus-alertmanager-0 Running
```

### Manuel Kurulum (Docker Compose)

Kubernetes dışında Docker Compose ile hızlı kurulum:

```yaml
# docker-compose.yml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus:v2.53.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.retention.time=30d"

  grafana:
    image: grafana/grafana:11.1.0
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin123
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter:v1.8.0
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"

volumes:
  prometheus_data:
  grafana_data:
```

## Prometheus Konfigürasyonu

### Scrape Konfigürasyonu

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  # Prometheus kendini izler
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Node Exporter
  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]

  # Uygulama metrikleri
  - job_name: "myapp"
    metrics_path: "/metrics"
    scrape_interval: 10s
    static_configs:
      - targets: ["myapp:8080"]

  # Kubernetes service discovery
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: (.+)
```

### Kubernetes'te ServiceMonitor

Kube-prometheus-stack kullanıyorsanız ServiceMonitor CRD ile hedef tanımlayın:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: myapp-monitor
  namespace: monitoring
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
    - port: metrics
      interval: 15s
      path: /metrics
  namespaceSelector:
    matchNames:
      - default
```

## PromQL ile Metrik Sorgulama

PromQL, Prometheus'un sorgu dilidir. Grafana dashboard'larında ve alert kurallarında kullanılır.

### Temel Sorgular

```promql
# Anlık CPU kullanımı (tüm core'lar)
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Bellek kullanım yüzdesi
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# HTTP istek oranı (requests per second)
rate(http_requests_total[5m])

# 95. yüzdelik HTTP yanıt süresi
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Disk kullanım yüzdesi
(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100
```

### Uygulama Metrikleri

Uygulamanızda Prometheus client library kullanarak custom metrikler tanımlayın:

```python
# Python Flask örneği
from prometheus_client import Counter, Histogram, generate_latest

REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

@app.route('/metrics')
def metrics():
    return generate_latest()

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    latency = time.time() - request.start_time
    REQUEST_COUNT.labels(request.method, request.path, response.status_code).inc()
    REQUEST_LATENCY.labels(request.method, request.path).observe(latency)
    return response
```

## Grafana Dashboard Oluşturma

### Prometheus Data Source Ekleme

Grafana'ya giriş yaptıktan sonra:

1. **Connections > Data Sources > Add data source**
2. Prometheus seçin
3. URL: `http://prometheus:9090` (veya Kubernetes'te `http://monitoring-kube-prometheus-prometheus.monitoring.svc:9090`)
4. Save & Test

### Dashboard JSON ile Import

Grafana topluluğu binlerce hazır dashboard sunar. En popüler dashboard ID'leri:

- **1860**: Node Exporter Full
- **3662**: Prometheus 2.0 Overview
- **15757**: Kubernetes Cluster Monitoring

```bash
# Grafana API ile dashboard import
curl -X POST http://admin:admin123@localhost:3000/api/dashboards/import \
  -H "Content-Type: application/json" \
  -d '{
    "dashboard": { "id": null },
    "overwrite": true,
    "inputs": [{ "name": "DS_PROMETHEUS", "type": "datasource", "value": "Prometheus" }],
    "folderId": 0,
    "pluginId": "grafana-piechart-panel"
  }'
```

### Custom Dashboard Panelleri

Grafana UI'da yeni dashboard oluştururken kullanabileceğiniz panel sorguları:

```promql
# Panel 1: Request Rate
rate(http_requests_total{job="myapp"}[5m])

# Panel 2: Error Rate (%)
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# Panel 3: Active Connections
myapp_active_connections

# Panel 4: Response Time (p95)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="myapp"}[5m])) by (le))
```

## Alerting Konfigürasyonu

### Prometheus Alert Kuralları

```yaml
# alert_rules.yml
groups:
  - name: infrastructure
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Yüksek CPU kullanımı: {{ $labels.instance }}"
          description: "CPU kullanımı %{{ $value | humanize }} seviyesinde (5 dk üzeri)."

      - alert: DiskSpaceLow
        expr: (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 85
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Disk alanı kritik: {{ $labels.instance }}"
          description: "Disk kullanımı %{{ $value | humanize }}."

  - name: application
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100 > 5
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "Yüksek hata oranı"
          description: "5xx hata oranı %{{ $value | humanize }}."

      - alert: HighLatency
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Yüksek yanıt süresi"
          description: "P95 latency {{ $value | humanize }}s."
```

### Alertmanager ile Bildirim

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ["alertname", "severity"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: "slack-notifications"

  routes:
    - match:
        severity: critical
      receiver: "pagerduty-critical"
    - match:
        severity: warning
      receiver: "slack-notifications"

receivers:
  - name: "slack-notifications"
    slack_configs:
      - api_url: "https://hooks.slack.com/services/xxx/yyy/zzz"
        channel: "#alerts"
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: "pagerduty-critical"
    pagerduty_configs:
      - service_key: "your-pagerduty-key"
        severity: critical
```

## Retention ve Storage Optimizasyonu

Prometheus verileri uzun süre saklamak için storage konfigürasyonunu optimize edin:

```bash
# Prometheus başlatma parametreleri
--storage.tsdb.retention.time=90d       # 90 gün veri saklama
--storage.tsdb.retention.size=100GB     # Maksimum 100GB
--storage.tsdb.wal-compression          # WAL sıkıştırma
```

Uzun vadeli depolama için **Thanos** veya **Mimir** gibi çözümler Prometheus ile entegre çalışır ve object storage (S3, GCS) üzerinde uygun maliyetli saklama sağlar.

## Sonuç

Prometheus ve Grafana, modern altyapıların monitoring ihtiyaçlarını karşılayan güçlü ve esnek bir çözümdür. Pull-based metrik toplama, PromQL ile güçlü sorgulama ve Alertmanager ile bildirim yönetimi sayesinde sistemlerinizi proaktif olarak izleyebilirsiniz.

Observability konusunda daha kapsamlı bir bakış için [observability metrikleri rehberi](/blog/observability-metrikleri-rehberi) yazımıza, Kubernetes ortamında monitoring kurulumu için ise [Kubernetes production rehberi](/blog/kubernetes-production-rehberi) makalemize göz atın.
