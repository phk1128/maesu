package com.colosseum.backend.university.adapter.out.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "universities")
class UniversityJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(name = "short_name", nullable = false)
    val shortName: String = "",

    @Column(nullable = false)
    val color: String = "",

    @Column(name = "sort_order", nullable = false)
    val sortOrder: Int = 0,
)
