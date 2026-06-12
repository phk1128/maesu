package com.colosseum.backend.studylog.application.service

import com.colosseum.backend.studylog.application.port.`in`.GetStudyGridUseCase
import com.colosseum.backend.studylog.application.port.`in`.RecordStudyUseCase
import com.colosseum.backend.studylog.application.port.out.StudyLogPort
import com.colosseum.backend.studylog.domain.DailyStudyCount
import com.colosseum.backend.studylog.domain.StudyGrid
import com.colosseum.backend.studylog.domain.StudyLog
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@Service
@Transactional(readOnly = true)
class StudyLogService(
    private val studyLogPort: StudyLogPort,
) : RecordStudyUseCase, GetStudyGridUseCase {

    @Transactional
    override fun record(userId: UUID, activityType: String, targetId: String) {
        studyLogPort.saveIgnoringDuplicate(StudyLog.create(userId, activityType, targetId))
    }

    override fun getGrid(userId: UUID, weeks: Int): StudyGrid {
        val today = LocalDate.now()
        val from = today.minusWeeks(weeks.toLong())
        val dailyCounts = studyLogPort.countByUserAndDateRange(userId, from, today)
        val totalStudied = dailyCounts.sumOf { it.count }
        val streak = computeStreak(dailyCounts, today)
        return StudyGrid(dailyCounts, totalStudied, streak)
    }

    private fun computeStreak(counts: List<DailyStudyCount>, today: LocalDate): Int {
        val countMap = counts.associate { it.date to it.count }
        var streak = 0
        var date = today
        while (countMap.getOrDefault(date, 0) > 0) {
            streak++
            date = date.minusDays(1)
        }
        return streak
    }
}
