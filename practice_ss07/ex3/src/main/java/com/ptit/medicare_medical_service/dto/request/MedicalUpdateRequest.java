package com.ptit.medicare_medical_service.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ptit.medicare_medical_service.validator.ValidMedicalStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalUpdateRequest {

    @Positive(message = "Mã lịch hẹn phải là số dương")
    private Long appointmentId;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime visitDate;

    @Pattern(regexp = "^[0-9]{2,3}/[0-9]{2,3}$", message = "Huyết áp phải có định dạng chuẩn (ví dụ: 120/80)")
    private String bloodPressure;

    @Min(value = 30, message = "Nhịp tim không hợp lệ (tối thiểu 30 lần/phút)")
    @Max(value = 250, message = "Nhịp tim không hợp lệ (tối đa 250 lần/phút)")
    private Integer heartRate;

    @DecimalMin(value = "30.0", message = "Nhiệt độ cơ thể không hợp lệ (tối thiểu 30.0°C)")
    @DecimalMax(value = "45.0", message = "Nhiệt độ cơ thể không hợp lệ (tối đa 45.0°C)")
    private BigDecimal temperature;

    @DecimalMin(value = "1.0", message = "Cân nặng phải lớn hơn 1.0 kg")
    @DecimalMax(value = "300.0", message = "Cân nặng tối đa 300.0 kg")
    private BigDecimal weight;

    @DecimalMin(value = "30.0", message = "Chiều cao phải lớn hơn 30.0 cm")
    @DecimalMax(value = "250.0", message = "Chiều cao tối đa 250.0 cm")
    private BigDecimal height;

    @Min(value = 50, message = "Chỉ số SpO2 phải từ 50% đến 100%")
    @Max(value = 100, message = "Chỉ số SpO2 phải từ 50% đến 100%")
    private Integer spo2;

    private String symptoms;

    @Size(max = 10, message = "Mã ICD-10 không được dài quá 10 ký tự")
    private String icd10Code;

    @Size(max = 255, message = "Chẩn đoán kết luận không được dài quá 255 ký tự")
    private String diagnosis;

    private String results;

    private String treatmentPlan;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate followUpDate;

    @ValidMedicalStatus(message = "Trạng thái chỉ có thể là DRAFT, FINALIZED, CANCELLED")
    private String status;
}
