package com.colosseum.backend.user.adapter.out.persistence

import com.colosseum.backend.user.application.port.out.UserPort
import com.colosseum.backend.user.domain.User
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class UserPersistenceAdapter(
    private val repo: UserJpaRepository,
) : UserPort {

    override fun loadById(userId: UUID): User? =
        repo.findById(userId).map { it.toDomain() }.orElse(null)

    override fun save(user: User): User =
        repo.save(user.toEntity()).toDomain()

    private fun UserJpaEntity.toDomain(): User =
        User.of(
            userId = userId,
            nickname = nickname,
            avatarUrl = avatarUrl,
            kakaoName = kakaoName,
            email = email,
        )

    private fun User.toEntity(): UserJpaEntity =
        UserJpaEntity(
            userId = userId,
            nickname = nickname,
            avatarUrl = avatarUrl,
            kakaoName = kakaoName,
            email = email,
        )
}
