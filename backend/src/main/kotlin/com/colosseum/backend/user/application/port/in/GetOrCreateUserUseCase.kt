package com.colosseum.backend.user.application.port.`in`

import com.colosseum.backend.user.domain.User
import java.util.UUID

fun interface GetOrCreateUserUseCase {
    /**
     * userId에 해당하는 유저가 있으면 반환하고, 없으면 프로필로 신규 가입(닉네임 생성)시킨 뒤 반환한다.
     */
    fun getOrCreate(command: GetOrCreateUserCommand): User
}

data class GetOrCreateUserCommand(
    val userId: UUID,
    val avatarUrl: String?,
    val kakaoName: String?,
    val email: String?,
)
