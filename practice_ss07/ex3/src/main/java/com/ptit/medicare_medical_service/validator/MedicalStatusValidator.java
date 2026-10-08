package com.ptit.medicare_medical_service.validator;

import com.ptit.medicare_medical_service.enums.MedicalStatus;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;

public class MedicalStatusValidator implements ConstraintValidator<ValidMedicalStatus, String> {
    private String customMessage;

    @Override
    public void initialize(ValidMedicalStatus constraintAnnotation) {
        this.customMessage = constraintAnnotation.message();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        boolean valid = Arrays.stream(MedicalStatus.values())
                .anyMatch(status -> status.name().equalsIgnoreCase(value.trim()));

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(customMessage)
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
