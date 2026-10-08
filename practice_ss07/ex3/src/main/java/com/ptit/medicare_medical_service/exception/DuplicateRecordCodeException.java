package com.ptit.medicare_medical_service.exception;

public class DuplicateRecordCodeException extends DuplicateResourceException {
    public DuplicateRecordCodeException(String recordCode) {
        super("Mã hồ sơ bệnh án '" + recordCode + "' đã tồn tại trên hệ thống");
    }
}
