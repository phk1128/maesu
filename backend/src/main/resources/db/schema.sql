CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    area VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS formulas (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    title VARCHAR(500) NOT NULL,
    content_md TEXT NOT NULL DEFAULT '',
    svg TEXT,
    sort_order INT NOT NULL DEFAULT 0
);