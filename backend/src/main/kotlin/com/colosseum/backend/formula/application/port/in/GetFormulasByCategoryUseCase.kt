package com.colosseum.backend.formula.application.port.`in`

import com.colosseum.backend.formula.domain.Formula

fun interface GetFormulasByCategoryUseCase {
    fun getFormulasByCategory(categoryId: Long): List<Formula>
}
