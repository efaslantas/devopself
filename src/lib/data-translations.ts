// EN and RU translations for top 20 tools, all categories, and blog posts.
// Turkish is the default in data.ts - these provide EN/RU overrides.

export const toolDescriptions: Record<string, Record<string, string>> = {
  "github-actions": {
    en: "CI/CD platform integrated into GitHub. Automate build, test and deploy processes by defining workflows from within your repository.",
    ru: "Платформа CI/CD, интегрированная в GitHub. Автоматизируйте процессы сборки, тестирования и деплоя, определяя рабочие процессы прямо из репозитория.",
  },
  "gitlab-cicd": {
    en: "GitLab's built-in CI/CD solution. Provides source code management, CI/CD, security scanning and deployment on a single platform.",
    ru: "Встроенное CI/CD решение GitLab. Обеспечивает управление исходным кодом, CI/CD, сканирование безопасности и развертывание на единой платформе.",
  },
  jenkins: {
    en: "The most widely used open-source automation server. Supports every build, test and deploy scenario with thousands of plugins.",
    ru: "Самый распространённый сервер автоматизации с открытым исходным кодом. Поддерживает любые сценарии сборки, тестирования и деплоя с помощью тысяч плагинов.",
  },
  docker: {
    en: "Industry-standard container platform. Packages applications with their dependencies to guarantee consistent operation across any environment.",
    ru: "Контейнерная платформа, ставшая отраслевым стандартом. Упаковывает приложения с зависимостями, гарантируя стабильную работу в любой среде.",
  },
  kubernetes: {
    en: "The container orchestration standard. Provides automatic scaling, self-healing, rolling updates and service discovery.",
    ru: "Стандарт оркестрации контейнеров. Обеспечивает автоматическое масштабирование, самовосстановление, плавные обновления и обнаружение сервисов.",
  },
  terraform: {
    en: "HashiCorp's IaC tool. Define and manage infrastructure across multiple cloud providers using the HCL language.",
    ru: "Инструмент IaC от HashiCorp. Определяйте и управляйте инфраструктурой на нескольких облачных провайдерах с помощью языка HCL.",
  },
  pulumi: {
    en: "Infrastructure definition platform using general-purpose programming languages. Write IaC with TypeScript, Python, Go and more.",
    ru: "Платформа определения инфраструктуры с использованием языков программирования общего назначения. Пишите IaC на TypeScript, Python, Go и других.",
  },
  ansible: {
    en: "Agentless configuration management tool. Perform server configuration and application deployment with YAML-based playbooks.",
    ru: "Безагентный инструмент управления конфигурацией. Настройка серверов и развёртывание приложений с помощью плейбуков на YAML.",
  },
  prometheus: {
    en: "Open-source metric collection and alerting system. Collects time-series data via a pull-based model and analyzes with the PromQL query language.",
    ru: "Система сбора метрик и оповещений с открытым исходным кодом. Собирает временные ряды через pull-модель и анализирует с помощью языка запросов PromQL.",
  },
  grafana: {
    en: "Open-source visualization and dashboard platform. Creates interactive dashboards by pulling data from multiple data sources.",
    ru: "Платформа визуализации и дашбордов с открытым исходным кодом. Создаёт интерактивные панели, подключаясь к множеству источников данных.",
  },
  datadog: {
    en: "Cloud-scale monitoring and analytics platform. Unifies metrics, logs, traces and security data on a single platform.",
    ru: "Платформа мониторинга и аналитики облачного масштаба. Объединяет метрики, логи, трейсы и данные безопасности на единой платформе.",
  },
  trivy: {
    en: "Aqua Security's comprehensive security scanner. Scans container images, file systems, Git repositories and Kubernetes configurations.",
    ru: "Комплексный сканер безопасности от Aqua Security. Сканирует образы контейнеров, файловые системы, репозитории Git и конфигурации Kubernetes.",
  },
  snyk: {
    en: "Developer-focused security platform. Detects vulnerabilities in open-source dependencies, container images and IaC code.",
    ru: "Платформа безопасности для разработчиков. Обнаруживает уязвимости в зависимостях с открытым кодом, образах контейнеров и IaC-коде.",
  },
  "hashicorp-vault": {
    en: "Secret management and data encryption platform. Centrally manages and audits API keys, passwords and certificates.",
    ru: "Платформа управления секретами и шифрования данных. Централизованно управляет и контролирует API-ключи, пароли и сертификаты.",
  },
  "github-copilot": {
    en: "AI-powered code assistant. Boosts developer productivity by providing context-aware suggestions during coding.",
    ru: "Помощник программиста на основе ИИ. Повышает продуктивность разработчиков, предлагая контекстные подсказки при написании кода.",
  },
  cursor: {
    en: "AI-first code editor. Built on VS Code, accelerates writing, editing and understanding code with AI assistance.",
    ru: "Редактор кода с приоритетом ИИ. Построен на VS Code, ускоряет написание, редактирование и понимание кода с помощью ИИ.",
  },
  aws: {
    en: "The world's largest cloud platform. Offers compute, storage, database, AI and IoT solutions with over 200 services.",
    ru: "Крупнейшая облачная платформа в мире. Предлагает вычисления, хранилище, базы данных, ИИ и IoT-решения с более чем 200 сервисами.",
  },
  azure: {
    en: "Microsoft's cloud platform. Provides hybrid cloud, enterprise integration and Active Directory solutions compatible with the Windows ecosystem.",
    ru: "Облачная платформа Microsoft. Обеспечивает гибридное облако, корпоративную интеграцию и решения Active Directory, совместимые с экосистемой Windows.",
  },
  "google-cloud": {
    en: "Google's cloud platform. Delivers powerful solutions in data analytics and AI with services like BigQuery, GKE and Vertex AI.",
    ru: "Облачная платформа Google. Предоставляет мощные решения в области аналитики данных и ИИ с такими сервисами, как BigQuery, GKE и Vertex AI.",
  },
  postgresql: {
    en: "The most powerful open-source relational database. ACID-compliant, extensible, and supports advanced data types like JSON, GIS and arrays.",
    ru: "Самая мощная реляционная база данных с открытым исходным кодом. Полная поддержка ACID, расширяемость и продвинутые типы данных: JSON, GIS, массивы.",
  },
};

export const toolPros: Record<string, Record<string, string[]>> = {
  "github-actions": {
    en: ["Native GitHub integration", "Large marketplace with ready-made actions", "Matrix build support", "Self-hosted runner option"],
    ru: ["Нативная интеграция с GitHub", "Большой маркетплейс готовых действий", "Поддержка матричных сборок", "Возможность self-hosted runner"],
  },
  "gitlab-cicd": {
    en: ["All-in-one DevOps platform", "Auto DevOps feature", "Built-in container registry", "Strong SAST/DAST integration"],
    ru: ["Единая DevOps-платформа", "Функция Auto DevOps", "Встроенный container registry", "Мощная интеграция SAST/DAST"],
  },
  jenkins: {
    en: ["Massive plugin ecosystem", "Full customization capability", "Can run on-premise", "Large and active community"],
    ru: ["Огромная экосистема плагинов", "Полная настраиваемость", "Работа на собственных серверах", "Большое и активное сообщество"],
  },
  docker: {
    en: ["Industry-standard container format", "Massive image ecosystem (Docker Hub)", "Easy learning curve", "Multi-platform support"],
    ru: ["Контейнерный формат — отраслевой стандарт", "Огромная экосистема образов (Docker Hub)", "Лёгкая кривая обучения", "Мультиплатформенная поддержка"],
  },
  kubernetes: {
    en: ["Automatic scaling and self-healing", "Wide ecosystem and community", "Managed options on all cloud providers", "Declarative configuration"],
    ru: ["Автоматическое масштабирование и самовосстановление", "Широкая экосистема и сообщество", "Managed-решения у всех облачных провайдеров", "Декларативная конфигурация"],
  },
  terraform: {
    en: ["Multi-cloud provider support", "Wide provider ecosystem", "Safe changes with Plan/Apply", "State management with drift detection"],
    ru: ["Поддержка нескольких облачных провайдеров", "Широкая экосистема провайдеров", "Безопасные изменения через Plan/Apply", "Управление состоянием с обнаружением дрифта"],
  },
  pulumi: {
    en: ["IaC with familiar programming languages", "Strong type checking and IDE support", "Testable infrastructure code", "Can use Terraform providers"],
    ru: ["IaC на знакомых языках программирования", "Строгая типизация и поддержка IDE", "Тестируемый инфраструктурный код", "Совместимость с провайдерами Terraform"],
  },
  ansible: {
    en: ["Agentless architecture, works over SSH", "Simple YAML syntax", "Large module collection", "Red Hat support and Ansible Galaxy"],
    ru: ["Безагентная архитектура через SSH", "Простой синтаксис YAML", "Большая коллекция модулей", "Поддержка Red Hat и Ansible Galaxy"],
  },
  prometheus: {
    en: ["Powerful PromQL query language", "Excellent Kubernetes integration", "Pull-based architecture", "Wide exporter ecosystem"],
    ru: ["Мощный язык запросов PromQL", "Отличная интеграция с Kubernetes", "Pull-архитектура", "Широкая экосистема экспортёров"],
  },
  grafana: {
    en: ["Multiple data source support", "Rich visualization options", "Active community and dashboard sharing", "Alerting and notification support"],
    ru: ["Поддержка множества источников данных", "Богатые возможности визуализации", "Активное сообщество и обмен дашбордами", "Поддержка оповещений и уведомлений"],
  },
  datadog: {
    en: ["All-in-one observability platform", "700+ integrations", "Powerful APM and distributed tracing", "AI-powered anomaly detection"],
    ru: ["Единая платформа наблюдаемости", "700+ интеграций", "Мощный APM и распределённая трассировка", "Обнаружение аномалий на основе ИИ"],
  },
  trivy: {
    en: ["Fast and comprehensive scanning", "Container, IaC and SBOM support", "Easy CI/CD integration", "Zero-config operation"],
    ru: ["Быстрое и комплексное сканирование", "Поддержка контейнеров, IaC и SBOM", "Простая интеграция с CI/CD", "Работа без конфигурации"],
  },
  snyk: {
    en: ["Developer-friendly interface", "Automatic fix suggestions", "Wide language and framework support", "IDE and CI/CD integration"],
    ru: ["Удобный интерфейс для разработчиков", "Автоматические предложения исправлений", "Широкая поддержка языков и фреймворков", "Интеграция с IDE и CI/CD"],
  },
  "hashicorp-vault": {
    en: ["Comprehensive secret management", "Dynamic secret generation", "Multiple auth backend support", "Audit logging and policy management"],
    ru: ["Комплексное управление секретами", "Генерация динамических секретов", "Множество бэкендов аутентификации", "Журнал аудита и управление политиками"],
  },
  "github-copilot": {
    en: ["Deep IDE integration", "Multi-language and framework support", "Chat mode for code explanation", "Workspace understanding capability"],
    ru: ["Глубокая интеграция с IDE", "Поддержка множества языков и фреймворков", "Чат-режим для объяснения кода", "Понимание контекста рабочего пространства"],
  },
  cursor: {
    en: ["AI-native editor experience", "Codebase understanding and context management", "Multi-model support", "VS Code extension compatibility"],
    ru: ["Нативный ИИ-опыт в редакторе", "Понимание кодовой базы и управление контекстом", "Поддержка нескольких моделей", "Совместимость с расширениями VS Code"],
  },
  aws: {
    en: ["Widest range of services", "Global infrastructure and edge locations", "Mature ecosystem and community", "Comprehensive certification program"],
    ru: ["Самый широкий спектр сервисов", "Глобальная инфраструктура и edge-локации", "Зрелая экосистема и сообщество", "Обширная программа сертификации"],
  },
  azure: {
    en: ["Deep Microsoft ecosystem integration", "Strong hybrid cloud solutions", "Enterprise customer support", "Active Directory and Office 365 integration"],
    ru: ["Глубокая интеграция с экосистемой Microsoft", "Мощные гибридные облачные решения", "Корпоративная поддержка клиентов", "Интеграция с Active Directory и Office 365"],
  },
  "google-cloud": {
    en: ["Superior data analytics and AI services", "GKE is the best managed Kubernetes", "Strong global network infrastructure", "BigQuery's unique analytics power"],
    ru: ["Превосходные сервисы аналитики и ИИ", "GKE — лучший managed Kubernetes", "Мощная глобальная сетевая инфраструктура", "Уникальная аналитическая мощь BigQuery"],
  },
  postgresql: {
    en: ["Full ACID compliance", "Advanced data types (JSONB, GIS, arrays)", "Powerful query optimizer", "Extensible plugin system"],
    ru: ["Полная поддержка ACID", "Продвинутые типы данных (JSONB, GIS, массивы)", "Мощный оптимизатор запросов", "Расширяемая система плагинов"],
  },
};

export const toolCons: Record<string, Record<string, string[]>> = {
  "github-actions": {
    en: ["Limited free minutes", "Debugging complex workflows is difficult", "Not useful outside GitHub projects"],
    ru: ["Ограниченные бесплатные минуты", "Сложная отладка комплексных workflow", "Неудобен для проектов вне GitHub"],
  },
  "gitlab-cicd": {
    en: ["High UI complexity", "Self-managed installation is resource-heavy", "Performance issues on large instances"],
    ru: ["Высокая сложность интерфейса", "Self-managed установка требует много ресурсов", "Проблемы производительности на больших инстансах"],
  },
  jenkins: {
    en: ["Outdated UI and user experience", "High maintenance and update burden", "Complex Groovy pipeline syntax"],
    ru: ["Устаревший интерфейс", "Высокая нагрузка на обслуживание и обновления", "Сложный синтаксис Groovy pipeline"],
  },
  docker: {
    en: ["Docker Desktop license fee (large companies)", "Requires root access for security", "Image sizes can grow large"],
    ru: ["Плата за Docker Desktop (крупные компании)", "Требуется root-доступ для безопасности", "Размеры образов могут быть большими"],
  },
  kubernetes: {
    en: ["Very steep learning curve", "Overly complex for small projects", "High operational overhead"],
    ru: ["Очень крутая кривая обучения", "Избыточная сложность для малых проектов", "Высокие операционные затраты"],
  },
  terraform: {
    en: ["HCL learning curve", "State file management requires attention", "HashiCorp license change controversies"],
    ru: ["Кривая обучения HCL", "Управление state-файлом требует внимания", "Споры вокруг изменения лицензии HashiCorp"],
  },
  pulumi: {
    en: ["Community is not as large as Terraform's", "Requires programming knowledge", "Pulumi Cloud recommended for state management"],
    ru: ["Сообщество меньше, чем у Terraform", "Требуются навыки программирования", "Для управления состоянием рекомендуется Pulumi Cloud"],
  },
  ansible: {
    en: ["Performance issues at large scale", "No complex state management", "Windows support not as strong as Linux"],
    ru: ["Проблемы производительности при большом масштабе", "Нет сложного управления состоянием", "Поддержка Windows слабее, чем Linux"],
  },
  prometheus: {
    en: ["Additional solution needed for long-term storage", "High cardinality issues", "No built-in dashboard"],
    ru: ["Для долгосрочного хранения нужно дополнительное решение", "Проблемы высокой кардинальности", "Нет встроенного дашборда"],
  },
  grafana: {
    en: ["Complex dashboards affect performance", "Limited authorization management", "Some features exclusive to Enterprise edition"],
    ru: ["Сложные дашборды влияют на производительность", "Ограниченное управление авторизацией", "Некоторые функции только в Enterprise-версии"],
  },
  datadog: {
    en: ["Cost can escalate very quickly", "Data egress is expensive", "High vendor lock-in risk"],
    ru: ["Стоимость может быстро расти", "Дорогой вывод данных (egress)", "Высокий риск привязки к поставщику"],
  },
  trivy: {
    en: ["False positive rate can be high", "Custom registry support needs configuration", "Reporting options are limited"],
    ru: ["Высокий процент ложных срабатываний", "Поддержка кастомных реестров требует настройки", "Ограниченные возможности отчётов"],
  },
  snyk: {
    en: ["Limited tests on free plan", "Enterprise pricing is high", "Some languages have excessive false positives"],
    ru: ["Ограниченное количество тестов на бесплатном плане", "Высокие корпоративные цены", "Избыточные ложные срабатывания для некоторых языков"],
  },
  "hashicorp-vault": {
    en: ["Setup and operational complexity", "High availability configuration is difficult", "License change (BSL) concerns"],
    ru: ["Сложность настройки и эксплуатации", "Трудная конфигурация высокой доступности", "Опасения из-за смены лицензии (BSL)"],
  },
  "github-copilot": {
    en: ["Monthly subscription fee", "Sometimes suggests incorrect or insecure code", "Requires internet connection", "License concerns (open-source code)"],
    ru: ["Ежемесячная подписка", "Иногда предлагает неправильный или небезопасный код", "Требуется интернет", "Лицензионные вопросы (открытый код)"],
  },
  cursor: {
    en: ["Monthly subscription cost", "Indexing is slow on large projects", "Dependency on VS Code"],
    ru: ["Стоимость ежемесячной подписки", "Медленная индексация больших проектов", "Зависимость от VS Code"],
  },
  aws: {
    en: ["Complex pricing", "Cost control is difficult", "High vendor lock-in risk"],
    ru: ["Сложное ценообразование", "Трудный контроль затрат", "Высокий риск привязки к поставщику"],
  },
  azure: {
    en: ["Portal UI is slow and complex", "Confusing service naming", "Stability issues with some services"],
    ru: ["Медленный и сложный интерфейс портала", "Запутанные названия сервисов", "Проблемы стабильности некоторых сервисов"],
  },
  "google-cloud": {
    en: ["Fewer services compared to AWS", "Weak enterprise support perception", "Inconsistent console user experience"],
    ru: ["Меньше сервисов по сравнению с AWS", "Слабое восприятие корпоративной поддержки", "Непоследовательный UX консоли"],
  },
  postgresql: {
    en: ["Horizontal scaling is complex", "Default configuration not optimized for performance", "Replication setup requires detailed knowledge"],
    ru: ["Сложное горизонтальное масштабирование", "Настройки по умолчанию не оптимизированы для производительности", "Настройка репликации требует глубоких знаний"],
  },
};

export const categoryDescriptions: Record<string, Record<string, string>> = {
  cicd: {
    en: "Continuous integration and delivery pipelines, build automation and release management.",
    ru: "Конвейеры непрерывной интеграции и доставки, автоматизация сборки и управление релизами.",
  },
  container: {
    en: "Container runtimes, orchestration platforms and service mesh solutions.",
    ru: "Контейнерные среды выполнения, платформы оркестрации и решения service mesh.",
  },
  iac: {
    en: "Infrastructure definition, configuration management and automated provisioning tools.",
    ru: "Определение инфраструктуры, управление конфигурацией и инструменты автоматического провижининга.",
  },
  monitoring: {
    en: "Metric collection, log management, distributed tracing and alerting systems.",
    ru: "Сбор метрик, управление логами, распределённая трассировка и системы оповещений.",
  },
  security: {
    en: "Security scanning, vulnerability detection, secret management and compliance controls.",
    ru: "Сканирование безопасности, обнаружение уязвимостей, управление секретами и контроль соответствия.",
  },
  "ai-ml": {
    en: "AI APIs, code assistants, ML pipeline management and model serving.",
    ru: "API искусственного интеллекта, помощники кода, управление ML-конвейерами и обслуживание моделей.",
  },
  cloud: {
    en: "Large-scale cloud infrastructures, compute, storage and managed services.",
    ru: "Крупномасштабные облачные инфраструктуры, вычисления, хранилища и управляемые сервисы.",
  },
  "dev-tools": {
    en: "Code editors, IDEs, API testing tools and developer productivity solutions.",
    ru: "Редакторы кода, IDE, инструменты тестирования API и решения для продуктивности разработчиков.",
  },
  database: {
    en: "Relational and NoSQL databases, message queues and search engines.",
    ru: "Реляционные и NoSQL базы данных, очереди сообщений и поисковые системы.",
  },
  collaboration: {
    en: "Project management, team communication, issue tracking and documentation platforms.",
    ru: "Управление проектами, командное общение, отслеживание задач и платформы документации.",
  },
};

export const blogTranslations: Record<string, Record<string, { title: string; excerpt: string }>> = {
  "yapay-zeka-ile-devops-otomasyonu": {
    en: {
      title: "AI-Powered DevOps Automation: What's Changing in 2026?",
      excerpt: "AI-powered CI/CD pipelines, automated code reviews and anomaly detection are fundamentally transforming DevOps processes. We explore the AI-driven DevOps approach with practical examples.",
    },
    ru: {
      title: "Автоматизация DevOps с помощью ИИ: что меняется в 2026?",
      excerpt: "CI/CD-конвейеры на основе ИИ, автоматические ревью кода и обнаружение аномалий фундаментально трансформируют DevOps-процессы. Рассмотрим AI-driven подход с практическими примерами.",
    },
  },
  "platform-engineering-nedir": {
    en: {
      title: "What is Platform Engineering? Understanding the Evolution of DevOps",
      excerpt: "Discover how the Internal Developer Platform concept and self-service infrastructure approach can improve developer experience.",
    },
    ru: {
      title: "Что такое Platform Engineering? Понимание эволюции DevOps",
      excerpt: "Узнайте, как концепция Internal Developer Platform и подход самообслуживания инфраструктуры могут улучшить опыт разработчиков.",
    },
  },
  "devsecops-pipeline-tasarimi": {
    en: {
      title: "DevSecOps Pipeline Design: Shifting Security Left",
      excerpt: "Step-by-step guide on integrating SAST, DAST, SCA and secret scanning into your CI/CD pipeline with a shift-left security approach.",
    },
    ru: {
      title: "Проектирование DevSecOps Pipeline: сдвиг безопасности влево",
      excerpt: "Пошаговое руководство по интеграции SAST, DAST, SCA и сканирования секретов в CI/CD-конвейер с подходом shift-left security.",
    },
  },
  "kubernetes-production-checklist": {
    en: {
      title: "Kubernetes Production Checklist: 25 Checks Before Going Live",
      excerpt: "Comprehensive checklist for your production Kubernetes cluster including resource limits, network policies, RBAC, monitoring and disaster recovery.",
    },
    ru: {
      title: "Kubernetes Production Checklist: 25 проверок перед запуском",
      excerpt: "Полный чек-лист для production-кластера Kubernetes: лимиты ресурсов, сетевые политики, RBAC, мониторинг и аварийное восстановление.",
    },
  },
  "gitops-vs-geleneksel-cicd": {
    en: {
      title: "GitOps vs Traditional CI/CD: Which is Right for You?",
      excerpt: "Comparing GitOps tools like ArgoCD and Flux with traditional CI/CD approaches, explaining which scenario suits which approach.",
    },
    ru: {
      title: "GitOps vs Традиционный CI/CD: что подходит вам?",
      excerpt: "Сравнение инструментов GitOps (ArgoCD, Flux) с традиционными подходами CI/CD — в каком сценарии какой подход выбрать.",
    },
  },
  "observability-driven-development": {
    en: {
      title: "Observability-Driven Development: Write Observable Code",
      excerpt: "Discover ways to design observable systems from the start with structured logging, distributed tracing and metric instrumentation.",
    },
    ru: {
      title: "Observability-Driven Development: пишите наблюдаемый код",
      excerpt: "Узнайте, как проектировать наблюдаемые системы с самого начала: структурированное логирование, распределённая трассировка и инструментирование метрик.",
    },
  },
  "terraform-vs-pulumi-karsilastirmasi": {
    en: {
      title: "Terraform vs Pulumi: Which Should You Choose?",
      excerpt: "A detailed comparison of HCL vs general-purpose programming languages for IaC, covering ecosystem maturity and team fit.",
    },
    ru: {
      title: "Terraform vs Pulumi: что выбрать?",
      excerpt: "Детальное сравнение подходов IaC через HCL и языки программирования общего назначения: зрелость экосистемы и соответствие команде.",
    },
  },
  "container-guvenligi-best-practices": {
    en: {
      title: "Container Security: Best Practices from Image to Runtime",
      excerpt: "Harden container security with minimal base images, multi-stage builds, rootless containers and runtime security policies.",
    },
    ru: {
      title: "Безопасность контейнеров: лучшие практики от образа до runtime",
      excerpt: "Укрепите безопасность контейнеров: минимальные базовые образы, multi-stage сборки, rootless-контейнеры и политики безопасности runtime.",
    },
  },
  "sre-kulturu-ve-devops-farklari": {
    en: {
      title: "SRE Culture and DevOps: Differences, Similarities and Alignment",
      excerpt: "Explaining the differences between SRE and DevOps, SLI/SLO/SLA concepts and the error budget approach with practical examples.",
    },
    ru: {
      title: "Культура SRE и DevOps: различия, сходства и совместимость",
      excerpt: "Разбираем различия между SRE и DevOps, концепции SLI/SLO/SLA и подход error budget на практических примерах.",
    },
  },
  "cicd-pipeline-optimizasyonu": {
    en: {
      title: "CI/CD Pipeline Optimization: Cut Your Build Times in Half",
      excerpt: "Dramatically reduce pipeline times with caching strategies, parallel jobs, incremental builds and test splitting.",
    },
    ru: {
      title: "Оптимизация CI/CD Pipeline: сократите время сборки вдвое",
      excerpt: "Значительно сократите время конвейера с помощью стратегий кэширования, параллельных задач, инкрементальных сборок и разделения тестов.",
    },
  },
  "cloud-maliyet-optimizasyonu": {
    en: {
      title: "Cloud Cost Optimization: Saving with FinOps Practices",
      excerpt: "Learn to control cloud spending with reserved instances, spot instances, rightsizing and tag-based cost tracking.",
    },
    ru: {
      title: "Оптимизация облачных затрат: экономия с практиками FinOps",
      excerpt: "Научитесь контролировать облачные расходы: зарезервированные инстансы, spot-инстансы, правильный размер и отслеживание затрат по тегам.",
    },
  },
  "microservices-vs-monolith": {
    en: {
      title: "Microservices vs Monolith: Making the Right Architecture Decision",
      excerpt: "Evaluating the monolith-first approach, domain-driven decomposition and microservices migration strategies with real-world experiences.",
    },
    ru: {
      title: "Микросервисы vs Монолит: принятие правильного архитектурного решения",
      excerpt: "Оцениваем подход monolith-first, декомпозицию на основе доменов и стратегии миграции на микросервисы на реальных примерах.",
    },
  },
  "api-guvenligi-best-practices": {
    en: {
      title: "API Security: OAuth, Rate Limiting and Best Practices",
      excerpt: "Secure your APIs with JWT management, API gateway security, rate limiting strategies and OWASP API Top 10.",
    },
    ru: {
      title: "Безопасность API: OAuth, Rate Limiting и лучшие практики",
      excerpt: "Защитите API: управление JWT, безопасность API gateway, стратегии rate limiting и OWASP API Top 10.",
    },
  },
  "devops-metrikleri-dora-metrics": {
    en: {
      title: "DevOps Metrics: Measure Your Performance with DORA Metrics",
      excerpt: "How to collect and improve deployment frequency, lead time, change failure rate and MTTR metrics.",
    },
    ru: {
      title: "Метрики DevOps: измеряйте производительность с помощью DORA Metrics",
      excerpt: "Как собирать и улучшать метрики: частота деплоев, время выполнения, процент неудачных изменений и MTTR.",
    },
  },
  "2026-devops-trend-tahminleri": {
    en: {
      title: "2026 DevOps Trend Predictions: From Platform Engineering to AI-Ops",
      excerpt: "Examining the key DevOps trends of 2026: platform engineering, AI-driven operations, eBPF security, WebAssembly and green computing.",
    },
    ru: {
      title: "Прогнозы трендов DevOps на 2026: от Platform Engineering до AI-Ops",
      excerpt: "Рассматриваем ключевые тренды DevOps 2026: platform engineering, AI-driven operations, безопасность eBPF, WebAssembly и зелёные вычисления.",
    },
  },
};
