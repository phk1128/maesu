package com.colosseum.backend.user.domain

import java.util.UUID

/**
 * 유저 애그리거트 루트. 식별자(userId) 기반 동등성.
 * 카카오 OAuth 프로필(avatarUrl·kakaoName·email)을 기록용으로 보유하고,
 * 가입 시 1회 고정되는 병맛 랜덤 닉네임을 가진다.
 */
class User private constructor(
    val userId: UUID,
    val nickname: String,
    val avatarUrl: String?,
    val kakaoName: String?,
    val email: String?,
) {
    companion object {
        /** 신규 가입: 닉네임을 생성해 고정한다. */
        fun register(
            userId: UUID,
            nickname: String,
            avatarUrl: String?,
            kakaoName: String?,
            email: String?,
        ): User = User(userId, nickname, avatarUrl, kakaoName, email)

        /** 영속 상태에서 복원. */
        fun of(
            userId: UUID,
            nickname: String,
            avatarUrl: String?,
            kakaoName: String?,
            email: String?,
        ): User = User(userId, nickname, avatarUrl, kakaoName, email)
    }

    override fun equals(other: Any?): Boolean =
        this === other || (other is User && userId == other.userId)

    override fun hashCode(): Int = userId.hashCode()
}
