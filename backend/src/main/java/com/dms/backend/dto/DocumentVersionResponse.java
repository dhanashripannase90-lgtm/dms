package com.dms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DocumentVersionResponse {
    private Long id;
    private Integer versionNumber;
    private String fileName;
    private String fileType;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
}
