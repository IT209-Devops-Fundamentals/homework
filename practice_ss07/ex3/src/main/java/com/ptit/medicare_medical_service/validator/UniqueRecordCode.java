package com.ptit.medicare_medical_service.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UniqueRecordCodeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueRecordCode {
    String message() default "Mã hồ sơ bệnh án đã tồn tại trên hệ thống";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
