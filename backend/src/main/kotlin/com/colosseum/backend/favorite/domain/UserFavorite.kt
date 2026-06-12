package com.colosseum.backend.favorite.domain

import java.time.Instant
import java.util.UUID

class UserFavorite private constructor(
    val id: Long?,
    val userId: UUID,
    val formulaId: Long,
    val createdAt: Instant,
) {
    companion object {
        fun create(userId: UUID, formulaId: Long): UserFavorite =
            UserFavorite(id = null, userId = userId, formulaId = formulaId, createdAt = Instant.now())

        fun of(id: Long, userId: UUID, formulaId: Long, createdAt: Instant): UserFavorite =
            UserFavorite(id = id, userId = userId, formulaId = formulaId, createdAt = createdAt)
    }

    override fun equals(other: Any?): Boolean =
        this === other || (other is UserFavorite && id != null && id == other.id)

    override fun hashCode(): Int = id?.hashCode() ?: 0
}
