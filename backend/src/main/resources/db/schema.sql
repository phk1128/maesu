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

CREATE TABLE IF NOT EXISTS user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    formula_id BIGINT NOT NULL REFERENCES formulas(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, formula_id)
);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

CREATE TABLE IF NOT EXISTS study_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_type VARCHAR(20) NOT NULL,
    target_id VARCHAR(50) NOT NULL,
    studied_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, activity_type, target_id, studied_at)
);
CREATE INDEX IF NOT EXISTS idx_study_logs_user_date ON study_logs(user_id, studied_at);

CREATE TABLE IF NOT EXISTS universities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    short_name VARCHAR(20) NOT NULL,
    color VARCHAR(7) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS exam_schedules (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL REFERENCES universities(id),
    academic_year INT NOT NULL,
    exam_date DATE,
    math_type VARCHAR(20) NOT NULL,
    note VARCHAR(200),
    UNIQUE(university_id, academic_year)
);

-- 유저 프로필 (소프트삭제 deleted_at 포함)
CREATE TABLE IF NOT EXISTS users (
    user_id     UUID PRIMARY KEY,
    nickname    VARCHAR(100) NOT NULL,
    avatar_url  TEXT,
    kakao_name  VARCHAR(100),
    email       VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMP NULL
);

-- BaseTimeEntity 공통 시간 컬럼: 전 테이블에 created_at/modified_at (멱등 — 기존 DB 백필 겸용)
ALTER TABLE categories     ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE categories     ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE formulas       ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE formulas       ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE universities   ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE universities   ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE exam_schedules ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE exam_schedules ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE user_favorites ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE study_logs     ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP NOT NULL DEFAULT NOW();