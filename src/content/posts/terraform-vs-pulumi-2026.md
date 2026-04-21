---
title: "Terraform vs Pulumi: 2026'da Hangisini Seçmeli?"
excerpt: "Infrastructure as Code dünyasının iki büyük oyuncusunu detaylı karşılaştırıyoruz. HCL vs gerçek programlama dilleri, ekosistem, topluluk ve maliyet analizi."
category: "Infrastructure as Code"
date: "2026-04-02"
readTime: "14 dk"
featured: true
tags: ["terraform", "pulumi", "iac", "karşılaştırma"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

Infrastructure as Code (IaC), modern DevOps pratiklerinin temel taşlarından biridir. Altyapınızı kod olarak tanımlamak; tekrarlanabilirlik, versiyon kontrolü ve otomasyon sağlar. Bu alanda iki büyük oyuncu öne çıkıyor: HashiCorp Terraform ve Pulumi. 2026 itibarıyla her iki araç da önemli gelişmeler kaydetti. Peki hangi durumda hangisini tercih etmelisiniz?

## Dil ve Söz Dizimi

Bu iki aracı birbirinden ayıran en temel fark, altyapı tanımlarının yazıldığı dildir.

### Terraform: HCL (HashiCorp Configuration Language)

Terraform, kendi domain-specific language'i olan HCL'i kullanır. HCL deklaratif bir dildir ve altyapı tanımları için özel olarak tasarlanmıştır.

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"

  tags = {
    Name        = "web-server"
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "web_sg" {
  name_prefix = "web-"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

HCL'in avantajı basitliğidir. Programlama bilgisi olmayan ekip üyeleri bile HCL kodunu okuyup anlayabilir. Ancak karmaşık mantık gerektiren senaryolarda (dinamik resource oluşturma, koşullu yapılar) HCL'in sınırları ortaya çıkar. `for_each`, `count` ve `dynamic` blokları bu sınırları bir ölçüde aşsa da, gerçek bir programlama dilinin esnekliğini sunmaz.

### Pulumi: Gerçek Programlama Dilleri

Pulumi, TypeScript, Python, Go, C#, Java ve YAML dahil birçok dili destekler. Altyapı tanımlarınızı zaten bildiğiniz bir dilde yazarsınız.

```typescript
import * as aws from "@pulumi/aws";

const webServer = new aws.ec2.Instance("web", {
  ami: "ami-0c55b159cbfafe1f0",
  instanceType: "t3.medium",
  tags: {
    Name: "web-server",
    Environment: "production",
  },
});

const securityGroup = new aws.ec2.SecurityGroup("web-sg", {
  namePrefix: "web-",
  ingress: [{
    fromPort: 443,
    toPort: 443,
    protocol: "tcp",
    cidrBlocks: ["0.0.0.0/0"],
  }],
});

// Gerçek programlama dili avantajı: dinamik yapılar
const environments = ["dev", "staging", "production"];
const buckets = environments.map(env =>
  new aws.s3.Bucket(`data-${env}`, {
    bucket: `myapp-data-${env}`,
    tags: { Environment: env },
  })
);
```

Gerçek programlama dili kullanmanın avantajları belirgindir: IDE desteği (auto-complete, type checking), mevcut kütüphaneleri kullanabilme, unit test yazabilme ve karmaşık mantığı doğal şekilde ifade edebilme.

## State Management

Her iki araç da altyapınızın mevcut durumunu bir state dosyasında tutar. Ancak yaklaşımları farklıdır.

**Terraform State:**
- Varsayılan olarak lokal dosyada saklanır (`terraform.tfstate`)
- Remote backend olarak S3, GCS, Azure Blob veya Terraform Cloud kullanılabilir
- State locking için DynamoDB (AWS) veya benzeri mekanizmalar gerekir
- State dosyasında hassas veriler açık metin olarak bulunabilir; şifreleme yapılandırması ek adım gerektirir

**Pulumi State:**
- Varsayılan olarak Pulumi Cloud'da (SaaS) saklanır
- Self-hosted backend olarak S3, Azure Blob, GCS veya lokal dosya sistemi desteklenir
- State otomatik olarak şifrelenir
- Pulumi Cloud üzerinden state geçmişi ve diff görüntüleme mümkündür

Terraform'un state yönetimi daha fazla manuel yapılandırma gerektirirken, Pulumi varsayılan olarak daha güvenli bir başlangıç sunar. Ancak Pulumi Cloud'a bağımlılık istemeyenler için self-hosted seçeneklerin yapılandırılması gerekir.

## Provider Ekosistemi

Bu karşılaştırmada Terraform açık ara öndedir. Terraform Registry'de 4000'den fazla provider bulunur. AWS, Azure, GCP gibi büyük bulut sağlayıcılarından Cloudflare, Datadog, PagerDuty gibi SaaS araçlarına kadar hemen her servis için provider mevcuttur.

Pulumi ise iki yoldan provider desteği sunar:
1. **Native Pulumi Provider'ları**: Pulumi ekibinin geliştirdiği first-party provider'lar
2. **Terraform Bridge**: Terraform provider'larını Pulumi'de kullanmayı sağlayan köprü

Terraform Bridge sayesinde Pulumi, Terraform ekosisteminin büyük bölümüne erişebilir. Ancak bridge üzerinden kullanılan provider'larda bazen gecikme veya uyumsuzluk sorunları yaşanabilir. Kritik altyapı bileşenleri için native provider olup olmadığını kontrol etmek önemlidir.

## Öğrenme Eğrisi ve Ekip Adaptasyonu

Öğrenme eğrisi, ekibinizin mevcut becerilerine doğrudan bağlıdır.

**Terraform tercih edilebilir:**
- Ekipte programlama deneyimi sınırlıysa
- Ops ağırlıklı bir ekip yapınız varsa
- Sektörde daha fazla kaynak ve eğitim materyali arıyorsanız
- Mevcut Terraform modül kütüphaneniz varsa

**Pulumi tercih edilebilir:**
- Ekip güçlü yazılım geliştirme becerilerine sahipse
- TypeScript, Python veya Go zaten kullanılıyorsa
- Karmaşık altyapı mantığı gerektiren senaryolarınız varsa
- Test-driven infrastructure yaklaşımı benimsemek istiyorsanız

Terraform'un topluluk büyüklüğü hâlâ Pulumi'den fazladır. Stack Overflow soruları, blog yazıları, video eğitimler ve üçüncü parti modüller açısından Terraform daha zengin bir ekosisteme sahiptir. Ancak Pulumi topluluğu hızla büyüyor ve özellikle yazılım geliştirici odaklı DevOps ekiplerinde popülerlik kazanıyor.

## Enterprise Özellikleri

Her iki araç da enterprise müşterilere yönelik gelişmiş özellikler sunar.

**Terraform Cloud/Enterprise:**
- Remote execution ve state management
- Policy as Code (Sentinel veya OPA)
- Private module registry
- SSO, audit logging, cost estimation
- Run triggers ve workspace bağlantıları

**Pulumi Cloud (Enterprise):**
- Deployment automation ve review stacks
- Policy as Code (CrossGuard, OPA)
- SAML/SSO, audit logs
- Secrets management (entegre)
- AI-assisted infrastructure (Pulumi AI)
- Drift detection

Pulumi'nin 2026'daki en dikkat çekici enterprise özelliği, Pulumi AI entegrasyonudur. Doğal dilde altyapı tanımı oluşturma ve mevcut konfigürasyonları analiz etme yetenekleri, özellikle büyük ekiplerde onboarding sürecini hızlandırır.

## Fiyatlandırma Karşılaştırması

**Terraform:**
- CLI tamamen ücretsiz ve açık kaynak (BSL lisansı altında)
- OpenTofu, topluluk tarafından yönetilen açık kaynak fork'udur
- Terraform Cloud: Küçük ekipler için ücretsiz tier mevcut, sonrası kullanıcı başına ücretlendirilir
- Enterprise: Özel fiyatlandırma

**Pulumi:**
- CLI açık kaynak (Apache 2.0)
- Pulumi Cloud: Bireysel kullanıcılar için ücretsiz tier, team ve enterprise planları mevcut
- Self-managed backend kullanıldığında tamamen ücretsiz

2026 itibarıyla OpenTofu'nun varlığı, Terraform'un lisans değişikliğinden endişe duyan ekipler için önemli bir alternatif oluşturuyor. Pulumi ise Apache 2.0 lisansıyla bu konuda daha net bir pozisyon sunuyor.

## Hangi Durumda Hangisi?

### Terraform Seçin Eğer:

- Mevcut bir Terraform codebase'iniz varsa ve geçiş maliyeti yüksekse
- Ekibiniz HCL'e alışkınsa ve karmaşık programlama mantığı gerekmiyorsa
- Geniş provider desteğine ihtiyacınız varsa
- Sektördeki en büyük topluluk ve kaynak havuzundan faydalanmak istiyorsanız
- Multi-cloud ortamında standart bir araç arıyorsanız

### Pulumi Seçin Eğer:

- Sıfırdan başlıyorsanız ve ekibiniz güçlü programlama becerilerine sahipse
- Karmaşık altyapı mantığı (koşullar, döngüler, abstraction) gerektiren projeleriniz varsa
- Infrastructure code'unuz için unit ve integration test yazmak istiyorsanız
- Aynı dilde hem uygulama hem altyapı kodu yazmak istiyorsanız (örneğin her şey TypeScript)
- Modern, developer-first bir deneyim arıyorsanız

## Hibrit Yaklaşım

İlginç bir alternatif olarak, CDKTF (Cloud Development Kit for Terraform) ile Terraform'un state management ve provider ekosistemini kullanırken TypeScript veya Python ile kod yazabilirsiniz. Bu yaklaşım, her iki dünyanın avantajlarını birleştirmeyi amaçlar, ancak ek bir abstraction katmanı getirdiği için karmaşıklık artabilir.

## Sonuç

Terraform ve Pulumi arasındaki seçim, teknik bir karardan çok stratejik bir karardır. Ekibinizin becerileri, mevcut altyapınız, proje karmaşıklığı ve uzun vadeli vizyon bu kararı şekillendirir. Her iki araç da production-ready ve olgun çözümlerdir. Önemli olan, seçtiğiniz aracı doğru pratiklerle kullanmaktır: modüler yapı, code review, otomatik testler ve CI/CD entegrasyonu hangi aracı seçerseniz seçin vazgeçilmezdir.

2026 yılında IaC dünyası her zamankinden daha zengin. Doğru aracı seçmek yerine, doğru pratikleri benimsemek daha büyük fark yaratır.
