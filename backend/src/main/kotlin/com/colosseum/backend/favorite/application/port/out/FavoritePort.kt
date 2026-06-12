package com.colosseum.backend.favorite.application.port.out

import com.colosseum.backend.favorite.domain.UserFavorite
import java.util.UUID

interface FavoritePort {
    fun findByUserId(userId: UUID): List<Long>
    fun exists(userId: UUID, formulaId: Long): Boolean
    fun save(favorite: UserFavorite)
    fun delete(userId: UUID, formulaId: Long)
    fun findPopularFormulaIds(limit: Int): List<Long>
}
