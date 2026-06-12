package com.colosseum.backend.user.adapter.`in`.web

import com.colosseum.backend.user.domain.User
import java.util.UUID

data class UserResponse(
    val userId: UUID,
    val nickname: String,
    val avatarUrl: String?,
    val kakaoName: String?,
    val email: String?,
) {
    companion object {
        fun from(user: User): UserResponse =
            UserResponse(
                userId = user.userId,
                nickname = user.nickname,
                avatarUrl = user.avatarUrl,
                kakaoName = user.kakaoName,
                email = user.email,
            )
    }
}
