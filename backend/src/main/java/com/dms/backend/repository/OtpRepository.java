package com.dms.backend.repository;

import com.dms.backend.entity.Otp;
import com.dms.backend.entity.OtpPurpose;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmailAndPurpose(String email, OtpPurpose purpose);
    void deleteByEmailAndPurpose(String email, OtpPurpose purpose);
}
