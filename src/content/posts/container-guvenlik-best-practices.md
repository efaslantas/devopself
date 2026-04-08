---
title: "Container Güvenliği: 10 Kritik Best Practice"
excerpt: "Container image güvenliğinden runtime protection'a kadar üretim ortamında konteyner güvenliğini sağlamanın en etkili yolları."
category: "Security & Compliance"
date: "2026-03-15"
readTime: "9 dk"
featured: false
tags: ["container", "güvenlik", "docker", "kubernetes"]
---

Container teknolojisi uygulama dağıtımını kolaylaştırırken, beraberinde yeni güvenlik zorlukları getirdi. Yanlış yapılandırılmış bir container, tüm altyapınız için bir giriş noktası haline gelebilir. Bu yazıda, production ortamında container güvenliğini sağlamak için uygulamanız gereken 10 kritik best practice'i ele alıyoruz.

## 1. Minimal Base Image Kullanın

Base image ne kadar büyükse, saldırı yüzeyi o kadar geniştir. `ubuntu:latest` yerine minimal alternatifleri tercih edin.

```dockerfile
# Kötü: Gereksiz paketlerle dolu büyük image
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y python3 python3-pip
COPY . /app
CMD ["python3", "/app/main.py"]

# İyi: Minimal base image
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python3", "main.py"]
```

**Distroless** image'ları bir adım daha ileri gider: shell, paket yöneticisi veya gereksiz sistem araçları içermezler. Google'ın distroless image'ları production workload'ları için idealdir.

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o /server

FROM gcr.io/distroless/static-debian12
COPY --from=builder /server /server
CMD ["/server"]
```

Alpine tabanlı image'lar da küçüktür, ancak musl libc kullanımı bazı uygulamalarda uyumsuzluğa yol açabilir. Uygulamanızla test edin.

## 2. Image Vulnerability Scanning

Her build'de image'ınızı bilinen güvenlik açıklarına karşı tarayın. Bu adım CI/CD pipeline'ınızın ayrılmaz parçası olmalıdır.

```yaml
# GitHub Actions - Trivy ile vulnerability scanning
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:${{ github.sha }}'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'

- name: Upload scan results
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: 'trivy-results.sarif'
```

`exit-code: '1'` ayarı, kritik veya yüksek seviye güvenlik açığı bulunduğunda pipeline'ı durdurur. Böylece güvenlik açığı olan image'lar production'a ulaşamaz.

Popüler scanning araçları:
- **Trivy**: Açık kaynak, hızlı ve kapsamlı. Container image, filesystem ve IaC dosyalarını tarar
- **Snyk Container**: Developer-friendly arayüz, fix önerileri sunar
- **Grype**: Anchore tarafından geliştirilen açık kaynak vulnerability scanner

## 3. Non-Root Container Çalıştırın

Container'ları root kullanıcıyla çalıştırmak, container escape durumunda host sisteme root erişimi sağlayabilir.

```dockerfile
FROM node:20-slim

# Uygulama kullanıcısı oluştur
RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser

WORKDIR /app
COPY --chown=appuser:appuser . .
RUN npm ci --production

# Root'tan çık
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
```

Kubernetes tarafında SecurityContext ile bu kuralı zorunlu kılın:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
```

## 4. Read-Only Filesystem

Container'ın filesystem'ini read-only yapmak, saldırganın dosya sistemi üzerinde değişiklik yapmasını engeller.

```yaml
securityContext:
  readOnlyRootFilesystem: true
```

Uygulamanız geçici dosyalara yazma ihtiyacı duyuyorsa, `emptyDir` volume mount kullanın:

```yaml
volumeMounts:
  - name: tmp
    mountPath: /tmp
  - name: cache
    mountPath: /app/cache
volumes:
  - name: tmp
    emptyDir:
      sizeLimit: 100Mi
  - name: cache
    emptyDir:
      sizeLimit: 500Mi
```

## 5. Secrets Management

Environment variable veya Dockerfile içinde secret hardcode etmek, en yaygın ve tehlikeli hatalardan biridir.

```dockerfile
# ASLA bunu yapmayın
ENV DATABASE_PASSWORD=supersecret123
```

Doğru yaklaşım, harici bir secrets management çözümü kullanmaktır:

- **HashiCorp Vault**: Vault Agent Sidecar Injector ile Kubernetes pod'larına otomatik secret enjeksiyonu
- **External Secrets Operator**: AWS Secrets Manager, Azure Key Vault, GCP Secret Manager entegrasyonu
- **Sealed Secrets**: GitOps workflow'larında encrypted secret'ları Git'te saklama

```yaml
# External Secrets Operator örneği
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: api-secrets
spec:
  refreshInterval: 15m
  secretStoreRef:
    name: vault-store
    kind: ClusterSecretStore
  target:
    name: api-secrets
  data:
  - secretKey: DB_PASSWORD
    remoteRef:
      key: secret/production/api
      property: db_password
```

## 6. Network Policies Uygulayın

Varsayılan olarak Kubernetes'te tüm pod'lar birbirleriyle iletişim kurabilir. Zero-trust prensibiyle varsayılan olarak tüm trafiği engelleyin, ardından sadece gerekli iletişimlere izin verin.

```yaml
# Varsayılan olarak tüm trafiği engelle
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

Bu deny-all policy'den sonra, her servis için spesifik ingress ve egress kuralları tanımlayın.

## 7. Runtime Security ile Tehdit Tespiti

Image scanning statik bir kontroldür; çalışma zamanındaki tehditleri yakalayamaz. Falco gibi runtime security araçları, container davranışını gerçek zamanlı izler.

```yaml
# Falco kuralı: Container içinde shell açılması tespiti
- rule: Terminal shell in container
  desc: A shell was used as the entrypoint/exec point
  condition: >
    spawned_process and container and
    shell_procs and proc.tty != 0 and
    container_entrypoint
  output: >
    Shell opened in container
    (user=%user.name container=%container.name
    shell=%proc.name parent=%proc.pname)
  priority: WARNING
  tags: [container, shell, mitre_execution]
```

Falco şu tür şüpheli aktiviteleri tespit edebilir:
- Container içinde beklenmedik process çalışması
- Hassas dosyalara erişim (/etc/shadow, /etc/passwd)
- Beklenmedik network bağlantıları
- Privilege escalation girişimleri

## 8. Image Signing ve Verification

Supply chain saldırılarına karşı, container image'larınızı imzalayın ve deployment sırasında imzayı doğrulayın.

```bash
# Cosign ile image imzalama
cosign sign --key cosign.key ghcr.io/myorg/myapp:v1.0.0

# Image imzasını doğrulama
cosign verify --key cosign.pub ghcr.io/myorg/myapp:v1.0.0
```

Kubernetes tarafında, Kyverno veya Sigstore Policy Controller ile sadece imzalı image'ların çalışmasını zorunlu kılabilirsiniz:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds:
          - Pod
    verifyImages:
    - imageReferences:
      - "ghcr.io/myorg/*"
      attestors:
      - entries:
        - keys:
            publicKeys: |-
              -----BEGIN PUBLIC KEY-----
              ...
              -----END PUBLIC KEY-----
```

## 9. Supply Chain Security

Container image'ınızın bağımlılık zincirini korumak, tek bir güvenlik açığının tüm sistemi etkilemesini önler.

- **SBOM (Software Bill of Materials)**: Syft ile image'ınızdaki tüm bileşenlerin envanterini çıkarın
- **Private Registry**: Docker Hub yerine özel registry kullanın ve pull policy'lerini sıkılaştırın
- **Base Image Pinning**: Tag yerine digest kullanarak base image'ın değişmemesini garanti edin

```dockerfile
# Tag yerine digest kullanın
FROM node:20-slim@sha256:a1b2c3d4e5f6...
```

## 10. Kapsamlı Security Context

Tüm güvenlik ayarlarını bir arada uygulayan kapsamlı bir Pod Security Context örneği:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: ghcr.io/myorg/myapp:v1.0.0@sha256:abc123...
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL
    resources:
      limits:
        memory: "256Mi"
        cpu: "500m"
      requests:
        memory: "128Mi"
        cpu: "250m"
```

Bu konfigürasyon şunları sağlar:
- Non-root kullanıcı ile çalışma
- Privilege escalation engelleme
- Read-only filesystem
- Tüm Linux capability'lerinin kaldırılması
- Seccomp profili ile syscall filtreleme
- Resource limits ile kaynak kısıtlama

## Sonuç

Container güvenliği, build zamanından runtime'a kadar uzanan çok katmanlı bir yaklaşım gerektirir. Minimal image ile saldırı yüzeyini daraltın, vulnerability scanning ile bilinen açıkları yakalayın, runtime security ile çalışma zamanı tehditlerini tespit edin ve supply chain security ile bağımlılık zincirini koruyun.

Bu 10 best practice'i uygulamak, container ortamınızın güvenlik seviyesini önemli ölçüde yükseltecektir. Ancak güvenlik bir ürün değil, süreçtir. Düzenli güvenlik denetimleri yapın, araçlarınızı güncel tutun ve ekibinizi container güvenliği konusunda sürekli eğitin.
