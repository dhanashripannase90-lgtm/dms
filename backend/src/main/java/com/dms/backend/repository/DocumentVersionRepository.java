package com.dms.backend.repository;

import com.dms.backend.entity.Document;
import com.dms.backend.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    List<DocumentVersion> findByDocumentOrderByVersionNumberDesc(Document document);
    int countByDocument(Document document);
}
