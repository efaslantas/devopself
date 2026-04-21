---
title: "GitHub Actions ile CI/CD Pipeline: Adım Adım Rehber"
excerpt: "GitHub Actions ile sıfırdan CI/CD pipeline kurulumu. Workflow yazımı, secret yönetimi, matrix build ve deployment stratejileri."
category: "CI/CD & Automation"
date: "2026-04-09"
readTime: "12 dk"
featured: true
tags: ["github-actions", "ci-cd", "pipeline", "otomasyon"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

# GitHub Actions ile CI/CD Pipeline: Adım Adım Rehber

GitHub Actions, yazılım geliştirme süreçlerinizi doğrudan GitHub repository'niz içinde otomatikleştirmenizi sağlar. Bu rehberde sıfırdan production-ready bir CI/CD pipeline kurulumunu adım adım ele alıyoruz.

## GitHub Actions Nedir?

GitHub Actions, event-driven bir otomasyon platformudur. Push, pull request, schedule gibi olaylara tepki veren **workflow** dosyaları ile CI/CD süreçlerinizi yönetirsiniz. Jenkins veya GitLab CI'a kıyasla en büyük avantajı: altyapı yönetimi gerektirmez ve GitHub ekosistemiyle native entegre çalışır.

## Temel Kavramlar

Bir GitHub Actions pipeline'ı şu bileşenlerden oluşur:

- **Workflow**: `.github/workflows/` dizinindeki YAML dosyaları
- **Job**: Workflow içindeki paralel veya sıralı iş birimleri
- **Step**: Job içindeki her bir komut veya action
- **Action**: Yeniden kullanılabilir otomasyon birimleri
- **Runner**: Workflow'un çalıştığı makine (GitHub-hosted veya self-hosted)

## İlk Workflow Dosyanızı Oluşturun

Basit bir Node.js projesi için CI workflow'u oluşturalım.

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

Bu workflow her push ve pull request'te otomatik olarak test ve build süreçlerini çalıştırır.

## Matrix Build ile Çoklu Ortam Testi

Uygulamanızı birden fazla Node.js versiyonu ve işletim sisteminde test etmek için matrix strategy kullanın.

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node-version: [18, 20, 22]
      fail-fast: false

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

`fail-fast: false` ile bir kombinasyon başarısız olsa bile diğer testler çalışmaya devam eder. Bu sayede tüm uyumsuzlukları tek seferde görebilirsiniz.

## Secret Yönetimi

API key, token ve şifre gibi hassas bilgileri **GitHub Secrets** ile güvenli şekilde saklayın.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: |
          aws s3 sync ./dist s3://my-bucket --delete
```

### Secret Yönetimi Best Practice'leri

- Repository seviyesinde secret tanımlayın: **Settings > Secrets and variables > Actions**
- Environment secret'ları ile ortam bazlı izolasyon sağlayın (staging, production)
- **GITHUB_TOKEN** otomatik olarak sağlanır, ekstra secret oluşturmanıza gerek yoktur
- Secret'ları log'lara yazdırmamaya dikkat edin; GitHub otomatik maskeleme yapar

## Docker Image Build ve Push

Container tabanlı deployment için Docker image build ve registry push workflow'u:

```yaml
name: Docker Build & Push

on:
  push:
    tags: ["v*"]

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

`cache-from` ve `cache-to` parametreleri GitHub Actions cache'ini kullanarak build sürelerini önemli ölçüde kısaltır.

## Deployment Stratejileri

### Environment ve Approval Gates

Production deployment için onay mekanizması ekleyin:

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production
```

GitHub'da **Environment protection rules** tanımlayarak production deployment öncesinde manuel onay zorunluluğu ekleyebilirsiniz.

### Kubernetes Deployment

```yaml
  deploy-k8s:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > $HOME/.kube/config

      - name: Deploy to cluster
        run: |
          kubectl set image deployment/myapp \
            myapp=ghcr.io/${{ github.repository }}:${{ github.sha }}
          kubectl rollout status deployment/myapp --timeout=300s
```

## Caching ile Pipeline Hızlandırma

Dependency cache kullanarak pipeline sürelerini yarıya indirebilirsiniz.

```yaml
      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
```

## Reusable Workflows

Tekrar eden pipeline tanımlarını **reusable workflow** olarak merkezileştirin:

```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci && npm test
```

```yaml
# .github/workflows/ci.yml - Ana workflow'dan çağırma
jobs:
  call-tests:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: "20"
```

## Self-Hosted Runner Kurulumu

GitHub-hosted runner'lar yetmediğinde kendi runner'ınızı ekleyin:

```bash
# Runner kurulumu
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.319.0/actions-runner-linux-x64-2.319.0.tar.gz
tar xzf actions-runner-linux-x64.tar.gz

# Konfigürasyon
./config.sh --url https://github.com/OWNER/REPO --token YOUR_TOKEN

# Servis olarak çalıştırma
sudo ./svc.sh install
sudo ./svc.sh start
```

```yaml
# Self-hosted runner kullanımı
jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - run: make build
```

## Pipeline Optimizasyon İpuçları

1. **Concurrency kontrolü**: Aynı branch için çalışan eski workflow'ları iptal edin
2. **Path filter**: Sadece ilgili dosyalar değiştiğinde çalıştırın
3. **Job dependency**: `needs` ile sıralı çalışma zorunluluğu tanımlayın

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

on:
  push:
    paths:
      - "src/**"
      - "package.json"
      - ".github/workflows/**"
```

## Sonuç

GitHub Actions, CI/CD pipeline'larınızı kod olarak yönetmenin en pratik yollarından biri. Matrix build, caching, reusable workflow ve environment protection gibi özellikler ile production-grade pipeline'lar oluşturabilirsiniz. Pipeline optimizasyonu hakkında daha fazla ipucu için [CI/CD pipeline optimizasyonu](/blog/ci-cd-pipeline-optimizasyonu) yazımıza göz atın. GitOps yaklaşımıyla deployment süreçlerinizi ilerletmek istiyorsanız [GitOps nedir ve nasıl uygulanır](/blog/gitops-nedir-ve-nasil-uygulanir) rehberimizi inceleyebilirsiniz.
