package com.colosseum.backend.formula.adapter.`in`.web

import com.colosseum.backend.common.ApiResponse
import com.colosseum.backend.formula.application.port.`in`.GetCategoriesUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val getCategoriesUseCase: GetCategoriesUseCase,
) {
    @GetMapping
    fun getCategories(): ApiResponse<List<CategoryResponse>> =
        ApiResponse.ok(getCategoriesUseCase.getCategories().map(CategoryResponse::from))
}