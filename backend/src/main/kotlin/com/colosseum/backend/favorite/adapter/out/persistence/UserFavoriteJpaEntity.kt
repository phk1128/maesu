package com.colosseum.backend.favorite.adapter.out.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "user_favorites")
class UserFavoriteJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    val userId: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),

    @Column(name = "formula_id", nullable = false)
    val formulaId: Long = 0,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),
)
