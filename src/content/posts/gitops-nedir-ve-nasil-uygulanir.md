---
title: "GitOps Nedir ve Nasıl Uygulanır? Kapsamlı Rehber"
excerpt: "Git'i single source of truth olarak kullanarak altyapı ve uygulama dağıtımını otomatize edin. ArgoCD ve Flux ile pratik GitOps implementasyonu."
category: "CI/CD & Automation"
date: "2026-04-08"
readTime: "11 dk"
featured: true
tags: ["gitops", "argocd", "flux", "kubernetes"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

GitOps, altyapı ve uygulama dağıtımının tamamını Git repository'leri üzerinden yönetmeyi esas alan bir operasyonel framework'tür. Geleneksel CI/CD pipeline'larından farklı olarak, GitOps'ta desired state her zaman Git'te tanımlıdır ve bir operator bu state'i cluster ile sürekli olarak reconcile eder. Bu yaklaşım hem auditability hem de reproducibility açısından ciddi avantajlar sunar.

## GitOps'un Temel Prensipleri

GitOps'un dört temel prensibi vardır:

1. **Declarative Configuration**: Tüm sistem declarative olarak tanımlanmalıdır. Kubernetes manifest'leri, Helm chart'ları veya Kustomize overlay'leri bu ihtiyacı karşılar.

2. **Versioned and Immutable**: Desired state Git'te saklanır. Her değişiklik bir commit'tir, dolayısıyla tam bir audit trail elde edilir.

3. **Pulled Automatically**: Onaylanmış değişiklikler otomatik olarak sisteme uygulanır. Manuel `kubectl apply` ihtiyacı ortadan kalkar.

4. **Continuously Reconciled**: Bir agent, mevcut durumu sürekli olarak desired state ile karşılaştırır ve drift tespit ederse düzeltir.

## Push Model vs Pull Model

Geleneksel CI/CD pipeline'ları push model kullanır. Jenkins veya GitHub Actions gibi araçlar build sonrası doğrudan cluster'a deploy eder. Bu modelde CI sistemi cluster credentials'a sahip olmalıdır, bu da güvenlik açısından bir risk oluşturur.

Pull model'de ise cluster içinde çalışan bir operator, Git repository'sini izler ve değişiklik tespit ettiğinde deploy işlemini kendisi gerçekleştirir. Credentials cluster dışına çıkmaz.

```
Push Model:
Developer → Git Push → CI Build → CI Deploy → Cluster
                                    ↑
                        (CI'ın cluster erişimi gerekir)

Pull Model:
Developer → Git Push → CI Build → Image Registry
                                        ↓
                    Cluster ← GitOps Operator ← Git Repo
                    (Operator cluster içinde çalışır)
```

Pull model'in avantajları:
- CI sisteminin cluster credentials'a ihtiyacı yoktur
- Cluster dışından yapılan manuel değişiklikler otomatik olarak geri alınır
- Drift detection sayesinde desired state her zaman korunur

## ArgoCD ile GitOps Implementasyonu

ArgoCD, Kubernetes için en yaygın kullanılan GitOps aracıdır. Deklaratif uygulama tanımlarını Git'ten okuyarak cluster state'ini yönetir.

### ArgoCD Kurulumu

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Admin şifresini alın
argocd admin initial-password -n argocd

# CLI ile login
argocd login localhost:8080
```

### Application Tanımı

ArgoCD'de bir Application objesi, hangi Git repo'sundan hangi cluster'a deploy yapılacağını tanımlar:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/k8s-manifests.git
    targetRevision: main
    path: apps/my-app/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

`selfHeal: true` ayarı, cluster'da manuel yapılan değişikliklerin otomatik olarak geri alınmasını sağlar. `prune: true` ise Git'ten silinen kaynakların cluster'dan da kaldırılmasını garanti eder.

### ApplicationSet ile Multi-Cluster Yönetimi

Birden fazla ortam veya cluster yönetiyorsanız, ApplicationSet kullanarak tek bir tanımdan birden fazla Application oluşturabilirsiniz:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: my-app-set
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - cluster: staging
            url: https://staging-api.example.com
          - cluster: production
            url: https://prod-api.example.com
  template:
    metadata:
      name: 'my-app-{{cluster}}'
    spec:
      source:
        repoURL: https://github.com/org/k8s-manifests.git
        path: 'apps/my-app/overlays/{{cluster}}'
        targetRevision: main
      destination:
        server: '{{url}}'
        namespace: my-app
```

## Flux ile GitOps Implementasyonu

Flux, CNCF graduated projesi olarak GitOps toolkit yaklaşımını benimser. Her bileşen (source controller, kustomize controller, helm controller) bağımsız çalışır.

### Flux Bootstrap

```bash
flux bootstrap github \
  --owner=my-org \
  --repository=fleet-infra \
  --branch=main \
  --path=clusters/production \
  --personal
```

### Kustomization Tanımı

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 5m
  path: ./apps/my-app
  prune: true
  sourceRef:
    kind: GitRepository
    name: fleet-infra
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: my-app
      namespace: production
  timeout: 3m
```

### Flux ile Helm Release Yönetimi

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: redis
  namespace: production
spec:
  interval: 10m
  chart:
    spec:
      chart: redis
      version: "18.x"
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: flux-system
  values:
    architecture: standalone
    auth:
      enabled: true
      existingSecret: redis-secret
```

## Repository Yapısı

GitOps repository'nizi nasıl organize ettiğiniz büyük önem taşır. En yaygın iki yaklaşım:

**Monorepo yaklaşımı** (küçük-orta takımlar için):
```
fleet-infra/
├── apps/
│   ├── frontend/
│   │   ├── base/
│   │   └── overlays/
│   │       ├── staging/
│   │       └── production/
│   └── backend/
│       ├── base/
│       └── overlays/
├── infrastructure/
│   ├── monitoring/
│   └── ingress/
└── clusters/
    ├── staging/
    └── production/
```

**Polyrepo yaklaşımı** (büyük organizasyonlar için): Her uygulama ve altyapı bileşeni ayrı repository'de tutulur. Bu yaklaşım erişim kontrolü ve bağımsız release cycle'ları açısından esneklik sağlar.

## GitOps vs Geleneksel CI/CD: Ne Zaman Hangisi?

GitOps her senaryo için ideal değildir. Karar verirken şu kriterleri değerlendirin:

**GitOps tercih edin:**
- Kubernetes tabanlı altyapınız varsa
- Multi-cluster veya multi-environment yönetiyorsanız
- Audit ve compliance gereksinimleri yüksekse
- Drift detection kritikse

**Geleneksel CI/CD yeterli olabilir:**
- Basit ve tek ortamlı deployment'larınız varsa
- Kubernetes kullanmıyorsanız
- Takım GitOps öğrenme eğrisine hazır değilse

## Best Practices

1. **Sealed Secrets veya External Secrets kullanın.** Secret'ları asla plain text olarak Git'e commit etmeyin. Sealed Secrets, SOPS veya External Secrets Operator ile secret yönetimini güvenli hale getirin.

2. **Branch protection uygulayın.** Main branch'e doğrudan push engellenmelidir. Her değişiklik PR üzerinden review edilerek merge edilmelidir.

3. **Image tag olarak digest kullanın.** `latest` veya mutable tag'ler yerine immutable digest kullanarak reproducibility'yi garanti edin.

4. **Progressive delivery entegre edin.** ArgoCD Rollouts veya Flagger ile canary veya blue-green deployment stratejileri uygulayın.

5. **Notification entegrasyonu kurun.** Sync başarısız olduğunda Slack veya PagerDuty bildirimi alacak şekilde yapılandırın.

6. **Reconciliation interval'ini dikkatli ayarlayın.** Çok kısa interval API server'a yük bindirir, çok uzun interval ise değişikliklerin geç uygulanmasına neden olur. 3-5 dakika genellikle makul bir değerdir.

GitOps, doğru uygulandığında deployment güvenilirliğini artırır, rollback süresini saniyeler mertebesine düşürür ve tam bir audit trail sağlar. Ancak başarılı bir implementasyon, disiplinli bir Git workflow'u ve takımın bu yaklaşımı benimsemesini gerektirir.
