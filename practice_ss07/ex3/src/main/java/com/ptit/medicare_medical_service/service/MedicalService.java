package com.ptit.medicare_medical_service.service;

import com.ptit.medicare_medical_service.dto.request.MedicalCreateRequest;
import com.ptit.medicare_medical_service.dto.request.MedicalUpdateRequest;
import com.ptit.medicare_medical_service.dto.response.MedicalResponse;

import java.util.List;

public interface MedicalService {

    List<MedicalResponse> getAllMedicals();

    MedicalResponse getMedicalById(Long id);

    MedicalResponse getMedicalByRecordCode(String recordCode);

    List<MedicalResponse> getMedicalsByPatientId(Long patientId);

    List<MedicalResponse> getMedicalsByDoctorId(Long doctorId);

    List<MedicalResponse> getDeletedMedicals();

    MedicalResponse createMedical(MedicalCreateRequest request);

    MedicalResponse updateMedical(Long id, MedicalUpdateRequest request);

    void deleteMedical(Long id);

    MedicalResponse restoreMedical(Long id);
}
