package com.colosseum.backend.university.adapter.out.persistence

import com.colosseum.backend.university.application.port.out.UniversityPort
import com.colosseum.backend.university.domain.ExamSchedule
import com.colosseum.backend.university.domain.University
import org.springframework.stereotype.Repository

@Repository
class UniversityPersistenceAdapter(
    private val universityRepo: UniversityJpaRepository,
    private val scheduleRepo: ExamScheduleJpaRepository,
) : UniversityPort {

    override fun findAllUniversities(): List<University> =
        universityRepo.findAll().map {
            University(it.id, it.name, it.shortName, it.color, it.sortOrder)
        }

    override fun findSchedulesByAcademicYear(year: Int): List<ExamSchedule> =
        scheduleRepo.findByAcademicYear(year).map {
            ExamSchedule(it.id, it.universityId, it.academicYear, it.examDate, it.mathType, it.note)
        }
}
