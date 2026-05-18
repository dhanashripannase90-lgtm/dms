package com.dms.backend.dto;

import lombok.Data;

@Data
public class FolderRequest {
    private String name;
    private Long parentId;
    private String color;
}
