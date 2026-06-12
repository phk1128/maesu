package com.colosseum.backend.studylog.domain

data class StudyGrid(
    val dailyCounts: List<DailyStudyCount>,
    val totalStudied: Int,
    val streak: Int,
)
