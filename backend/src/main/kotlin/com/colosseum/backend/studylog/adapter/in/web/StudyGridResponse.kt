package com.colosseum.backend.studylog.adapter.`in`.web

import com.colosseum.backend.studylog.domain.StudyGrid
import java.time.LocalDate

data class DailyCountDto(val date: LocalDate, val count: Int)

data class StudyGridResponse(
    val dailyCounts: List<DailyCountDto>,
    val totalStudied: Int,
    val streak: Int,
) {
    companion object {
        fun from(grid: StudyGrid): StudyGridResponse = StudyGridResponse(
            dailyCounts = grid.dailyCounts.map { DailyCountDto(it.date, it.count) },
            totalStudied = grid.totalStudied,
            streak = grid.streak,
        )
    }
}
