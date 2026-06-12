package com.colosseum.backend.favorite.application.port.`in`

import java.util.UUID

fun interface ToggleFavoriteUseCase {
    /** @return true if added, false if removed */
    fun toggle(userId: UUID, formulaId: Long): Boolean
}
