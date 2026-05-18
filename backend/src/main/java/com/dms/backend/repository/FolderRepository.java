package com.dms.backend.repository;

import com.dms.backend.entity.Folder;
import com.dms.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByCreatedByAndParentIsNull(User createdBy);
    List<Folder> findByCreatedBy(User createdBy);
    boolean existsByNameAndParentAndCreatedBy(String name, Folder parent, User createdBy);
}
