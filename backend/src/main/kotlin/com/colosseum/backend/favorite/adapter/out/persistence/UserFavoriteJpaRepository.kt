package com.colosseum.backend.favorite.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserFavoriteJpaRepository : JpaRepository<UserFavoriteJpaEntity, Long> {
    fun findByUserId(userId: UUID): List<UserFavoriteJpaEntity>
    fun existsByUserIdAndFormulaId(userId: UUID, formulaId: Long): Boolean
    fun deleteByUserIdAndFormulaId(userId: UUID, formulaId: Long)
}
