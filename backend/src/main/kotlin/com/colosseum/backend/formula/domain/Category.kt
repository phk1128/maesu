package com.colosseum.backend.formula.domain

/**
 * 세부단원 (기획서 §2.2, DDL categories). 영역 내에서 학습 순서(sortOrder)를 가진다.
 *
 * DDD: 애그리거트 루트. 식별자(id) 기반 동등성을 가지며, 생성 시 불변식을 강제한다.
 */
class Category private constructor(
    val id: Long?,
    val area: Area,
    val name: String,
    val sortOrder: Int,
) {
    companion object {
        fun of(id: Long?, area: Area, name: String, sortOrder: Int): Category {
            require(name.isNotBlank()) { "세부단원 이름은 비어 있을 수 없다" }
            require(sortOrder >= 0) { "정렬 순서는 음수일 수 없다" }
            return Category(id, area, name, sortOrder)
        }
    }

    override fun equals(other: Any?): Boolean =
        this === other || (other is Category && id != null && id == other.id)

    override fun hashCode(): Int = id?.hashCode() ?: 0
}
