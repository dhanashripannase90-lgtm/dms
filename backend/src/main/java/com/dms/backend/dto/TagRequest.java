package com.dms.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class TagRequest {
    @NotBlank
    private String name;
    private String color;
}
