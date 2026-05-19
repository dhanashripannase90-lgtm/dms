package com.dms.backend.service;

import com.dms.backend.dto.UpdateProfileRequest;
import com.dms.backend.dto.UpdateRoleRequest;
import com.dms.backend.dto.UserResponse;
import com.dms.backend.entity.User;
import com.dms.backend.exception.ResourceNotFoundException;
import com.dms.backend.repository.UserRepository;
import com.dms.backend.repository.FolderRepository;
import com.dms.backend.repository.DocumentRepository;
import com.dms.backend.repository.DocumentVersionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FolderRepository folderRepository;
    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 1. Nullify approvedBy on documents approved by this user
        List<com.dms.backend.entity.Document> approvedDocs = documentRepository.findByApprovedBy(user);
        for (com.dms.backend.entity.Document doc : approvedDocs) {
            doc.setApprovedBy(null);
            doc.setApprovedAt(null);
            documentRepository.save(doc);
        }

        // 2. Delete all document versions uploaded by this user
        List<com.dms.backend.entity.DocumentVersion> userVersions = versionRepository.findByUploadedBy(user);
        versionRepository.deleteAll(userVersions);

        // 3. Delete all documents uploaded by this user
        List<com.dms.backend.entity.Document> uploadedDocs = documentRepository.findByUploadedBy(user);
        documentRepository.deleteAll(uploadedDocs);

        // 4. Delete all folders created by this user
        List<com.dms.backend.entity.Folder> folders = folderRepository.findByCreatedBy(user);
        folderRepository.deleteAll(folders);

        // 5. Finally delete the user
        userRepository.delete(user);
    }

    public UserResponse updateUserRole(Long id, UpdateRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(request.getRole());
        userRepository.save(user);
        return toResponse(user);
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(request.getName());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
