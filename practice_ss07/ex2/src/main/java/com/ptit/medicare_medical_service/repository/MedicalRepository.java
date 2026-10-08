package com.ptit.medicare_medical_service.repository;

import com.ptit.medicare_medical_service.entity.Medical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRepository extends JpaRepository<Medical, Long> {

    boolean existsByRecordCode(String recordCode);

    boolean existsByRecordCodeAndIdNot(String recordCode, Long id);

    boolean existsByAppointmentId(Long appointmentId);

    Optional<Medical> findByIdAndIsDeletedFalse(Long id);

    Optional<Medical> findByRecordCodeAndIsDeletedFalse(String recordCode);

    List<Medical> findAllByIsDeletedFalseOrderByVisitDateDesc();

    List<Medical> findAllByIsDeletedTrueOrderByUpdatedAtDesc();

    List<Medical> findAllByPatientIdAndIsDeletedFalseOrderByVisitDateDesc(Long patientId);

    List<Medical> findAllByDoctorIdAndIsDeletedFalseOrderByVisitDateDesc(Long doctorId);

    List<Medical> findAllByIcd10CodeAndIsDeletedFalse(String icd10Code);
}
