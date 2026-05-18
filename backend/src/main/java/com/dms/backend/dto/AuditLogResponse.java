package com.dms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {
    private Long id;
    private String action;
    private String performedBy;
    private Long documentId;
    private String documentName;
    private String details;
    private LocalDateTime timestamp;
}
