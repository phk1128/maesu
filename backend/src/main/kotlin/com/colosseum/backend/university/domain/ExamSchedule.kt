package com.colosseum.backend.university.domain

import java.time.LocalDate

class ExamSchedule(
    val id: Long,
    val universityId: Long,
    val academicYear: Int,
    val examDate: LocalDate?,
    val mathType: String,
    val note: String?,
)
