export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  pricing: "free" | "freemium" | "paid" | "open-source";
  score: number;
  pros: string[];
  cons: string[];
  url: string;
  tags: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  color: string;
}

export const categories: Category[] = [
  { slug: "ai-devops", name: "AI in DevOps", description: "Yapay zeka ile DevOps workflow otomasyonu, AIOps ve intelligent monitoring.", icon: "brain", count: 12, color: "purple" },
  { slug: "devsecops", name: "DevSecOps", description: "Security-first pipeline tasarımı, vulnerability scanning ve compliance.", icon: "shield", count: 10, color: "red" },
  { slug: "platform-engineering", name: "Platform Engineering", description: "Internal developer platform, self-service altyapı ve golden path.", icon: "layers", count: 8, color: "blue" },
  { slug: "culture-career", name: "Culture & Career", description: "DevOps kültür dönüşümü, kariyer yolları ve takım dinamikleri.", icon: "users", count: 6, color: "green" },
  { slug: "cicd", name: "CI/CD", description: "Continuous integration ve delivery pipeline tasarımı ve optimizasyonu.", icon: "git-branch", count: 15, color: "indigo" },
  { slug: "observability", name: "Observability", description: "Monitoring, logging, tracing ve full-stack observability.", icon: "activity", count: 11, color: "cyan" },
];

export const tools: Tool[] = [
  {
    slug: "github-actions-vs-gitlab-ci",
    name: "GitHub Actions vs GitLab CI",
    category: "CI/CD",
    description: "İki büyük CI/CD platformunun detaylı karşılaştırması. Fiyatlandırma, özellikler, ekosistem ve performans.",
    pricing: "freemium",
    score: 9.2,
    pros: ["GitHub entegrasyonu", "Büyük marketplace", "YAML tabanlı", "Matrix builds"],
    cons: ["Self-hosted runner maliyeti", "Karmaşık workflow debug"],
    url: "#",
    tags: ["CI/CD", "Pipeline", "Automation"],
  },
  {
    slug: "terraform-vs-pulumi",
    name: "Terraform vs Pulumi",
    category: "IaC",
    description: "Infrastructure as Code dünyasının iki devi. HCL vs gerçek programlama dilleri karşılaştırması.",
    pricing: "open-source",
    score: 8.8,
    pros: ["Multi-cloud destek", "Büyük topluluk", "State management"],
    cons: ["HCL öğrenme eğrisi", "State dosya yönetimi"],
    url: "#",
    tags: ["IaC", "Cloud", "Infrastructure"],
  },
  {
    slug: "datadog-vs-grafana",
    name: "Datadog vs Grafana Stack",
    category: "Monitoring",
    description: "Enterprise monitoring vs open-source stack. Maliyet, özellik ve ölçeklenebilirlik analizi.",
    pricing: "freemium",
    score: 8.5,
    pros: ["All-in-one platform", "Kolay kurulum", "AI destekli alerting"],
    cons: ["Yüksek maliyet", "Vendor lock-in"],
    url: "#",
    tags: ["Monitoring", "Observability", "APM"],
  },
  {
    slug: "kubernetes-vs-docker-swarm",
    name: "Kubernetes vs Docker Swarm",
    category: "Container",
    description: "Container orchestration seçimi. Karmaşıklık vs basitlik, ölçek vs hız.",
    pricing: "open-source",
    score: 9.0,
    pros: ["Auto-scaling", "Self-healing", "Büyük ekosistem"],
    cons: ["Karmaşık kurulum", "Kaynak tüketimi"],
    url: "#",
    tags: ["Container", "Orchestration", "Cloud Native"],
  },
  {
    slug: "argocd-vs-flux",
    name: "ArgoCD vs Flux",
    category: "GitOps",
    description: "GitOps araçlarının karşılaştırması. UI vs CLI-first yaklaşım, CNCF projelerinin analizi.",
    pricing: "open-source",
    score: 8.7,
    pros: ["Declarative deployment", "Git-native", "K8s entegrasyonu"],
    cons: ["Öğrenme eğrisi", "Multi-cluster karmaşıklığı"],
    url: "#",
    tags: ["GitOps", "Kubernetes", "CD"],
  },
  {
    slug: "snyk-vs-trivy",
    name: "Snyk vs Trivy",
    category: "Security",
    description: "Developer-first security vs open-source vulnerability scanner. CI/CD entegrasyonu karşılaştırması.",
    pricing: "freemium",
    score: 8.6,
    pros: ["Hızlı tarama", "CI/CD entegrasyonu", "Container scanning"],
    cons: ["False positive'ler", "Enterprise fiyatlandırma"],
    url: "#",
    tags: ["Security", "DevSecOps", "Scanning"],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-devops-2025-rehberi",
    title: "AI ile DevOps: 2025 Pratik Rehberi",
    excerpt: "AIOps, AI-powered monitoring ve intelligent automation. DevOps workflow'larında AI nasıl kullanılır?",
    category: "AI in DevOps",
    date: "2026-04-01",
    readTime: "8 dk",
    featured: true,
  },
  {
    slug: "platform-engineering-baslangic",
    title: "Platform Engineering'e Başlarken",
    excerpt: "Internal Developer Platform nedir? Neden her büyüyen organizasyon buna ihtiyaç duyuyor?",
    category: "Platform Engineering",
    date: "2026-03-28",
    readTime: "6 dk",
    featured: true,
  },
  {
    slug: "devsecops-pipeline-tasarimi",
    title: "DevSecOps Pipeline Tasarımı",
    excerpt: "Shift-left security yaklaşımı ile güvenli CI/CD pipeline nasıl tasarlanır?",
    category: "DevSecOps",
    date: "2026-03-25",
    readTime: "10 dk",
  },
  {
    slug: "kubernetes-production-checklist",
    title: "Kubernetes Production Checklist",
    excerpt: "Production'a çıkma öncesi kontrol edilmesi gereken 25 kritik madde.",
    category: "Platform Engineering",
    date: "2026-03-20",
    readTime: "12 dk",
  },
  {
    slug: "gitops-vs-traditional-cicd",
    title: "GitOps vs Traditional CI/CD",
    excerpt: "GitOps yaklaşımının avantajları ve geleneksel CI/CD ile farkları.",
    category: "CI/CD",
    date: "2026-03-15",
    readTime: "7 dk",
  },
  {
    slug: "observability-driven-development",
    title: "Observability-Driven Development",
    excerpt: "Monitoring, logging ve tracing'i development sürecine entegre etme stratejileri.",
    category: "Observability",
    date: "2026-03-10",
    readTime: "9 dk",
  },
];
