---
title: "PostgreSQL vs MongoDB: Hangi Veritabanını Seçmeli?"
excerpt: "Relational vs document database karşılaştırması. Performans, ölçeklenebilirlik, kullanım senaryoları ve migration stratejileri."
category: "Database & Data"
date: "2026-03-20"
readTime: "12 dk"
featured: true
tags: ["postgresql", "mongodb", "veritabani", "karsilastirma"]
author: "Emre Ferit Aslantaş"
authorRole: "DevOps & Platform Engineer"
updated: "2026-04-22"
---

Veritabanı seçimi, bir projenin mimarisini ve uzun vadeli bakım maliyetini doğrudan etkileyen kritik bir karardır. PostgreSQL ve MongoDB, kendi kategorilerinin en popüler temsilcileridir ve birçok proje için karşılaştırılan iki temel alternatiftir. Bu rehberde, her iki veritabanını teknik derinlikte karşılaştırarak doğru seçimi yapmanıza yardımcı olacağız.

## Veri Modeli Karşılaştırması

### PostgreSQL: Relational Model

PostgreSQL, tablo bazlı ilişkisel veri modeli kullanır. Veriler satır ve sütunlardan oluşan tablolarda saklanır, tablolar arasındaki ilişkiler foreign key'ler ile tanımlanır.

```sql
-- PostgreSQL: E-ticaret şeması
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_name VARCHAR(200),
    quantity INTEGER,
    unit_price DECIMAL(10,2)
);
```

PostgreSQL'in güçlü yanı, JSONB desteği ile document-like veri saklama yeteneğine de sahip olmasıdır:

```sql
-- PostgreSQL JSONB: Semi-structured veri
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),
    attributes JSONB  -- Esnek alan: renk, beden, malzeme vb.
);

INSERT INTO products (name, category, attributes) VALUES
('T-Shirt', 'giyim', '{"renk": "mavi", "beden": ["S","M","L"], "malzeme": "pamuk"}');

-- JSONB sorguları
SELECT name FROM products
WHERE attributes->>'renk' = 'mavi'
AND attributes->'beden' ? 'M';

-- JSONB index desteği
CREATE INDEX idx_products_attrs ON products USING GIN (attributes);
```

### MongoDB: Document Model

MongoDB, JSON benzeri BSON document'larını collection'larda saklar. Şema esnektir; aynı collection içindeki document'lar farklı field'lara sahip olabilir.

```javascript
// MongoDB: Aynı e-ticaret yapısı
db.orders.insertOne({
  customer: {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com"
  },
  status: "pending",
  items: [
    { product: "T-Shirt", quantity: 2, unitPrice: 149.90 },
    { product: "Şapka", quantity: 1, unitPrice: 79.90 }
  ],
  totalAmount: 379.70,
  createdAt: new Date()
});

// Embedded document sorgusu
db.orders.find({
  "customer.email": "ahmet@example.com",
  "items.product": "T-Shirt"
});
```

MongoDB'de ilişkili veriler genellikle embed edilir. Bu yaklaşım, okuma performansını artırır çünkü tek bir sorgu ile tüm ilişkili veri getirilir. Ancak veri tekrarına yol açabilir.

## Sorgu Dili

PostgreSQL'in SQL'i, onlarca yılda olgunlaşmış, standartlaşmış ve güçlü bir dildir. Window function'lar, CTE'ler, recursive query'ler ve lateral join'ler gibi gelişmiş özellikler sunar.

```sql
-- PostgreSQL: Müşteri bazında aylık sipariş analizi
WITH monthly_orders AS (
    SELECT
        c.name,
        DATE_TRUNC('month', o.created_at) AS month,
        SUM(o.total_amount) AS monthly_total,
        COUNT(*) AS order_count
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE o.created_at >= NOW() - INTERVAL '12 months'
    GROUP BY c.name, DATE_TRUNC('month', o.created_at)
)
SELECT
    name,
    month,
    monthly_total,
    LAG(monthly_total) OVER (PARTITION BY name ORDER BY month) AS prev_month,
    ROUND(
        (monthly_total - LAG(monthly_total) OVER (PARTITION BY name ORDER BY month))
        / NULLIF(LAG(monthly_total) OVER (PARTITION BY name ORDER BY month), 0) * 100,
    1) AS growth_pct
FROM monthly_orders
ORDER BY name, month;
```

MongoDB'nin aggregation pipeline'ı güçlü olmakla birlikte, karmaşık analitik sorgularda SQL kadar okunabilir ve özlü değildir:

```javascript
// MongoDB: Aynı analiz
db.orders.aggregate([
  { $match: { createdAt: { $gte: new Date("2025-04-01") } } },
  { $group: {
      _id: {
        customer: "$customer.name",
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      },
      monthlyTotal: { $sum: "$totalAmount" },
      orderCount: { $sum: 1 }
  }},
  { $sort: { "_id.customer": 1, "_id.month": 1 } },
  { $group: {
      _id: "$_id.customer",
      months: { $push: {
        month: "$_id.month",
        total: "$monthlyTotal",
        count: "$orderCount"
      }}
  }}
]);
```

## Indexing

Her iki veritabanı da gelişmiş indexing desteği sunar:

**PostgreSQL index tipleri:**
- B-tree (varsayılan, genel amaçlı)
- GIN (full-text search, JSONB, array)
- GiST (geometrik veriler, range types)
- BRIN (büyük, doğal sıralı tablolar)
- Partial index (koşullu index)

```sql
-- Partial index: Sadece aktif siparişleri indexle
CREATE INDEX idx_active_orders ON orders (created_at)
WHERE status IN ('pending', 'processing');

-- Expression index
CREATE INDEX idx_lower_email ON customers (LOWER(email));
```

**MongoDB index tipleri:**
- Single field, compound, multikey (array)
- Text index (full-text search)
- Geospatial (2d, 2dsphere)
- Wildcard index

```javascript
// Compound index
db.orders.createIndex({ "customer.email": 1, createdAt: -1 });

// TTL index: 90 gün sonra otomatik sil
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
```

## Ölçeklenebilirlik

### PostgreSQL: Vertical Scaling + Read Replicas

PostgreSQL geleneksel olarak vertical scaling'e dayanır. Read replica'lar ile okuma trafiğini dağıtabilirsiniz. Horizontal write scaling için native sharding desteği sınırlıdır, ancak Citus uzantısı bu ihtiyacı karşılar.

```sql
-- Citus ile distributed table
SELECT create_distributed_table('orders', 'customer_id');

-- Sorgu otomatik olarak shard'lara dağıtılır
SELECT customer_id, SUM(total_amount)
FROM orders
GROUP BY customer_id;
```

### MongoDB: Native Horizontal Scaling

MongoDB, native sharding desteği ile horizontal scaling konusunda avantajlıdır. Veri, shard key'e göre birden fazla shard'a dağıtılır.

```javascript
// Sharding etkinleştirme
sh.enableSharding("ecommerce");
sh.shardCollection("ecommerce.orders", { customer_id: "hashed" });
```

Doğru shard key seçimi kritiktir. Kötü bir shard key, hotspot'lara ve dengesiz veri dağılımına yol açar.

## ACID vs Eventual Consistency

PostgreSQL, tam ACID compliance sunar. Multi-row transaction'lar, serializable isolation ve strong consistency garantileri vardır.

MongoDB, 4.0 sürümünden itibaren multi-document ACID transaction desteği sunar. Ancak performans açısından transaction'lar maliyetlidir ve MongoDB'nin temel tasarım felsefesi ile tam olarak örtüşmez. MongoDB, distributed ortamlarda tunable consistency sunar: read ve write concern ayarları ile consistency-performance trade-off yapılabilir.

```javascript
// MongoDB transaction
const session = client.startSession();
session.startTransaction();
try {
  await db.accounts.updateOne(
    { _id: fromAccount }, { $inc: { balance: -amount } }, { session }
  );
  await db.accounts.updateOne(
    { _id: toAccount }, { $inc: { balance: amount } }, { session }
  );
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Hangi Durumda Hangisini Seçmeli?

**PostgreSQL tercih edin:**
- Veri bütünlüğü ve transaction'lar kritikse (finans, e-ticaret, sağlık)
- Karmaşık JOIN'ler ve analitik sorgular gerekliyse
- Şema önceden iyi tanımlanabiliyorsa
- JSONB ile semi-structured veri ihtiyacı da karşılanabiliyorsa
- Güçlü SQL ekosisteminden faydalanmak istiyorsanız

**MongoDB tercih edin:**
- Şema hızla değişiyorsa veya önceden tanımlanamıyorsa
- Okuma ağırlıklı, yüksek throughput iş yükleri varsa
- Horizontal scaling birincil gereksinimse
- Document-oriented veri modeli doğal bir eşleşmeyse (CMS, katalog, IoT)
- Rapid prototyping yapıyorsanız

## Migration Stratejileri

Mevcut bir veritabanından diğerine geçiş, dikkatli planlama gerektirir.

**PostgreSQL'den MongoDB'ye:**
- Denormalize edin: JOIN'leri embed'e dönüştürün
- Foreign key constraint'leri uygulama seviyesine taşıyın
- Stored procedure'ları uygulama koduna taşıyın

**MongoDB'den PostgreSQL'e:**
- Embedded document'ları normalize edin: Ayrı tablolara bölün
- Şemayı tanımlayın: Her field için tip ve constraint belirleyin
- JSONB alanlarını overuse etmekten kaçının; mümkünse proper column'lara dönüştürün

Her iki durumda da dual-write pattern ile kademeli geçiş yapmanız, riski minimize eder. Önce yeni veritabanına yazma başlatılır, ardından okumalar kademeli olarak geçirilir ve son olarak eski veritabanı devre dışı bırakılır.

Sonuç olarak, PostgreSQL ve MongoDB birbirinin rakibi değil, farklı ihtiyaçlara yönelik araçlardır. Karar verirken veri modeli, consistency gereksinimleri, ölçeklenme ihtiyacı ve takım yetkinliğini birlikte değerlendirin. Doğru veritabanını doğru iş yükü için seçmek, uzun vadede hem performans hem de bakım maliyeti açısından belirleyici olacaktır.
