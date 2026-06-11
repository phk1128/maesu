package com.colosseum.backend.formula.application.port.`in`

import com.colosseum.backend.formula.domain.Category

fun interface GetCategoriesUseCase {
    fun getCategories(): List<Category>
}
