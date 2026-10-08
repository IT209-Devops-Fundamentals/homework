package com.ptit.medicare_medical_service.service.impl;

import com.ptit.medicare_medical_service.dto.request.MedicalCreateRequest;
import com.ptit.medicare_medical_service.dto.request.MedicalUpdateRequest;
import com.ptit.medicare_medical_service.dto.response.MedicalResponse;
import com.ptit.medicare_medical_service.entity.Medical;
import com.ptit.medicare_medical_service.exception.DuplicateRecordCodeException;
import com.ptit.medicare_medical_service.exception.DuplicateResourceException;
import com.ptit.medicare_medical_service.exception.MedicalNotFoundException;
import com.ptit.medicare_medical_service.mapper.MedicalMapper;
import com.ptit.medicare_medical_service.repository.MedicalRepository;
import com.ptit.medicare_medical_service.service.MedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalServiceImpl implements MedicalService {

    private final MedicalRepository medicalRepository;
    private final MedicalMapper medicalMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MedicalResponse> getAllMedicals() {
        return medicalRepository.findAllByIsDeletedFalseOrderByVisitDateDesc()
                .stream()
                .map(medicalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalResponse getMedicalById(Long id) {
        Medical medical = medicalRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new MedicalNotFoundException(id));
        return medicalMapper.toResponse(medical);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalResponse getMedicalByRecordCode(String recordCode) {
        Medical medical = medicalRepository.findByRecordCodeAndIsDeletedFalse(recordCode)
                .orElseThrow(() -> new MedicalNotFoundException("Không tìm thấy hồ sơ bệnh án với mã: " + recordCode));
        return medicalMapper.toResponse(medical);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalResponse> getMedicalsByPatientId(Long patientId) {
        return medicalRepository.findAllByPatientIdAndIsDeletedFalseOrderByVisitDateDesc(patientId)
                .stream()
                .map(medicalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalResponse> getMedicalsByDoctorId(Long doctorId) {
        return medicalRepository.findAllByDoctorIdAndIsDeletedFalseOrderByVisitDateDesc(doctorId)
                .stream()
                .map(medicalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalResponse> getDeletedMedicals() {
        return medicalRepository.findAllByIsDeletedTrueOrderByUpdatedAtDesc()
                .stream()
                .map(medicalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MedicalResponse createMedical(MedicalCreateRequest request) {
        // Tự động sinh mã hồ sơ bệnh án nếu không truyền
        String recordCode = request.getRecordCode();
        if (recordCode == null || recordCode.trim().isEmpty()) {
            recordCode = generateUniqueRecordCode();
            request.setRecordCode(recordCode);
        } else {
            recordCode = recordCode.trim();
            if (medicalRepository.existsByRecordCode(recordCode)) {
                throw new DuplicateRecordCodeException(recordCode);
            }
        }

        // Kiểm tra tính duy nhất của appointmentId nếu có
        if (request.getAppointmentId() != null && medicalRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new DuplicateResourceException("Lịch hẹn với ID " + request.getAppointmentId() + " đã có hồ sơ bệnh án");
        }

        Medical medical = medicalMapper.toEntity(request);
        Medical savedMedical = medicalRepository.save(medical);
        return medicalMapper.toResponse(savedMedical);
    }

    @Override
    @Transactional
    public MedicalResponse updateMedical(Long id, MedicalUpdateRequest request) {
        Medical medical = medicalRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new MedicalNotFoundException(id));

        // Kiểm tra tính duy nhất của appointmentId nếu có thay đổi
        if (request.getAppointmentId() != null
                && !request.getAppointmentId().equals(medical.getAppointmentId())
                && medicalRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new DuplicateResourceException("Lịch hẹn với ID " + request.getAppointmentId() + " đã có hồ sơ bệnh án");
        }

        medicalMapper.updateEntity(medical, request);
        Medical updatedMedical = medicalRepository.save(medical);
        return medicalMapper.toResponse(updatedMedical);
    }

    @Override
    @Transactional
    public void deleteMedical(Long id) {
        Medical medical = medicalRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new MedicalNotFoundException(id));
        medical.setIsDeleted(true);
        medicalRepository.save(medical);
    }

    @Override
    @Transactional
    public MedicalResponse restoreMedical(Long id) {
        Medical medical = medicalRepository.findById(id)
                .orElseThrow(() -> new MedicalNotFoundException(id));

        if (Boolean.FALSE.equals(medical.getIsDeleted())) {
            throw new IllegalArgumentException("Hồ sơ bệnh án này đang hoạt động, không cần khôi phục");
        }

        medical.setIsDeleted(false);
        Medical restoredMedical = medicalRepository.save(medical);
        return medicalMapper.toResponse(restoredMedical);
    }

    private String generateUniqueRecordCode() {
        String datePrefix = "MED" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String code;
        do {
            int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
            code = datePrefix + randomNum;
        } while (medicalRepository.existsByRecordCode(code));
        return code;
    }
}
