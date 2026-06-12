package com.colosseum.backend.studylog.domain

import java.time.Instant
import java.time.LocalDate
import java.util.UUID

class StudyLog private constructor(
    val id: Long?,
    val userId: UUID,
    val activityType: String,
    val targetId: String,
    val studiedAt: LocalDate,
    val createdAt: Instant,
) {
    companion object {
        fun create(userId: UUID, activityType: String, targetId: String): StudyLog =
            StudyLog(
                id = null,
                userId = userId,
                activityType = activityType,
                targetId = targetId,
                studiedAt = LocalDate.now(),
                createdAt = Instant.now(),
            )
    }

    override fun equals(other: Any?): Boolean =
        this === other || (other is StudyLog && id != null && id == other.id)

    override fun hashCode(): Int = id?.hashCode() ?: 0
}
