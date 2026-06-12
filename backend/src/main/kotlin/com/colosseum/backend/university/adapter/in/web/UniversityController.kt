package com.colosseum.backend.university.adapter.`in`.web

import com.colosseum.backend.common.ApiResponse
import com.colosseum.backend.university.application.port.`in`.GetExamSchedulesUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class UniversityController(
    private val getExamSchedulesUseCase: GetExamSchedulesUseCase,
) {

    @GetMapping("/api/universities")
    fun getAll(
        @RequestParam(required = false) mathType: String?,
    ): ApiResponse<List<UniversityExamResponse>> =
        ApiResponse.ok(getExamSchedulesUseCase.getAll(mathType))
}
