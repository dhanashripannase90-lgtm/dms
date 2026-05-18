package com.dms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FolderResponse {
    private Long id;
    private String name;
    private Long parentId;
    private String color;
    private String createdBy;
    private LocalDateTime createdAt;
    private List<FolderResponse> children;
}
