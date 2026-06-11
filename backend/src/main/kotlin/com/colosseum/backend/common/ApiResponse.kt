package com.colosseum.backend.common

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: String?,
) {
    companion object {
        fun <T> ok(data: T): ApiResponse<T> = ApiResponse(success = true, data = data, error = null)
        fun fail(error: String): ApiResponse<Nothing> = ApiResponse(success = false, data = null, error = error)
    }
}