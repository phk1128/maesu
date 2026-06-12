package com.colosseum.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

/**
 * JPA Auditing 활성화 — BaseTimeEntity의 createdAt/modifiedAt 자동 기록.
 */
@Configuration
@EnableJpaAuditing
class JpaConfig
