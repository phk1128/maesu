package com.colosseum.backend.university.application.port.`in`

import com.colosseum.backend.university.adapter.`in`.web.UniversityExamResponse

interface GetExamSchedulesUseCase {
    fun getAll(mathType: String? = null): List<UniversityExamResponse>
}
