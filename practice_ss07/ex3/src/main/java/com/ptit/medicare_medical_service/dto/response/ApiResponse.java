package com.ptit.medicare_medical_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;
    private T errors;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> ok(String message) {
        return new ApiResponse<>(HttpStatus.OK.value(), message, null, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(HttpStatus.OK.value(), message, data, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(HttpStatus.CREATED.value(), message, data, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> noContent(String message) {
        return new ApiResponse<>(HttpStatus.NO_CONTENT.value(), message, null, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> noContent(String message, T data) {
        return new ApiResponse<>(HttpStatus.NO_CONTENT.value(), message, data, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(int code, String message, T errors) {
        return new ApiResponse<>(code, message, null, errors, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), message, null, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message, T errors) {
        return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), message, null, errors, LocalDateTime.now());
    }
}
