package com.ptit.medicare_medical_service.exception;

public class MedicalNotFoundException extends ResourceNotFoundException {
    public MedicalNotFoundException(Long id) {
        super("Không tìm thấy hồ sơ bệnh án với ID: " + id);
    }

    public MedicalNotFoundException(String message) {
        super(message);
    }
}
