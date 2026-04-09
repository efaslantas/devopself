---
title: "Observability Metrikleri: Neyi, Nasıl ve Neden İzlemeli?"
excerpt: "SLI, SLO, SLA kavramlarından golden signals'a, DORA metriklerinden custom metriklere kadar observability dünyasının kapsamlı rehberi."
category: "Monitoring & Observability"
date: "2026-04-06"
readTime: "13 dk"
featured: false
tags: ["observability", "monitoring", "prometheus", "sli-slo"]
---

Monitoring ve observability arasındaki fark, sıklıkla karıştırılan ancak kritik bir ayrımdır. Monitoring, önceden bildiğiniz sorunları tespit etmenizi sağlar. Observability ise sistemin internal state'ini external output'lardan anlayabilme yeteneğidir. Bir başka deyişle, monitoring "ne bozuldu?" sorusuna cevap verirken, observability "neden bozuldu?" sorusuna cevap verir.

Bu rehberde, production sistemlerinizi etkili şekilde izlemek için kullanmanız gereken metrik framework'lerini ve pratik Prometheus örneklerini ele alacağız.

## Four Golden Signals

Google'ın SRE kitabında tanımlanan dört altın sinyal, herhangi bir servisin sağlığını değerlendirmek için izlenmesi gereken temel metriklerdir:

### 1. Latency (Gecikme)

Bir isteğin işlenmesi için geçen süre. Başarılı ve başarısız isteklerin latency'sini ayrı ayrı izlemek önemlidir, çünkü hızlı dönen bir 500 hatası ortalamayı yanıltıcı şekilde düşürür.

```promql
# p99 latency - son 5 dakika
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
)

# Başarılı isteklerin ortalama latency'si
sum(rate(http_request_duration_seconds_sum{status_code=~"2.."}[5m])) by (service)
/
sum(rate(http_request_duration_seconds_count{status_code=~"2.."}[5m])) by (service)
```

### 2. Traffic (Trafik)

Sisteme gelen istek miktarı. HTTP servisler için genellikle requests per second (RPS) olarak ölçülür.

```promql
# Servis bazında RPS
sum(rate(http_requests_total[5m])) by (service)

# Endpoint bazında trafik dağılımı
sum(rate(http_requests_total[5m])) by (handler, method)
```

### 3. Errors (Hatalar)

Başarısız isteklerin oranı. Açık hatalar (5xx), örtük hatalar (başarılı dönen ama yanlış sonuç veren) ve policy ihlalleri (SLO'dan yavaş dönen istekler) olmak üzere üç kategoride değerlendirilir.

```promql
# Error rate yüzdesi
sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (service)
/
sum(rate(http_requests_total[5m])) by (service)
* 100
```

### 4. Saturation (Doygunluk)

Kaynakların ne kadarının kullanıldığını gösterir. CPU, memory, disk I/O ve network bandwidth gibi metrikleri kapsar. Saturation genellikle %100'e ulaşmadan önce performans degradasyonu başlar.

```promql
# Node CPU saturation
1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance)

# Memory saturation
node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes
/
node_memory_MemTotal_bytes
```

## RED Method

Mikroservisler için özellikle uygun olan RED method, her servis için üç metrik izler:

- **Rate**: Saniyedeki istek sayısı
- **Errors**: Saniyedeki hatalı istek sayısı
- **Duration**: Her isteğin aldığı sürenin dağılımı

RED method, request-driven servislere odaklanır ve golden signals'ın bir alt kümesi olarak düşünülebilir.

## USE Method

Brendan Gregg tarafından geliştirilen USE method, her kaynak (CPU, memory, disk, network) için üç metrik izler:

- **Utilization**: Kaynağın meşgul olduğu süre yüzdesi
- **Saturation**: Kaynağın işleyemeyip kuyruğa aldığı iş miktarı
- **Errors**: Hata event'lerinin sayısı

USE method, altyapı seviyesindeki darboğazları tespit etmek için idealdir.

## SLI, SLO ve SLA

### SLI (Service Level Indicator)

Servis kalitesinin ölçülebilir bir metriğidir. Genellikle 0-100% arasında bir oran olarak ifade edilir.

```promql
# Availability SLI: Başarılı isteklerin oranı
sum(rate(http_requests_total{status_code!~"5.."}[30d]))
/
sum(rate(http_requests_total[30d]))
```

### SLO (Service Level Objective)

SLI için belirlenen hedef değerdir. Örneğin: "Availability %99.9 olmalıdır" veya "p99 latency 300ms'nin altında olmalıdır."

Doğru SLO belirlemek hem çok yüksek hem çok düşük hedefler koymaktan kaçınmayı gerektirir. %100 SLO asla kullanılmamalıdır, çünkü hiçbir sistem %100 available olamaz ve bu hedef inovasyonu durdurur.

**Error Budget** kavramı SLO'nun tamamlayıcısıdır. %99.9 SLO hedefi, ayda yaklaşık 43 dakikalık downtime bütçesi anlamına gelir. Bu bütçe tükendiğinde, yeni feature deployment'ları durdurulmalı ve güvenilirlik çalışmalarına odaklanılmalıdır.

```yaml
# Prometheus recording rule - Error budget hesaplama
groups:
  - name: slo_rules
    rules:
      - record: slo:error_budget_remaining
        expr: |
          1 - (
            (1 - sum(rate(http_requests_total{status_code!~"5.."}[30d]))
                / sum(rate(http_requests_total[30d])))
            / (1 - 0.999)
          )
```

### SLA (Service Level Agreement)

Müşteri ile yapılan sözleşmedir ve SLO ihlalinde finansal veya hukuki yaptırımlar içerir. SLA her zaman SLO'dan daha gevşek olmalıdır. Dahili SLO %99.95 ise, harici SLA %99.9 olarak belirlenmelidir.

## DORA Metrikleri

DevOps Research and Assessment (DORA) metrikleri, yazılım delivery performansını ölçmek için kullanılır:

1. **Deployment Frequency**: Ne sıklıkla production'a deploy ediyorsunuz? Elite takımlar günde birden fazla deploy yapar.

2. **Lead Time for Changes**: Commit'ten production deploy'a kadar geçen süre. Elite takımlarda bir saatten azdır.

3. **Change Failure Rate**: Deploy sonrası hata oranı. Elite takımlarda %5'in altındadır.

4. **Mean Time to Recover (MTTR)**: Bir arıza sonrası recovery süresi. Elite takımlarda bir saatten azdır.

Bu metrikleri toplamak için CI/CD pipeline'larınıza instrumentation eklemeniz gerekir:

```yaml
# GitHub Actions'ta deploy event'i kaydetme
- name: Record deployment
  run: |
    curl -X POST $METRICS_ENDPOINT/api/v1/import/prometheus \
      --data-binary "deployment_total{service=\"$SERVICE\",env=\"production\"} 1"

    curl -X POST $METRICS_ENDPOINT/api/v1/import/prometheus \
      --data-binary "deployment_lead_time_seconds{service=\"$SERVICE\"} $LEAD_TIME"
```

## Prometheus ile Custom Metrik Tanımlama

Uygulama seviyesinde custom metrikler tanımlamak, iş mantığını izlemek için gereklidir:

```python
from prometheus_client import Counter, Histogram, Gauge

# İş metrikleri
orders_total = Counter(
    'orders_total',
    'Total number of orders',
    ['status', 'payment_method']
)

order_value = Histogram(
    'order_value_dollars',
    'Order value in dollars',
    buckets=[10, 25, 50, 100, 250, 500, 1000]
)

active_users = Gauge(
    'active_users_total',
    'Number of currently active users'
)

# Kullanım
orders_total.labels(status='completed', payment_method='credit_card').inc()
order_value.observe(149.99)
active_users.set(get_active_user_count())
```

## Alerting Best Practices

Etkili alerting, alert fatigue'den kaçınmak ve gerçek sorunlara hızlı müdahale edebilmek arasındaki dengeyi kurmayı gerektirir.

```yaml
# Symptom-based alert (tercih edilmeli)
- alert: HighErrorRate
  expr: |
    sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (service)
    /
    sum(rate(http_requests_total[5m])) by (service)
    > 0.01
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "{{ $labels.service }} error rate %1'in uzerinde"
    runbook_url: https://wiki.internal/runbooks/high-error-rate

# Multi-window multi-burn-rate alert (SLO-based)
- alert: ErrorBudgetBurn
  expr: |
    (
      slo:error_rate:ratio_rate1h{service="api"} > (14.4 * 0.001)
      and
      slo:error_rate:ratio_rate5m{service="api"} > (14.4 * 0.001)
    )
  for: 2m
  labels:
    severity: critical
```

**Alerting kuralları:**
- Cause-based değil, symptom-based alert yazın. CPU yüksek olduğunda değil, kullanıcı deneyimi etkilendiğinde alert verin.
- Her alert'in bir runbook'u olmalıdır.
- `for` clause kullanarak geçici spike'larda alert oluşmasını engelleyin.
- Severity seviyelerini tutarlı kullanın: critical (sayfa açar, anında müdahale), warning (iş saatlerinde bakılır), info (dashboard'da görünür).
- Multi-window burn rate alerting kullanarak hem kısa süreli şiddetli sorunları hem de uzun süreli yavaş degradasyonları yakalayın.

## Observability Stack Önerisi

Tam kapsamlı bir observability stack için üç sütunu birlikte kullanmanız gerekir:

- **Metrics**: Prometheus + Grafana (veya VictoriaMetrics, Thanos)
- **Logs**: Loki + Grafana (veya ELK Stack)
- **Traces**: Tempo + Grafana (veya Jaeger)

OpenTelemetry, bu üç sinyali tek bir SDK ile toplamayı mümkün kılar ve vendor lock-in riskini azaltır.

Observability yatırımı, ilk bakışta overhead gibi görünebilir. Ancak production'da bir sorun yaşandığında, iyi yapılandırılmış metrikler ve alert'ler MTTR'yi saatlerden dakikalara düşürür. Bu da doğrudan kullanıcı memnuniyeti ve iş sürekliliği anlamına gelir.
