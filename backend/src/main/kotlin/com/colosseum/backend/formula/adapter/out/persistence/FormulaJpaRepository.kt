package com.colosseum.backend.formula.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface FormulaJpaRepository : JpaRepository<FormulaJpaEntity, Long> {
    fun findByCategoryIdOrderBySortOrderAsc(categoryId: Long): List<FormulaJpaEntity>
}