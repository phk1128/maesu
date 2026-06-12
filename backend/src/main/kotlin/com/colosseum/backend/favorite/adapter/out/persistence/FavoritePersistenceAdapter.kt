package com.colosseum.backend.favorite.adapter.out.persistence

import com.colosseum.backend.favorite.application.port.out.FavoritePort
import com.colosseum.backend.favorite.domain.UserFavorite
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class FavoritePersistenceAdapter(
    private val repo: UserFavoriteJpaRepository,
) : FavoritePort {

    override fun findByUserId(userId: UUID): List<Long> =
        repo.findByUserId(userId).map { it.formulaId }

    override fun exists(userId: UUID, formulaId: Long): Boolean =
        repo.existsByUserIdAndFormulaId(userId, formulaId)

    override fun save(favorite: UserFavorite) {
        repo.save(
            UserFavoriteJpaEntity(
                userId = favorite.userId,
                formulaId = favorite.formulaId,
                createdAt = favorite.createdAt,
            )
        )
    }

    @Transactional
    override fun delete(userId: UUID, formulaId: Long) {
        repo.deleteByUserIdAndFormulaId(userId, formulaId)
    }
}
