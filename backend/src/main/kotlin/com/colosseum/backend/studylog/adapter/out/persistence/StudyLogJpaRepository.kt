package com.colosseum.backend.studylog.adapter.out.persistence

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

interface DailyCountProjection {
    fun getDate(): LocalDate
    fun getCount(): Int
}

interface StudyLogJpaRepository : JpaRepository<StudyLogJpaEntity, Long> {

    @Modifying
    @Query(
        value = """
            INSERT INTO study_logs (user_id, activity_type, target_id, studied_at, created_at)
            VALUES (:userId, :activityType, :targetId, :studiedAt, :createdAt)
            ON CONFLICT (user_id, activity_type, target_id, studied_at) DO NOTHING
        """,
        nativeQuery = true,
    )
    fun insertIgnoringDuplicate(
        @Param("userId") userId: UUID,
        @Param("activityType") activityType: String,
        @Param("targetId") targetId: String,
        @Param("studiedAt") studiedAt: LocalDate,
        @Param("createdAt") createdAt: Instant,
    )

    @Query(
        value = """
            SELECT studied_at AS date, CAST(COUNT(*) AS int) AS count
            FROM study_logs
            WHERE user_id = :userId AND studied_at >= :fromDate AND studied_at <= :toDate
            GROUP BY studied_at
            ORDER BY studied_at
        """,
        nativeQuery = true,
    )
    fun countByUserIdAndDateRange(
        @Param("userId") userId: UUID,
        @Param("fromDate") from: LocalDate,
        @Param("toDate") to: LocalDate,
    ): List<DailyCountProjection>
}
