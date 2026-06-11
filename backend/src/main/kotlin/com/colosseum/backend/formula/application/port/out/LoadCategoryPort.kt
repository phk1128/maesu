package com.colosseum.backend.formula.application.port.out

import com.colosseum.backend.formula.domain.Category

interface LoadCategoryPort {
    fun loadAll(): List<Category>
    fun loadById(id: Long): Category?
}
