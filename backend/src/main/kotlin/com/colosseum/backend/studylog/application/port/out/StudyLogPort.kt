package com.colosseum.backend.studylog.application.port.out

import com.colosseum.backend.studylog.domain.DailyStudyCount
import com.colosseum.backend.studylog.domain.StudyLog
import java.time.LocalDate
import java.util.UUID

interface StudyLogPort {
    fun saveIgnoringDuplicate(log: StudyLog)
    fun countByUserAndDateRange(userId: UUID, from: LocalDate, to: LocalDate): List<DailyStudyCount>
}
