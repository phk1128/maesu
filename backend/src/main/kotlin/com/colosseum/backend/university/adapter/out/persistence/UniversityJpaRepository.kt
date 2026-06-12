package com.colosseum.backend.university.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface UniversityJpaRepository : JpaRepository<UniversityJpaEntity, Long>
