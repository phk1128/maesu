package com.colosseum.backend.formula.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface CategoryJpaRepository : JpaRepository<CategoryJpaEntity, Long> {
    fun findAllByOrderBySortOrderAsc(): List<CategoryJpaEntity>
}