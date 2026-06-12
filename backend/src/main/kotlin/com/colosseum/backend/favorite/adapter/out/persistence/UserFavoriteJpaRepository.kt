package com.colosseum.backend.favorite.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface UserFavoriteJpaRepository : JpaRepository<UserFavoriteJpaEntity, Long> {
    fun findByUserId(userId: UUID): List<UserFavoriteJpaEntity>
    fun existsByUserIdAndFormulaId(userId: UUID, formulaId: Long): Boolean
    fun deleteByUserIdAndFormulaId(userId: UUID, formulaId: Long)

    @Query(
        value = """
            SELECT formula_id AS formulaId, CAST(COUNT(*) AS int) AS count
            FROM user_favorites
            GROUP BY formula_id
            ORDER BY count DESC
            LIMIT :limit
        """,
        nativeQuery = true,
    )
    fun findPopularFormulaIds(@org.springframework.data.repository.query.Param("limit") limit: Int): List<PopularFormulaProjection>
}

interface PopularFormulaProjection {
    fun getFormulaId(): Long
    fun getCount(): Int
}
