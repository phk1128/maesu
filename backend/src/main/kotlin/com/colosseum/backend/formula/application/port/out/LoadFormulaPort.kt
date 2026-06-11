package com.colosseum.backend.formula.application.port.out

import com.colosseum.backend.formula.domain.Formula

interface LoadFormulaPort {
    fun loadByCategoryId(categoryId: Long): List<Formula>
    fun loadById(id: Long): Formula?
}
