package com.colosseum.backend.studylog.adapter.out.persistence

import com.colosseum.backend.common.BaseTimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "study_logs")
class StudyLogJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "user_id", columnDefinition = "UUID", nullable = false)
    val userId: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000"),

    @Column(name = "activity_type", nullable = false)
    val activityType: String = "",

    @Column(name = "target_id", nullable = false)
    val targetId: String = "",

    @Column(name = "studied_at", nullable = false)
    val studiedAt: LocalDate = LocalDate.now(),
) : BaseTimeEntity()
