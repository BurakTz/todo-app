-- Bu script, PostgreSQL container'i ILK KEZ (bos bir volume ile) baslarken
-- otomatik calisir (docker-entrypoint-initdb.d mekanizmasi sayesinde).
-- Volume zaten doluysa (ikinci calistirmalarda) bu script HIC calismaz.

-- Backend'in Hibernate ile olusturacagi semaya birebir uyumlu tablolari
-- burada da tanimliyoruz - cunku bu script, backend ilk acilmadan (yani
-- Hibernate tablolari yaratmadan) ONCE calisiyor. IF NOT EXISTS sayesinde,
-- backend sonra acilinca Hibernate bu tablolari zaten var buluyor,
-- ddl-auto=update calismaya calissa bile hicbir celiski cikmiyor.

CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS tasks (
                                     id BIGSERIAL PRIMARY KEY,
                                     user_id BIGINT NOT NULL REFERENCES users(id),
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    priority VARCHAR(255),
    category VARCHAR(255),
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS subtasks (
                                        id BIGSERIAL PRIMARY KEY,
                                        task_id BIGINT NOT NULL REFERENCES tasks(id),
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
    );

-- Demo kullanici: email = demo@example.com, sifre = demo1234
-- (sifre BCrypt ile onceden hash'lenmis, duz metin degil)
INSERT INTO users (email, password_hash)
VALUES ('demo@example.com', '$2b$12$FFywKQ3hPYE4nrssYumCIuw1nHgzT84DnzAQa0HTiqOVnKXrfsMZK')
    ON CONFLICT (email) DO NOTHING;

-- Demo kullaniciya birkac ornek task ekle
INSERT INTO tasks (user_id, text, completed, priority, category)
SELECT id, 'Ilk gorevini tamamla', false, 'high', 'genel'
FROM users WHERE email = 'demo@example.com'
    ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, text, completed, priority, category)
SELECT id, 'Docker Compose ile projeyi ayaga kaldir', true, 'medium', 'gelistirme'
FROM users WHERE email = 'demo@example.com'
    ON CONFLICT DO NOTHING;