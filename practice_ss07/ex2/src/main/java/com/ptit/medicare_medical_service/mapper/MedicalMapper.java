package com.ptit.medicare_medical_service.mapper;

import com.ptit.medicare_medical_service.dto.request.MedicalCreateRequest;
import com.ptit.medicare_medical_service.dto.request.MedicalUpdateRequest;
import com.ptit.medicare_medical_service.dto.response.MedicalResponse;
import com.ptit.medicare_medical_service.entity.Medical;
import com.ptit.medicare_medical_service.enums.MedicalStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MedicalMapper {

    public Medical toEntity(MedicalCreateRequest request) {
        if (request == null) {
            return null;
        }

        MedicalStatus status = MedicalStatus.FINALIZED;
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            status = MedicalStatus.valueOf(request.getStatus().trim().toUpperCase());
        }

        LocalDateTime visitDate = request.getVisitDate() != null ? request.getVisitDate() : LocalDateTime.now();

        return Medical.builder()
                .recordCode(request.getRecordCode() != null ? request.getRecordCode().trim() : null)
                .appointmentId(request.getAppointmentId())
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .visitDate(visitDate)
                .bloodPressure(request.getBloodPressure() != null ? request.getBloodPressure().trim() : null)
                .heartRate(request.getHeartRate())
                .temperature(request.getTemperature())
                .weight(request.getWeight())
                .height(request.getHeight())
                .spo2(request.getSpo2())
                .symptoms(request.getSymptoms() != null ? request.getSymptoms().trim() : null)
                .icd10Code(request.getIcd10Code() != null ? request.getIcd10Code().trim().toUpperCase() : null)
                .diagnosis(request.getDiagnosis() != null ? request.getDiagnosis().trim() : null)
                .results(request.getResults() != null ? request.getResults().trim() : null)
                .treatmentPlan(request.getTreatmentPlan() != null ? request.getTreatmentPlan().trim() : null)
                .followUpDate(request.getFollowUpDate())
                .status(status)
                .isDeleted(false)
                .build();
    }

    public MedicalResponse toResponse(Medical medical) {
        if (medical == null) {
            return null;
        }

        return MedicalResponse.builder()
                .id(medical.getId())
                .recordCode(medical.getRecordCode())
                .appointmentId(medical.getAppointmentId())
                .patientId(medical.getPatientId())
                .doctorId(medical.getDoctorId())
                .visitDate(medical.getVisitDate())
                .bloodPressure(medical.getBloodPressure())
                .heartRate(medical.getHeartRate())
                .temperature(medical.getTemperature())
                .weight(medical.getWeight())
                .height(medical.getHeight())
                .spo2(medical.getSpo2())
                .symptoms(medical.getSymptoms())
                .icd10Code(medical.getIcd10Code())
                .diagnosis(medical.getDiagnosis())
                .results(medical.getResults())
                .treatmentPlan(medical.getTreatmentPlan())
                .followUpDate(medical.getFollowUpDate())
                .status(medical.getStatus())
                .isDeleted(medical.getIsDeleted())
                .createdAt(medical.getCreatedAt())
                .updatedAt(medical.getUpdatedAt())
                .build();
    }

    public void updateEntity(Medical medical, MedicalUpdateRequest request) {
        if (request == null || medical == null) {
            return;
        }

        if (request.getAppointmentId() != null) {
            medical.setAppointmentId(request.getAppointmentId());
        }
        if (request.getVisitDate() != null) {
            medical.setVisitDate(request.getVisitDate());
        }
        if (request.getBloodPressure() != null) {
            medical.setBloodPressure(request.getBloodPressure().trim());
        }
        if (request.getHeartRate() != null) {
            medical.setHeartRate(request.getHeartRate());
        }
        if (request.getTemperature() != null) {
            medical.setTemperature(request.getTemperature());
        }
        if (request.getWeight() != null) {
            medical.setWeight(request.getWeight());
        }
        if (request.getHeight() != null) {
            medical.setHeight(request.getHeight());
        }
        if (request.getSpo2() != null) {
            medical.setSpo2(request.getSpo2());
        }
        if (request.getSymptoms() != null && !request.getSymptoms().trim().isEmpty()) {
            medical.setSymptoms(request.getSymptoms().trim());
        }
        if (request.getIcd10Code() != null) {
            medical.setIcd10Code(request.getIcd10Code().trim().toUpperCase());
        }
        if (request.getDiagnosis() != null && !request.getDiagnosis().trim().isEmpty()) {
            medical.setDiagnosis(request.getDiagnosis().trim());
        }
        if (request.getResults() != null) {
            medical.setResults(request.getResults().trim());
        }
        if (request.getTreatmentPlan() != null) {
            medical.setTreatmentPlan(request.getTreatmentPlan().trim());
        }
        if (request.getFollowUpDate() != null) {
            medical.setFollowUpDate(request.getFollowUpDate());
        }
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            medical.setStatus(MedicalStatus.valueOf(request.getStatus().trim().toUpperCase()));
        }
    }
}
