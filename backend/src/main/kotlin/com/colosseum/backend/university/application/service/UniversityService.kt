package com.colosseum.backend.university.application.service

import com.colosseum.backend.university.adapter.`in`.web.ExamScheduleDto
import com.colosseum.backend.university.adapter.`in`.web.UniversityExamResponse
import com.colosseum.backend.university.application.port.`in`.GetExamSchedulesUseCase
import com.colosseum.backend.university.application.port.out.UniversityPort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class UniversityService(
    private val universityPort: UniversityPort,
) : GetExamSchedulesUseCase {

    override fun getAll(mathType: String?): List<UniversityExamResponse> {
        val universities = universityPort.findAllUniversities()
        val currentYear = LocalDate.now().year + 1 // 2027학년도
        val prevYear = currentYear - 1             // 2026학년도

        val currentSchedules = universityPort.findSchedulesByAcademicYear(currentYear)
            .associateBy { it.universityId }
        val prevSchedules = universityPort.findSchedulesByAcademicYear(prevYear)
            .associateBy { it.universityId }

        return universities.sortedBy { it.sortOrder }
            .map { uni ->
                val curr = currentSchedules[uni.id]
                val prev = prevSchedules[uni.id]
                UniversityExamResponse(
                    id = uni.id,
                    name = uni.name,
                    shortName = uni.shortName,
                    color = uni.color,
                    currentYear = curr?.let {
                        ExamScheduleDto(it.academicYear, it.examDate, it.mathType, it.note)
                    },
                    previousYear = prev?.let {
                        ExamScheduleDto(it.academicYear, it.examDate, it.mathType, it.note)
                    },
                )
            }
            .let { list ->
                if (mathType == null) list
                else list.filter { it.currentYear?.mathType == mathType || it.previousYear?.mathType == mathType }
            }
    }
}
