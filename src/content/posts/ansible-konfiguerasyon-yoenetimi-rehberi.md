---
title: "Ansible ile Konfigürasyon Yönetimi: Sıfırdan Production'a"
excerpt: "Sunucu konfigürasyonlarını kod olarak yönetin. Ansible inventory, playbook, role yapısı ve production best practice'leri ile altyapınızı otomatize edin."
category: "Infrastructure as Code"
date: "2026-04-12"
readTime: "12 dk"
featured: false
tags: ["ansible", "konfiguerasyon-yoenetimi", "iac", "otomasyon"]
---

# Ansible ile Konfigürasyon Yönetimi: Sıfırdan Production'a

Sunucu sayınız arttıkça manuel konfigürasyon sürdürülemez hale gelir. "Bu sunucuya hangi paketler kuruluydu?", "Nginx config'i hangi sunucuda farklıydı?" gibi sorular operasyonel kabus yaratır. Ansible, **agentless** mimarisi ve **idempotent** yapısıyla bu sorunu kökünden çözer.

## Neden Ansible?

Terraform ve Pulumi **altyapıyı** oluşturur (VM, network, storage), Ansible ise oluşan altyapıyı **konfigüre** eder. İkisi rakip değil, tamamlayıcıdır:

| Özellik | Ansible | Chef/Puppet |
|---------|---------|-------------|
| Mimari | Agentless (SSH) | Agent gerektirir |
| Dil | YAML (deklaratif) | Ruby DSL |
| Öğrenme eğrisi | Düşük | Yüksek |
| Push/Pull | Push-based | Pull-based |
| İlk kurulum | Sadece control node | Server + agent kurulumu |

Ansible'ın en büyük avantajı: hedef sunuculara **hiçbir şey kurmanız gerekmez**. SSH erişimi ve Python yeterlidir.

## Kurulum

```bash
# macOS
brew install ansible

# Ubuntu/Debian
sudo apt update && sudo apt install -y ansible

# pip ile (tüm platformlar)
pip install ansible

# Versiyon kontrolü
ansible --version
```

## Inventory: Sunucularınızı Tanımlayın

Inventory dosyası Ansible'a hangi sunuculara bağlanacağını söyler. INI veya YAML formatında yazılabilir:

```ini
# inventory/hosts.ini

[webservers]
web1.example.com ansible_host=192.168.1.10
web2.example.com ansible_host=192.168.1.11

[dbservers]
db1.example.com ansible_host=192.168.1.20

[monitoring]
monitor.example.com ansible_host=192.168.1.30

[production:children]
webservers
dbservers
monitoring

[production:vars]
ansible_user=deploy
ansible_ssh_private_key_file=~/.ssh/deploy_key
ansible_python_interpreter=/usr/bin/python3
```

Daha karmaşık ortamlar için **dynamic inventory** kullanılır. AWS, GCP, Azure gibi cloud provider'lar için hazır inventory plugin'leri mevcuttur:

```yaml
# inventory/aws_ec2.yml
plugin: amazon.aws.aws_ec2
regions:
  - eu-west-1
keyed_groups:
  - key: tags.Environment
    prefix: env
  - key: tags.Role
    prefix: role
filters:
  tag:ManagedBy: ansible
```

## İlk Playbook: Ad-Hoc Komutlardan Playbook'a

Önce ad-hoc komutlarla başlayalım:

```bash
# Tüm sunuculara ping at
ansible all -i inventory/hosts.ini -m ping

# Web sunucularının uptime bilgisini al
ansible webservers -i inventory/hosts.ini -m command -a "uptime"

# Bir paket kur
ansible webservers -i inventory/hosts.ini -m apt -a "name=nginx state=present" --become
```

Ancak gerçek dünyada **playbook** kullanırsınız. İşte bir web sunucu kurulum playbook'u:

```yaml
# playbooks/setup-webserver.yml
---
- name: Web sunucu konfigürasyonu
  hosts: webservers
  become: true
  vars:
    nginx_worker_processes: auto
    nginx_worker_connections: 1024
    app_port: 3000

  tasks:
    - name: Sistem paketlerini güncelle
      apt:
        update_cache: true
        cache_valid_time: 3600

    - name: Gerekli paketleri kur
      apt:
        name:
          - nginx
          - certbot
          - python3-certbot-nginx
          - ufw
        state: present

    - name: Nginx konfigürasyon dosyasını deploy et
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/app
        owner: root
        group: root
        mode: "0644"
      notify: Nginx'i yeniden yükle

    - name: Site'ı aktif et
      file:
        src: /etc/nginx/sites-available/app
        dest: /etc/nginx/sites-enabled/app
        state: link

    - name: Default site'ı kaldır
      file:
        path: /etc/nginx/sites-enabled/default
        state: absent
      notify: Nginx'i yeniden yükle

    - name: UFW ile HTTP/HTTPS portlarını aç
      ufw:
        rule: allow
        port: "{{ item }}"
        proto: tcp
      loop:
        - "80"
        - "443"
        - "22"

    - name: UFW'yi aktif et
      ufw:
        state: enabled
        default: deny

    - name: Nginx servisinin çalıştığından emin ol
      service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: Nginx'i yeniden yükle
      service:
        name: nginx
        state: reloaded
```

İlgili Jinja2 template:

```jinja2
{# templates/nginx.conf.j2 #}
upstream app_backend {
    server 127.0.0.1:{{ app_port }};
}

server {
    listen 80;
    server_name {{ inventory_hostname }};

    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        access_log off;
        return 200 "OK";
    }
}
```

Playbook'u çalıştırın:

```bash
# Dry-run (değişiklikleri göster ama uygulama)
ansible-playbook -i inventory/hosts.ini playbooks/setup-webserver.yml --check --diff

# Gerçek çalıştırma
ansible-playbook -i inventory/hosts.ini playbooks/setup-webserver.yml

# Belirli bir tag ile sadece ilgili task'ları çalıştır
ansible-playbook -i inventory/hosts.ini playbooks/setup-webserver.yml --tags "nginx"
```

## Role Yapısı: Playbook'ları Modüler Hale Getirin

Playbook'lar büyüdükçe yönetilemez hale gelir. **Ansible Role** yapısı kodunuzu yeniden kullanılabilir modüllere böler:

```bash
# Role iskeletini oluştur
ansible-galaxy init roles/nginx

# Ortaya çıkan yapı:
roles/nginx/
├── defaults/
│   └── main.yml      # Varsayılan değişkenler (override edilebilir)
├── handlers/
│   └── main.yml      # Handler tanımları
├── tasks/
│   └── main.yml      # Ana task listesi
├── templates/
│   └── nginx.conf.j2 # Jinja2 template'leri
├── files/             # Statik dosyalar
├── vars/
│   └── main.yml      # Role-specific değişkenler
└── meta/
    └── main.yml       # Bağımlılıklar ve metadata
```

Role'ün task dosyası:

```yaml
# roles/nginx/tasks/main.yml
---
- name: Nginx'i kur
  apt:
    name: nginx
    state: present
  tags: [nginx, install]

- name: Nginx konfigürasyonunu deploy et
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/sites-available/{{ nginx_site_name }}
    mode: "0644"
    validate: nginx -t -c %s
  notify: reload nginx
  tags: [nginx, config]

- name: Site'ı aktif et
  file:
    src: /etc/nginx/sites-available/{{ nginx_site_name }}
    dest: /etc/nginx/sites-enabled/{{ nginx_site_name }}
    state: link
  notify: reload nginx
  tags: [nginx, config]
```

Varsayılan değişkenler:

```yaml
# roles/nginx/defaults/main.yml
---
nginx_site_name: default
nginx_worker_processes: auto
nginx_worker_connections: 1024
nginx_client_max_body_size: 10m
nginx_proxy_read_timeout: 60
```

Ana playbook artık çok daha temiz:

```yaml
# playbooks/site.yml
---
- name: Web sunucularını konfigüre et
  hosts: webservers
  become: true
  roles:
    - role: common
    - role: nginx
      vars:
        nginx_site_name: myapp
        nginx_client_max_body_size: 50m
    - role: certbot
    - role: node_exporter
```

## Ansible Vault: Secret Yönetimi

Şifreleri, API anahtarlarını ve sertifikaları Vault ile şifreleyin:

```bash
# Yeni bir vault dosyası oluştur
ansible-vault create group_vars/production/vault.yml

# Mevcut dosyayı şifrele
ansible-vault encrypt group_vars/production/secrets.yml

# Dosyayı düzenle
ansible-vault edit group_vars/production/vault.yml

# Playbook'u vault password ile çalıştır
ansible-playbook site.yml --ask-vault-pass

# Veya password dosyasından oku
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

Best practice olarak vault değişkenlerini prefix ile kullanın:

```yaml
# group_vars/production/vault.yml (şifreli)
vault_db_password: "gizli-sifre-123"
vault_api_key: "sk-abc..."

# group_vars/production/vars.yml (açık)
db_password: "{{ vault_db_password }}"
api_key: "{{ vault_api_key }}"
```

## Production Best Practice'leri

### 1. ansible.cfg ile Merkezi Konfigürasyon

```ini
# ansible.cfg
[defaults]
inventory = inventory/
roles_path = roles/
retry_files_enabled = false
host_key_checking = false
forks = 20
timeout = 30
stdout_callback = yaml

[privilege_escalation]
become = true
become_method = sudo

[ssh_connection]
pipelining = true
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
```

`pipelining = true` ayarı SSH bağlantı sayısını azaltarak performansı önemli ölçüde artırır.

### 2. Idempotency Kuralına Uy

Her task **idempotent** olmalı — kaç kez çalıştırırsanız çalıştırın aynı sonucu vermeli:

```yaml
# KÖTÜ: Her çalıştırmada tekrar eklenir
- name: Satır ekle
  shell: echo "export APP_ENV=production" >> /etc/environment

# İYİ: Sadece yoksa ekler
- name: Environment değişkenini ayarla
  lineinfile:
    path: /etc/environment
    line: "export APP_ENV=production"
    state: present
```

### 3. Test ve CI Entegrasyonu

Ansible playbook'larınızı CI pipeline'ında test edin:

```yaml
# .github/workflows/ansible-lint.yml
name: Ansible Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Ansible Lint
        uses: ansible/ansible-lint@v24
        with:
          targets: playbooks/
```

Molecule ile role testleri yazın:

```bash
# Molecule test ortamını başlat
pip install molecule molecule-docker
cd roles/nginx
molecule init scenario --driver-name docker
molecule test
```

### 4. Proje Dizin Yapısı

Production-ready bir Ansible projesi şöyle organize edilir:

```
ansible-project/
├── ansible.cfg
├── inventory/
│   ├── production/
│   │   ├── hosts.yml
│   │   └── group_vars/
│   │       ├── all.yml
│   │       └── webservers.yml
│   └── staging/
│       ├── hosts.yml
│       └── group_vars/
├── playbooks/
│   ├── site.yml
│   ├── deploy.yml
│   └── rollback.yml
├── roles/
│   ├── common/
│   ├── nginx/
│   └── app/
└── requirements.yml
```

## Sonraki Adımlar

Ansible temellerini öğrendikten sonra şu konulara bakmanızı öneriyorum:

- **Ansible AWX/Tower**: Web arayüzü, RBAC ve scheduled job'lar
- **Ansible Collections**: Galaxy'den hazır collection'ları kullanma
- **Terraform + Ansible**: Terraform ile altyapıyı oluştur, Ansible ile konfigüre et
- **Molecule**: Role'leriniz için otomatik test yazma

Ansible, Infrastructure as Code yolculuğunuzda Terraform'un doğal tamamlayıcısıdır. Terraform altyapıyı provision eder, Ansible onu konfigüre eder. Bu ikiliyi birlikte kullanarak sunucu konfigürasyonlarınızı tamamen kod olarak yönetebilir, tekrarlanabilir ve denetlenebilir hale getirebilirsiniz.
