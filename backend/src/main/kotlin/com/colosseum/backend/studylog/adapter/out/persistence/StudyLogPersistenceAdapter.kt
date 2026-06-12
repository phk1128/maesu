package com.colosseum.backend.studylog.adapter.out.persistence

import com.colosseum.backend.studylog.application.port.out.StudyLogPort
import com.colosseum.backend.studylog.domain.DailyStudyCount
import com.colosseum.backend.studylog.domain.StudyLog
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID

@Repository
class StudyLogPersistenceAdapter(
    private val repo: StudyLogJpaRepository,
) : StudyLogPort {

    override fun saveIgnoringDuplicate(log: StudyLog) {
        repo.insertIgnoringDuplicate(
            userId = log.userId,
            activityType = log.activityType,
            targetId = log.targetId,
            studiedAt = log.studiedAt,
            createdAt = log.createdAt,
        )
    }

    override fun countByUserAndDateRange(userId: UUID, from: LocalDate, to: LocalDate): List<DailyStudyCount> =
        repo.countByUserIdAndDateRange(userId, from, to)
            .map { DailyStudyCount(date = it.getDate(), count = it.getCount()) }
}
