package com.colosseum.backend.university.adapter.out.persistence

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@Table(name = "exam_schedules")
class ExamScheduleJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "university_id", nullable = false)
    val universityId: Long = 0,

    @Column(name = "academic_year", nullable = false)
    val academicYear: Int = 0,

    @Column(name = "exam_date")
    val examDate: LocalDate? = null,

    @Column(name = "math_type", nullable = false)
    val mathType: String = "",

    @Column
    val note: String? = null,
)
