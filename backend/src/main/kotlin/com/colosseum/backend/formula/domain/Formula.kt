package com.colosseum.backend.formula.domain

class Formula private constructor(
    val id: Long?,
    val category: Category,
    val title: String,
    val contentMd: String,
    val svg: String?,
    val sortOrder: Int,
) {
    companion object {
        fun of(
            id: Long?,
            category: Category,
            title: String,
            contentMd: String,
            svg: String?,
            sortOrder: Int,
        ): Formula {
            require(title.isNotBlank()) { "공식 제목은 비어 있을 수 없다" }
            require(sortOrder >= 0) { "정렬 순서는 음수일 수 없다" }
            return Formula(id, category, title, contentMd, svg, sortOrder)
        }
    }

    override fun equals(other: Any?): Boolean =
        this === other || (other is Formula && id != null && id == other.id)

    override fun hashCode(): Int = id?.hashCode() ?: 0
}
