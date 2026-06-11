package com.colosseum.backend.formula.adapter.`in`.web

import com.colosseum.backend.formula.domain.Category

data class CategoryResponse(
    val id: Long,
    val area: String,
    val name: String,
    val sortOrder: Int,
) {
    companion object {
        fun from(category: Category) = CategoryResponse(
            id = category.id!!,
            area = category.area.displayName,
            name = category.name,
            sortOrder = category.sortOrder,
        )
    }
}