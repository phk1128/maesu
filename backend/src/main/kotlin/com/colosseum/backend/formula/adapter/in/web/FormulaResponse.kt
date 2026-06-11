package com.colosseum.backend.formula.adapter.`in`.web

import com.colosseum.backend.formula.domain.Formula

data class FormulaResponse(
    val id: Long,
    val categoryId: Long,
    val title: String,
    val contentMd: String,
    val svg: String?,
    val sortOrder: Int,
) {
    companion object {
        fun from(formula: Formula) = FormulaResponse(
            id = formula.id!!,
            categoryId = formula.category.id!!,
            title = formula.title,
            contentMd = formula.contentMd,
            svg = formula.svg,
            sortOrder = formula.sortOrder,
        )
    }
}