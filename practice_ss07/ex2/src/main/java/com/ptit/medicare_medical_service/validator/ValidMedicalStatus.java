package com.ptit.medicare_medical_service.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = MedicalStatusValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidMedicalStatus {
    String message() default "Trạng thái hồ sơ bệnh án chỉ có thể là DRAFT, FINALIZED, CANCELLED";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
