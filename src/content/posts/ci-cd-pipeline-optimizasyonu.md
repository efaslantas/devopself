---
title: "CI/CD Pipeline Optimizasyonu: Build Sürelerinizi %60 Azaltın"
excerpt: "Yavaş pipeline'lar geliştirici verimliliğini öldürür. Caching, parallelization ve smart testing stratejileri ile pipeline'ınızı hızlandırın."
category: "CI/CD & Automation"
date: "2026-03-28"
readTime: "10 dk"
featured: false
tags: ["ci-cd", "pipeline", "optimizasyon", "github-actions"]
---

Yavaş CI/CD pipeline'ları, geliştirici deneyiminin sessiz katilidir. Her commit'te 20 dakika beklemek, günde onlarca kez tekrarlandığında saatler süren boşa geçen zamana dönüşür. Dahası, yavaş pipeline'lar geliştiricileri daha az commit yapmaya, büyük batch'ler halinde değişiklik göndermeye iter; bu da code review kalitesini düşürür ve merge conflict riskini artırır.

Bu yazıda, CI/CD pipeline'ınızı somut tekniklerle nasıl hızlandırabileceğinizi ele alıyoruz. Örnekler GitHub Actions üzerinden verilmiştir, ancak prensipler GitLab CI, Jenkins veya CircleCI gibi diğer platformlara da uygulanabilir.

## Docker Layer Caching

Docker image build süresi, pipeline'ların en yavaş adımlarından biridir. Docker'ın katmanlı yapısını cache olarak kullanmak, build süresini dramatik şekilde azaltır.

```yaml
# GitHub Actions - Docker Build with Cache
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

GitHub Actions'ın native cache backend'i (`type=gha`) ile BuildKit cache'ini doğrudan CI ortamında saklayabilirsiniz. Alternatif olarak registry-based caching de kullanılabilir:

```yaml
cache-from: type=registry,ref=ghcr.io/myorg/myapp:cache
cache-to: type=registry,ref=ghcr.io/myorg/myapp:cache,mode=max
```

Dockerfile'ınızı cache-friendly yazmak da kritiktir. Sık değişen katmanları (uygulama kodu) sona, nadir değişen katmanları (dependency kurulumu) başa koyun:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Dependency katmanı - sadece package dosyaları değiştiğinde rebuild
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Uygulama kodu - her commit'te değişir
COPY . .
RUN npm run build
```

## Dependency Caching

Paket yöneticisi bağımlılıklarını her build'de sıfırdan indirmek gereksiz zaman kaybıdır. Tüm büyük CI platformları dependency caching destekler.

```yaml
# GitHub Actions - Node.js dependency cache
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

# Veya manuel cache kontrolü
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
```

Farklı diller için cache path'leri:

| Dil | Cache Path | Key Dosyası |
|-----|-----------|-------------|
| Node.js | `~/.npm` veya `node_modules` | `package-lock.json` |
| Python | `~/.cache/pip` | `requirements.txt` / `poetry.lock` |
| Go | `~/go/pkg/mod` | `go.sum` |
| Rust | `~/.cargo/registry` + `target/` | `Cargo.lock` |

## Parallel Test Execution

Testleri seri çalıştırmak, pipeline süresini gereksiz yere uzatır. Test suite'inizi paralel job'lara bölmek en etkili optimizasyonlardan biridir.

```yaml
# GitHub Actions - Matrix Strategy ile Paralel Testler
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          npx jest --shard=${{ matrix.shard }}/4
```

Jest, pytest ve diğer modern test framework'leri native sharding desteği sunar. `fail-fast: false` ayarı, bir shard başarısız olduğunda diğerlerinin de çalışmaya devam etmesini sağlar; böylece tüm hataları tek seferde görebilirsiniz.

Daha gelişmiş bir yaklaşım olarak, test sürelerine göre dinamik sharding yapabilirsiniz. Önceki çalışmalardan elde edilen timing bilgileriyle test'leri eşit süreli gruplara ayırmak, shard'lar arası dengesizliği ortadan kaldırır.

## Selective Testing (Akıllı Test Seçimi)

Her commit'te tüm test suite'ini çalıştırmak çoğu zaman gereksizdir. Değişen dosyalara göre sadece etkilenen testleri çalıştırmak büyük zaman tasarrufu sağlar.

```yaml
# Değişen dosyalara göre test seçimi
- name: Get changed files
  id: changed
  uses: tj-actions/changed-files@v44
  with:
    files_yaml: |
      backend:
        - 'src/api/**'
        - 'src/services/**'
      frontend:
        - 'src/ui/**'
        - 'src/components/**'
      infra:
        - 'terraform/**'
        - 'kubernetes/**'

- name: Run backend tests
  if: steps.changed.outputs.backend_any_changed == 'true'
  run: npm run test:backend

- name: Run frontend tests
  if: steps.changed.outputs.frontend_any_changed == 'true'
  run: npm run test:frontend
```

Monorepo'larda bu yaklaşım özellikle değerlidir. Nx, Turborepo veya Bazel gibi build araçları, dependency graph'ını analiz ederek sadece etkilenen projelerin testlerini çalıştırır.

## Artifact Reuse

Aynı artifact'ı birden fazla kez build etmek yaygın bir israftır. Build artifact'larını bir kez oluşturup, sonraki adımlarda yeniden kullanın.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build application
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
          retention-days: 1

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - name: Run tests
        run: npm run test:e2e

  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - name: Deploy
        run: ./scripts/deploy.sh
```

Bu pattern ile build bir kez yapılır, test ve deploy aşamalarında aynı artifact kullanılır. Hem tutarlılık sağlar hem de toplam pipeline süresini kısaltır.

## Build Matrix Optimizasyonu

Multi-platform veya multi-version testleri kaçınılmaz olabilir, ancak akıllıca yapılandırılmalıdır.

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest]
        node: [18, 20, 22]
        include:
          # macOS ve Windows sadece ana versiyon için
          - os: macos-latest
            node: 20
          - os: windows-latest
            node: 20
```

Tüm OS ve versiyon kombinasyonlarını test etmek yerine, kritik kombinasyonlara odaklanın. Tam matrix'i sadece release öncesi veya scheduled workflow'larda çalıştırın.

## Monorepo Stratejileri

Monorepo'larda pipeline optimizasyonu ekstra önem taşır. Turborepo ile remote caching örneği:

```yaml
- name: Build with Turborepo
  run: npx turbo run build test lint --filter=...[HEAD^1]
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

`--filter=...[HEAD^1]` flag'i, son commit'ten bu yana değişen paketleri ve onlara bağımlı olan paketleri belirler. Remote cache sayesinde, bir geliştiricinin lokal ortamında build ettiği artifact'lar CI'da yeniden kullanılabilir.

## Ölçün ve İyileştirin

Optimizasyon yapmadan önce mevcut durumu ölçmek şarttır. GitHub Actions'ta her adımın süresini workflow summary'den görebilirsiniz. Daha detaylı analiz için:

- **GitHub Actions**: Workflow timing API'si ve üçüncü parti araçlar (BuildPulse, Datadog CI Visibility)
- **GitLab CI**: Pipeline analytics dashboard
- **Jenkins**: Pipeline Stage View ve Blue Ocean

Hedef metrikler belirleyin:
- PR pipeline süresi: 10 dakikanın altında
- Main branch pipeline: 15 dakikanın altında
- Deployment pipeline: 5 dakikanın altında

## Sonuç

Pipeline optimizasyonu tek seferlik bir proje değil, sürekli bir süreçtir. Küçük iyileştirmeler birikerek büyük farklar yaratır. Docker layer caching tek başına build süresini yarıya indirebilir. Paralel test execution ile test süresi shard sayısına bölünür. Selective testing ile gereksiz çalışmalar ortadan kalkar.

En önemli adım ölçmekle başlar. Pipeline sürelerinizi izleyin, darboğazları tespit edin ve yukarıdaki teknikleri sırasıyla uygulayın. Hedef, geliştiricilerin pipeline'ı bir engel olarak değil, güvenli ve hızlı bir geçit olarak görmesini sağlamaktır.
