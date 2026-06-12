package com.colosseum.backend.formula.adapter.out.persistence

import com.colosseum.backend.common.BaseTimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "formulas")
class FormulaJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "category_id")
    val categoryId: Long = 0,

    val title: String = "",

    @Column(name = "content_md", columnDefinition = "TEXT")
    val contentMd: String = "",

    @Column(columnDefinition = "TEXT")
    val svg: String? = null,

    @Column(name = "sort_order")
    val sortOrder: Int = 0,
) : BaseTimeEntity()