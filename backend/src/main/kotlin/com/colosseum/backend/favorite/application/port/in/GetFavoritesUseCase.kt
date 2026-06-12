package com.colosseum.backend.favorite.application.port.`in`

import java.util.UUID

fun interface GetFavoritesUseCase {
    fun getFavorites(userId: UUID): List<Long>
}
