package com.colosseum.backend.studylog.adapter.`in`.web

import com.colosseum.backend.common.ApiResponse
import com.colosseum.backend.studylog.application.port.`in`.GetStudyGridUseCase
import com.colosseum.backend.studylog.application.port.`in`.RecordStudyUseCase
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

private val VALID_ACTIVITY_TYPES = setOf("formula", "problem", "analyze", "variation")
private const val MAX_WEEKS = 52

@RestController
class StudyLogController(
    private val recordStudyUseCase: RecordStudyUseCase,
    private val getStudyGridUseCase: GetStudyGridUseCase,
) {

    @PostMapping("/api/study-logs")
    fun record(
        @RequestBody request: RecordStudyRequest,
        auth: JwtAuthenticationToken,
    ): ApiResponse<Unit> {
        require(request.activityType in VALID_ACTIVITY_TYPES) { "유효하지 않은 활동 타입입니다" }
        require(request.targetId.length <= 50) { "대상 ID가 너무 깁니다" }
        val userId = UUID.fromString(auth.token.subject)
        recordStudyUseCase.record(userId, request.activityType, request.targetId)
        return ApiResponse.ok(Unit)
    }

    @GetMapping("/api/study-logs/grid")
    fun getGrid(
        @RequestParam(defaultValue = "18") weeks: Int,
        auth: JwtAuthenticationToken,
    ): ApiResponse<StudyGridResponse> {
        val userId = UUID.fromString(auth.token.subject)
        val grid = getStudyGridUseCase.getGrid(userId, weeks.coerceIn(1, MAX_WEEKS))
        return ApiResponse.ok(StudyGridResponse.from(grid))
    }
}
