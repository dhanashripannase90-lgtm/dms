package com.dms.backend.service;

import com.dms.backend.dto.DashboardResponse;
import com.dms.backend.entity.DocumentStatus;
import com.dms.backend.repository.DocumentRepository;
import com.dms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    public DashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDocuments = documentRepository.count();
        long pendingDocuments = documentRepository.countByStatus(DocumentStatus.PENDING);
        long approvedDocuments = documentRepository.countByStatus(DocumentStatus.APPROVED);
        long rejectedDocuments = documentRepository.countByStatus(DocumentStatus.REJECTED);

        List<Object[]> rows = documentRepository.countByCategory();
        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (Object[] row : rows) {
            byCategory.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalDocuments(totalDocuments)
                .pendingDocuments(pendingDocuments)
                .approvedDocuments(approvedDocuments)
                .rejectedDocuments(rejectedDocuments)
                .documentsByCategory(byCategory)
                .build();
    }
}
