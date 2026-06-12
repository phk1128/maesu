package com.colosseum.backend.university.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface ExamScheduleJpaRepository : JpaRepository<ExamScheduleJpaEntity, Long> {
    fun findByAcademicYear(academicYear: Int): List<ExamScheduleJpaEntity>
}
