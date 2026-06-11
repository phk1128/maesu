package com.colosseum.backend.formula.adapter.`in`.web

import com.colosseum.backend.common.ApiResponse
import com.colosseum.backend.formula.application.port.`in`.GetFormulaUseCase
import com.colosseum.backend.formula.application.port.`in`.GetFormulasByCategoryUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class FormulaController(
    private val getFormulasByCategoryUseCase: GetFormulasByCategoryUseCase,
    private val getFormulaUseCase: GetFormulaUseCase,
) {
    @GetMapping("/api/categories/{id}/formulas")
    fun getFormulasByCategory(@PathVariable id: Long): ApiResponse<List<FormulaResponse>> =
        ApiResponse.ok(getFormulasByCategoryUseCase.getFormulasByCategory(id).map(FormulaResponse::from))

    @GetMapping("/api/formulas/{id}")
    fun getFormula(@PathVariable id: Long): ApiResponse<FormulaResponse> =
        ApiResponse.ok(getFormulaUseCase.getFormula(id).let(FormulaResponse::from))
}