package com.ptit.medicare_medical_service.controller;

import com.ptit.medicare_medical_service.dto.request.MedicalCreateRequest;
import com.ptit.medicare_medical_service.dto.request.MedicalUpdateRequest;
import com.ptit.medicare_medical_service.dto.response.ApiResponse;
import com.ptit.medicare_medical_service.dto.response.MedicalResponse;
import com.ptit.medicare_medical_service.service.MedicalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/medicals")
public class MedicalController {

    private final MedicalService medicalService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalResponse>>> getAllMedicals() {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách hồ sơ bệnh án thành công", medicalService.getAllMedicals()));
    }

    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse<List<MedicalResponse>>> getDeletedMedicals() {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách hồ sơ bệnh án đã xóa mềm thành công", medicalService.getDeletedMedicals()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalResponse>> getMedicalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết hồ sơ bệnh án thành công", medicalService.getMedicalById(id)));
    }

    @GetMapping("/code/{recordCode}")
    public ResponseEntity<ApiResponse<MedicalResponse>> getMedicalByRecordCode(@PathVariable String recordCode) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết hồ sơ bệnh án theo mã thành công", medicalService.getMedicalByRecordCode(recordCode)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalResponse>>> getMedicalsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy lịch sử khám bệnh của bệnh nhân thành công", medicalService.getMedicalsByPatientId(patientId)));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<MedicalResponse>>> getMedicalsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách bệnh án do bác sĩ phụ trách thành công", medicalService.getMedicalsByDoctorId(doctorId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalResponse>> createMedical(@Valid @RequestBody MedicalCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo mới hồ sơ bệnh án thành công", medicalService.createMedical(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalResponse>> updateMedical(@PathVariable Long id, @Valid @RequestBody MedicalUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ bệnh án thành công", medicalService.updateMedical(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedical(@PathVariable Long id) {
        medicalService.deleteMedical(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa mềm hồ sơ bệnh án thành công"));
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<MedicalResponse>> restoreMedical(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Khôi phục hồ sơ bệnh án thành công", medicalService.restoreMedical(id)));
    }
}
