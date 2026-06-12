package com.colosseum.backend.university.application.port.out

import com.colosseum.backend.university.domain.ExamSchedule
import com.colosseum.backend.university.domain.University

interface UniversityPort {
    fun findAllUniversities(): List<University>
    fun findSchedulesByAcademicYear(year: Int): List<ExamSchedule>
}
