package com.ptit.medicare_medical_service.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ptit.medicare_medical_service.enums.MedicalStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalResponse {
    private Long id;
    private String recordCode;
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime visitDate;

    private String bloodPressure;
    private Integer heartRate;
    private BigDecimal temperature;
    private BigDecimal weight;
    private BigDecimal height;
    private Integer spo2;
    private String symptoms;
    private String icd10Code;
    private String diagnosis;
    private String results;
    private String treatmentPlan;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate followUpDate;

    private MedicalStatus status;
    private Boolean isDeleted;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime updatedAt;
}
