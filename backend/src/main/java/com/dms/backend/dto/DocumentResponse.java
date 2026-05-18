package com.dms.backend.dto;

import com.dms.backend.entity.DocumentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private String category;
    private String description;
    private String uploadedBy;
    private String uploadedByName;
    private LocalDateTime uploadDate;
    private DocumentStatus status;
    private Long folderId;
    private String folderName;
    private String approvedBy;
    private LocalDateTime approvedAt;
    private List<TagResponse> tags;
}
