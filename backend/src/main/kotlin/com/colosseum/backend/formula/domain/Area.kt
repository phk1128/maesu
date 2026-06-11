package com.colosseum.backend.formula.domain

/**
 * 4대 영역 (기획서 §2.1). 모든 공식은 정확히 하나의 영역에 귀속된다.
 * 현재 데이터는 미적분(CALCULUS)만 디지털화됨 (기획서 §10).
 */
enum class Area(val displayName: String) {
    CALCULUS("미적분"),
    LINEAR_ALGEBRA("선형대수"),
    MULTIVARIABLE_CALCULUS("다변수미적분"),
    ENGINEERING_MATH("공업수학");

    companion object {
        fun fromDisplayName(name: String): Area =
            entries.firstOrNull { it.displayName == name }
                ?: throw IllegalArgumentException("알 수 없는 영역: $name")
    }
}
