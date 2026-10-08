package com.ptit.medicare_medical_service.entity;

import com.ptit.medicare_medical_service.enums.MedicalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Check;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "medicals",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_medical_record_code", columnNames = "record_code"),
                @UniqueConstraint(name = "uk_medical_appointment", columnNames = "appointment_id")
        },
        indexes = {
                @Index(name = "idx_medical_patient_date", columnList = "patient_id, is_deleted, visit_date DESC"),
                @Index(name = "idx_medical_doctor_date", columnList = "doctor_id, is_deleted, visit_date DESC"),
                @Index(name = "idx_medical_icd10", columnList = "icd10_code"),
                @Index(name = "idx_medical_follow_up", columnList = "follow_up_date, is_deleted"),
                @Index(name = "idx_medical_is_deleted", columnList = "is_deleted")
        }
)
@Check(constraints = "spo2 IS NULL OR (spo2 BETWEEN 50 AND 100)")
@Check(constraints = "heart_rate IS NULL OR (heart_rate BETWEEN 30 AND 250)")
@Check(constraints = "temperature IS NULL OR (temperature BETWEEN 30.0 AND 45.0)")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "record_code", nullable = false, length = 30)
    private String recordCode;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "visit_date", nullable = false)
    private LocalDateTime visitDate;

    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "temperature", precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(name = "weight", precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(name = "height", precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "spo2")
    private Integer spo2;

    @Column(name = "symptoms", nullable = false, columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "icd10_code", length = 10)
    private String icd10Code;

    @Column(name = "diagnosis", nullable = false, length = 255)
    private String diagnosis;

    @Column(name = "results", columnDefinition = "TEXT")
    private String results;

    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private MedicalStatus status = MedicalStatus.FINALIZED;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
        if (this.status == null) {
            this.status = MedicalStatus.FINALIZED;
        }
        if (this.visitDate == null) {
            this.visitDate = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
