package com.colosseum.backend.formula.application.port.`in`

import com.colosseum.backend.formula.domain.Formula

fun interface GetFormulaUseCase {
    fun getFormula(formulaId: Long): Formula
}
