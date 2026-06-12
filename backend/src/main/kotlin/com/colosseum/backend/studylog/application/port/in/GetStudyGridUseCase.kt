package com.colosseum.backend.studylog.application.port.`in`

import com.colosseum.backend.studylog.domain.StudyGrid
import java.util.UUID

fun interface GetStudyGridUseCase {
    fun getGrid(userId: UUID, weeks: Int): StudyGrid
}
