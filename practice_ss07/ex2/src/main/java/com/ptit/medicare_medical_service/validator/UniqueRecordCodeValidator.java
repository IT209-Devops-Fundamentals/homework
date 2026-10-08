package com.ptit.medicare_medical_service.validator;

import com.ptit.medicare_medical_service.repository.MedicalRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UniqueRecordCodeValidator implements ConstraintValidator<UniqueRecordCode, String> {
    private final MedicalRepository medicalRepository;

    @Override
    public boolean isValid(String recordCode, ConstraintValidatorContext context) {
        if (recordCode == null || recordCode.trim().isEmpty()) {
            return true;
        }
        return !medicalRepository.existsByRecordCode(recordCode.trim());
    }
}
