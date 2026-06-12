package com.colosseum.backend.university.adapter.`in`.web

import java.time.LocalDate

data class ExamScheduleDto(
    val academicYear: Int,
    val examDate: LocalDate?,
    val mathType: String,
    val note: String?,
)

data class UniversityExamResponse(
    val id: Long,
    val name: String,
    val shortName: String,
    val color: String,
    val currentYear: ExamScheduleDto?,
    val previousYear: ExamScheduleDto?,
)
