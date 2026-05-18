package com.dms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentUpdateRequest {

    @NotBlank(message = "Category is required")
    private String category;

    private String description;
}
