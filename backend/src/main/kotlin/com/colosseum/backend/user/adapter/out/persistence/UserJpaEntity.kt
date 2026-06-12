package com.colosseum.backend.user.adapter.out.persistence

import com.colosseum.backend.common.BaseTimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.SQLRestriction
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted_at = now() WHERE user_id = ?")
@SQLRestriction("deleted_at IS NULL")
class UserJpaEntity(
    @Id
    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    val userId: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),

    @Column(name = "nickname", nullable = false)
    val nickname: String = "",

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    val avatarUrl: String? = null,

    @Column(name = "kakao_name")
    val kakaoName: String? = null,

    @Column(name = "email")
    val email: String? = null,

    @Column(name = "deleted_at")
    val deletedAt: LocalDateTime? = null,
) : BaseTimeEntity()
