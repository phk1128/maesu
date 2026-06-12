package com.colosseum.backend.favorite.adapter.`in`.web

import com.colosseum.backend.common.ApiResponse
import com.colosseum.backend.favorite.application.port.`in`.GetFavoritesUseCase
import com.colosseum.backend.favorite.application.port.`in`.ToggleFavoriteUseCase
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class FavoriteController(
    private val getFavoritesUseCase: GetFavoritesUseCase,
    private val toggleFavoriteUseCase: ToggleFavoriteUseCase,
) {

    @GetMapping("/api/favorites")
    fun getFavorites(auth: JwtAuthenticationToken): ApiResponse<List<Long>> {
        val userId = extractUserId(auth)
        return ApiResponse.ok(getFavoritesUseCase.getFavorites(userId))
    }

    @PostMapping("/api/favorites/{formulaId}")
    fun toggleFavorite(
        @PathVariable formulaId: Long,
        auth: JwtAuthenticationToken,
    ): ApiResponse<ToggleFavoriteResponse> {
        val userId = extractUserId(auth)
        val added = toggleFavoriteUseCase.toggle(userId, formulaId)
        return ApiResponse.ok(ToggleFavoriteResponse(added = added, formulaId = formulaId))
    }

    private fun extractUserId(auth: JwtAuthenticationToken): UUID =
        UUID.fromString(auth.token.subject)
}
