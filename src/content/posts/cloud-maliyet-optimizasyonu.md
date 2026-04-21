---
title: "Cloud Maliyet Optimizasyonu: Faturanızı %40 Azaltmanın Yolları"
excerpt: "Right-sizing, reserved instances, spot instances, auto-scaling stratejileri ve FinOps yaklaşımı ile cloud harcamalarınızı optimize edin."
category: "Cloud Platforms"
date: "2026-03-30"
readTime: "10 dk"
featured: false
tags: ["cloud", "finops", "aws", "maliyet-optimizasyonu"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

Cloud'a geçiş yapan birçok organizasyon, ilk faturalarını gördüklerinde şaşkına döner. On-premise altyapıda sabit olan maliyetler, cloud'da kullanım bazlı fiyatlandırma ile birlikte hızla kontrol dışına çıkabilir. Ancak doğru stratejilerle cloud harcamalarını %30-50 arasında azaltmak mümkündür. Bu rehberde, pratik maliyet optimizasyon tekniklerini ve FinOps yaklaşımını ele alacağız.

## Neden Cloud Maliyetleri Şişer?

Cloud maliyet artışının başlıca nedenleri:

- **Overprovisioning**: Development ortamında production kapasitesinde instance'lar çalıştırmak
- **Zombie kaynaklar**: Kullanılmayan EBS volume'ları, idle load balancer'lar, detach edilmiş elastic IP'ler
- **Yanlış instance tipi**: Compute-intensive iş yükleri için memory-optimized instance seçimi
- **7/24 çalışan dev/staging ortamları**: Mesai saatleri dışında kapatılmayan geliştirme ortamları
- **Data transfer maliyetlerinin gözden kaçması**: Cross-region ve internet egress ücretleri

## Right-Sizing

Right-sizing, workload'larınız için en uygun instance tipini ve boyutunu belirlemektir. AWS'de CloudWatch, GCP'de Recommender API bu konuda öneriler sunar.

```bash
# AWS CLI ile düşük kullanımlı instance'ları tespit etme
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-0abc123def456 \
  --start-time 2026-03-01T00:00:00Z \
  --end-time 2026-03-30T00:00:00Z \
  --period 86400 \
  --statistics Average

# AWS Compute Optimizer önerilerini listeleme
aws compute-optimizer get-ec2-instance-recommendations \
  --filters name=Finding,values=OVER_PROVISIONED
```

Pratik bir kural: Ortalama CPU kullanımı %20'nin altındaysa, bir alt instance tipine geçiş düşünülmelidir. Ancak peak kullanımını da göz önünde bulundurmak gerekir; ortalama düşük olsa bile peak saatlerde bottleneck oluşmamalıdır.

## Reserved Instances ve Savings Plans

Stabil workload'lar için en etkili maliyet azaltma yöntemi commitment-based indirimlerdir.

**Reserved Instances (RI):**
- 1 yıllık RI: On-demand fiyata göre yaklaşık %30-40 indirim
- 3 yıllık RI: Yaklaşık %50-60 indirim
- Upfront ödeme seçeneği ek indirim sağlar

**Savings Plans (AWS):**
- Compute Savings Plans: Instance ailesi, bölge ve OS'tan bağımsız, en esnek seçenek
- EC2 Instance Savings Plans: Belirli instance ailesine commit, daha yüksek indirim

```python
# Savings Plans kapsam analizi - basit hesaplama
on_demand_monthly = 15000  # USD
stable_workload_pct = 0.65  # %65 stabil workload

commitment = on_demand_monthly * stable_workload_pct
savings_plan_rate = 0.60  # %40 indirim ile

new_cost = (commitment * savings_plan_rate) + (on_demand_monthly * (1 - stable_workload_pct))
savings = on_demand_monthly - new_cost
print(f"Aylik tasarruf: ${savings:,.0f}")  # ~$3,900
print(f"Tasarruf orani: {savings/on_demand_monthly*100:.1f}%")  # ~26%
```

Commitment satın alırken dikkat edilmesi gerekenler:
- Son 3 aylık kullanım verisini analiz edin
- Stabil olan base workload'u belirleyin, peak için commitment almayın
- Convertible RI tercih edin; instance tipini değiştirme esnekliği sağlar

## Spot Instances

Spot instance'lar, cloud provider'ın kullanılmayan kapasitesini %60-90 indirimle sunar. Ancak 2 dakika önceden bildirimle geri alınabilirler.

**Spot için uygun workload'lar:**
- Batch processing ve data pipeline'ları
- CI/CD build agent'ları
- Stateless mikroservisler (Kubernetes ile)
- Machine learning training job'ları

**Spot için uygun olmayan workload'lar:**
- Veritabanları
- Stateful singleton servisler
- Uzun süren, checkpoint'siz işler

```yaml
# Kubernetes'te spot node pool tanımı (EKS)
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: production
  region: eu-west-1
managedNodeGroups:
  - name: spot-workers
    instanceTypes:
      - m5.xlarge
      - m5a.xlarge
      - m5d.xlarge
      - m4.xlarge
    spot: true
    minSize: 2
    maxSize: 20
    labels:
      workload-type: spot-tolerant
    taints:
      - key: spot
        value: "true"
        effect: NoSchedule
```

Birden fazla instance tipi belirlemek, spot kapasitesinin bulunma olasılığını artırır. Taint ve toleration mekanizması ile sadece spot-tolerant workload'ların bu node'lara schedule edilmesini sağlayabilirsiniz.

## Auto-Scaling Stratejileri

Doğru yapılandırılmış auto-scaling, hem performansı hem de maliyeti optimize eder.

**Target tracking scaling**: En basit ve etkili yöntemdir. Hedef metriği belirlersiniz, scaling otomatik ayarlanır.

```bash
# AWS Application Auto Scaling - CPU hedefli
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/cluster/my-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 65.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

**Scheduled scaling**: Trafik desenleri öngörülebilirse, belirli saatlerde otomatik scale-out/in yapılabilir.

**Predictive scaling**: AWS'de makine öğrenimi tabanlı predictive scaling, geçmiş desenlere bakarak proaktif şekilde kapasite ayarlar.

## Storage Tiering

Verinin yaşam döngüsüne göre storage tier'ı değiştirmek önemli tasarruf sağlar:

```json
{
  "Rules": [
    {
      "ID": "lifecycle-optimization",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER_IR"
        },
        {
          "Days": 365,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
```

S3 Standard ile Glacier Deep Archive arasındaki fiyat farkı yaklaşık 20 kat olabilir. Log dosyaları, backup'lar ve arşiv verileri için lifecycle policy mutlaka tanımlanmalıdır.

## FinOps Kültürü

FinOps, cloud maliyetlerini mühendislik, finans ve iş birimlerinin birlikte yönettiği bir operasyonel modeldir.

**Temel FinOps pratikleri:**

1. **Tagging stratejisi**: Her kaynak `team`, `environment`, `project` ve `cost-center` tag'leri taşımalıdır. Tag'siz kaynak oluşturmayı engelleyen policy'ler uygulayın.

2. **Showback/Chargeback**: Her takımın kendi cloud harcamalarını görmesini sağlayın. Maliyet farkındalığı, optimizasyonun ilk adımıdır.

3. **Anomaly detection**: Beklenmedik maliyet artışlarını tespit etmek için AWS Cost Anomaly Detection veya benzeri araçlar kullanın.

4. **Budget alertleri**: Her proje için aylık bütçe limitleri belirleyin ve %80 eşiğinde uyarı alın.

```bash
# AWS Budget oluşturma
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "team-alpha-monthly",
    "BudgetLimit": {"Amount": "5000", "Unit": "USD"},
    "BudgetType": "COST",
    "TimeUnit": "MONTHLY"
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "devops@company.com"
    }]
  }]'
```

## Maliyet Monitoring Araçları

- **AWS Cost Explorer / GCP Billing Reports**: Native maliyet analiz araçları
- **Kubecost**: Kubernetes workload bazında maliyet breakdown'u
- **Infracost**: Terraform plan aşamasında maliyet tahmini
- **OpenCost**: CNCF projesi, vendor-agnostic Kubernetes maliyet izleme

```bash
# Infracost ile PR'da maliyet etkisini görme
infracost breakdown --path=. --format=json --out-file=/tmp/infracost.json
infracost comment github \
  --path=/tmp/infracost.json \
  --repo=org/infra \
  --pull-request=42 \
  --github-token=$GITHUB_TOKEN
```

Cloud maliyet optimizasyonu tek seferlik bir proje değil, sürekli bir pratiktir. Aylık maliyet review toplantıları düzenleyin, her sprint'e en az bir optimizasyon task'ı dahil edin ve mühendislerin maliyet bilincini artırın. Küçük adımlarla başlayıp tutarlı şekilde devam etmek, uzun vadede ciddi tasarruflar sağlar.
