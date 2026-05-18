package com.dms.backend.repository;

import com.dms.backend.entity.Document;
import com.dms.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUploadedBy(User user);

    List<Document> findByFileNameContainingIgnoreCase(String fileName);

    List<Document> findByCategoryIgnoreCase(String category);

    List<Document> findByStatus(com.dms.backend.entity.DocumentStatus status);

    @Query("SELECT d FROM Document d WHERE " +
            "(:fileName IS NULL OR :fileName = '' OR LOWER(d.fileName) LIKE LOWER(CONCAT('%', :fileName, '%'))) AND " +
            "(:category IS NULL OR :category = '' OR LOWER(d.category) = LOWER(:category))")
    List<Document> searchAndFilter(@Param("fileName") String fileName, @Param("category") String category);

    Optional<Document> findByIdAndUploadedBy(Long id, User user);

    long countByStatus(com.dms.backend.entity.DocumentStatus status);

    @Query("select d.category as category, count(d) as count from Document d group by d.category")
    List<Object[]> countByCategory();
}
