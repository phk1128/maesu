package com.colosseum.backend.favorite.application.service

import com.colosseum.backend.favorite.application.port.`in`.GetFavoritesUseCase
import com.colosseum.backend.favorite.application.port.`in`.GetPopularFormulasUseCase
import com.colosseum.backend.favorite.application.port.`in`.ToggleFavoriteUseCase
import com.colosseum.backend.favorite.application.port.out.FavoritePort
import com.colosseum.backend.favorite.domain.UserFavorite
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional(readOnly = true)
class FavoriteService(
    private val favoritePort: FavoritePort,
) : GetFavoritesUseCase, ToggleFavoriteUseCase, GetPopularFormulasUseCase {

    override fun getFavorites(userId: UUID): List<Long> =
        favoritePort.findByUserId(userId)

    @Transactional
    override fun toggle(userId: UUID, formulaId: Long): Boolean {
        return if (favoritePort.exists(userId, formulaId)) {
            favoritePort.delete(userId, formulaId)
            false
        } else {
            favoritePort.save(UserFavorite.create(userId, formulaId))
            true
        }
    }

    override fun getPopularFormulaIds(limit: Int): List<Long> =
        favoritePort.findPopularFormulaIds(limit)
}
