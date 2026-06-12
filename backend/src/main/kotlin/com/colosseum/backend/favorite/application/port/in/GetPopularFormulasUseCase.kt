package com.colosseum.backend.favorite.application.port.`in`

fun interface GetPopularFormulasUseCase {
    fun getPopularFormulaIds(limit: Int): List<Long>
}
