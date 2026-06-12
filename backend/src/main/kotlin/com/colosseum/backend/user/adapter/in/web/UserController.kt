package com.colosseum.backend.user.adapter.`in`.web

import com.colosseum.backend.common.ApiResponse
import com.colosseum.backend.user.application.port.`in`.GetOrCreateUserCommand
import com.colosseum.backend.user.application.port.`in`.GetOrCreateUserUseCase
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class UserController(
    private val getOrCreateUserUseCase: GetOrCreateUserUseCase,
) {

    @GetMapping("/api/me")
    fun me(auth: JwtAuthenticationToken): ApiResponse<UserResponse> {
        val userId = UUID.fromString(auth.token.subject)
        val metadata = userMetadata(auth)
        val user = getOrCreateUserUseCase.getOrCreate(
            GetOrCreateUserCommand(
                userId = userId,
                avatarUrl = metadata.stringOrNull("avatar_url"),
                kakaoName = metadata.stringOrNull("full_name"),
                email = metadata.stringOrNull("email"),
            )
        )
        return ApiResponse.ok(UserResponse.from(user))
    }

    @Suppress("UNCHECKED_CAST")
    private fun userMetadata(auth: JwtAuthenticationToken): Map<String, Any?> =
        (auth.token.claims["user_metadata"] as? Map<String, Any?>) ?: emptyMap()

    private fun Map<String, Any?>.stringOrNull(key: String): String? =
        (this[key] as? String)?.takeIf { it.isNotBlank() }
}
