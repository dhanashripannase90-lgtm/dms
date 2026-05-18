package com.dms.backend.service;

import com.dms.backend.dto.AuditLogResponse;
import com.dms.backend.entity.AuditLog;
import com.dms.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String action, String performedBy, Long documentId, String documentName, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .performedBy(performedBy)
                .documentId(documentId)
                .documentName(documentName)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    public Page<AuditLogResponse> getLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size))
                .map(this::toResponse);
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .action(log.getAction())
                .performedBy(log.getPerformedBy())
                .documentId(log.getDocumentId())
                .documentName(log.getDocumentName())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }
}
