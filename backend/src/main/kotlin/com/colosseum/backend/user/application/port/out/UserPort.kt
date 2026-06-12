package com.colosseum.backend.user.application.port.out

import com.colosseum.backend.user.domain.User
import java.util.UUID

interface UserPort {
    fun loadById(userId: UUID): User?
    fun save(user: User): User
}
