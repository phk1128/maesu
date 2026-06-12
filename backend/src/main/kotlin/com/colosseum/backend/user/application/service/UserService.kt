package com.colosseum.backend.user.application.service

import com.colosseum.backend.user.application.port.`in`.GetOrCreateUserCommand
import com.colosseum.backend.user.application.port.`in`.GetOrCreateUserUseCase
import com.colosseum.backend.user.application.port.out.UserPort
import com.colosseum.backend.user.domain.NicknameGenerator
import com.colosseum.backend.user.domain.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserService(
    private val userPort: UserPort,
) : GetOrCreateUserUseCase {

    override fun getOrCreate(command: GetOrCreateUserCommand): User =
        userPort.loadById(command.userId) ?: userPort.save(
            User.register(
                userId = command.userId,
                nickname = NicknameGenerator.generate(),
                avatarUrl = command.avatarUrl,
                kakaoName = command.kakaoName,
                email = command.email,
            )
        )
}
