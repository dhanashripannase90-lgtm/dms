package com.dms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class DashboardResponse {
    private long totalUsers;
    private long totalDocuments;
    private long pendingDocuments;
    private long approvedDocuments;
    private long rejectedDocuments;
    private Map<String, Long> documentsByCategory;
}
