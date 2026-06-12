package com.colosseum.backend.studylog.application.port.`in`

import java.util.UUID

fun interface RecordStudyUseCase {
    fun record(userId: UUID, activityType: String, targetId: String)
}
