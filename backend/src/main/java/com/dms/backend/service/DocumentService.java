package com.dms.backend.service;

import com.dms.backend.dto.DocumentResponse;
import com.dms.backend.dto.DocumentUpdateRequest;
import com.dms.backend.dto.DocumentVersionResponse;
import com.dms.backend.dto.TagResponse;
import com.dms.backend.entity.*;
import com.dms.backend.exception.BadRequestException;
import com.dms.backend.exception.ForbiddenException;
import com.dms.backend.exception.ResourceNotFoundException;
import com.dms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class DocumentService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation");

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;
    private final TagRepository tagRepository;
    private final DocumentVersionRepository versionRepository;
    private final AuditLogService auditLogService;

    public DocumentResponse upload(MultipartFile file, String category, String description,
                                    String currentEmail, Long folderId) {
        validateFile(file);
        User user = getUserByEmail(currentEmail);

        String storedPath = saveFile(file);

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId).orElse(null);
        }

        // Admins auto-approve; Users submit as PENDING
        DocumentStatus status = user.getRole() == Role.ADMIN
                ? DocumentStatus.APPROVED : DocumentStatus.PENDING;

        Document document = Document.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .category(category)
                .description(description)
                .filePath(storedPath)
                .uploadedBy(user)
                .uploadDate(LocalDateTime.now())
                .status(status)
                .folder(folder)
                .build();

        Document saved = documentRepository.save(document);

        auditLogService.log("UPLOAD", currentEmail, saved.getId(), saved.getFileName(),
                "Uploaded to category: " + category + " | Status: " + status);

        return toResponse(saved);
    }

    public List<DocumentResponse> getAllDocuments(String currentEmail) {
        User user = getUserByEmail(currentEmail);
        if (user.getRole() == Role.ADMIN) {
            return documentRepository.findAll().stream().map(this::toResponse).toList();
        }
        // Non-admins see APPROVED documents OR their own
        return documentRepository.findAll().stream()
                .filter(d -> d.getStatus() == DocumentStatus.APPROVED || d.getUploadedBy().getId().equals(user.getId()))
                .map(this::toResponse).toList();
    }

    public List<DocumentResponse> getDocumentsByUser(String email) {
        User user = getUserByEmail(email);
        return documentRepository.findByUploadedBy(user).stream().map(this::toResponse).toList();
    }

    public List<DocumentResponse> searchByFileName(String fileName, String currentEmail) {
        User user = getUserByEmail(currentEmail);
        List<Document> docs = documentRepository.findByFileNameContainingIgnoreCase(fileName);
        if (user.getRole() != Role.ADMIN) {
            docs = docs.stream()
                    .filter(d -> d.getStatus() == DocumentStatus.APPROVED || d.getUploadedBy().getId().equals(user.getId()))
                    .toList();
        }
        return docs.stream().map(this::toResponse).toList();
    }

    public List<DocumentResponse> filterByCategory(String category, String currentEmail) {
        User user = getUserByEmail(currentEmail);
        List<Document> docs = documentRepository.findByCategoryIgnoreCase(category);
        if (user.getRole() != Role.ADMIN) {
            docs = docs.stream()
                    .filter(d -> d.getStatus() == DocumentStatus.APPROVED || d.getUploadedBy().getId().equals(user.getId()))
                    .toList();
        }
        return docs.stream().map(this::toResponse).toList();
    }

    public List<DocumentResponse> searchAndFilter(String fileName, String category, String currentEmail) {
        User user = getUserByEmail(currentEmail);
        List<Document> docs = documentRepository.searchAndFilter(fileName, category);
        if (user.getRole() != Role.ADMIN) {
            docs = docs.stream()
                    .filter(d -> d.getStatus() == DocumentStatus.APPROVED || d.getUploadedBy().getId().equals(user.getId()))
                    .toList();
        }
        return docs.stream().map(this::toResponse).toList();
    }

    public List<DocumentResponse> getPendingDocuments() {
        return documentRepository.findByStatus(DocumentStatus.PENDING).stream().map(this::toResponse).toList();
    }

    public DocumentResponse approveDocument(Long id, String adminEmail) {
        User admin = getUserByEmail(adminEmail);
        Document document = getDocumentById(id);
        document.setStatus(DocumentStatus.APPROVED);
        document.setApprovedBy(admin);
        document.setApprovedAt(LocalDateTime.now());
        Document saved = documentRepository.save(document);
        auditLogService.log("APPROVE", adminEmail, id, document.getFileName(),
                "Document approved by " + adminEmail);
        return toResponse(saved);
    }

    public DocumentResponse rejectDocument(Long id, String adminEmail, String remarks) {
        Document document = getDocumentById(id);
        document.setStatus(DocumentStatus.REJECTED);
        Document saved = documentRepository.save(document);
        auditLogService.log("REJECT", adminEmail, id, document.getFileName(),
                "Rejected. Remarks: " + (remarks != null ? remarks : "none"));
        return toResponse(saved);
    }

    public DocumentResponse updateDocument(Long id, DocumentUpdateRequest request, String currentEmail) {
        Document document = getDocumentWithPermission(id, currentEmail, true);
        document.setCategory(request.getCategory());
        document.setDescription(request.getDescription());
        Document saved = documentRepository.save(document);
        auditLogService.log("UPDATE", currentEmail, id, document.getFileName(),
                "Updated category to: " + request.getCategory());
        return toResponse(saved);
    }

    public DocumentResponse replaceFile(Long id, MultipartFile file, String currentEmail) {
        validateFile(file);
        Document document = getDocumentWithPermission(id, currentEmail, true);

        // Save the current version before replacing
        int nextVersion = versionRepository.countByDocument(document) + 1;
        DocumentVersion version = DocumentVersion.builder()
                .document(document)
                .versionNumber(nextVersion)
                .filePath(document.getFilePath())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .uploadedBy(getUserByEmail(currentEmail))
                .uploadedAt(LocalDateTime.now())
                .build();
        versionRepository.save(version);

        // Replace with new file
        deleteFileQuietly(document.getFilePath());
        String storedPath = saveFile(file);

        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFilePath(storedPath);
        document.setUploadDate(LocalDateTime.now());
        // Reset to PENDING unless admin
        User user = getUserByEmail(currentEmail);
        if (user.getRole() != Role.ADMIN) {
            document.setStatus(DocumentStatus.PENDING);
        }

        Document saved = documentRepository.save(document);
        auditLogService.log("REPLACE_VERSION", currentEmail, id, document.getFileName(),
                "Replaced file. Saved as version " + nextVersion);
        return toResponse(saved);
    }

    public List<DocumentVersionResponse> getVersionHistory(Long id, String currentEmail) {
        Document document = getDocumentWithPermission(id, currentEmail, false);
        return versionRepository.findByDocumentOrderByVersionNumberDesc(document)
                .stream().map(v -> DocumentVersionResponse.builder()
                        .id(v.getId())
                        .versionNumber(v.getVersionNumber())
                        .fileName(v.getFileName())
                        .fileType(v.getFileType())
                        .uploadedBy(v.getUploadedBy().getEmail())
                        .uploadedAt(v.getUploadedAt())
                        .build())
                .toList();
    }

    public DocumentResponse addTag(Long documentId, Long tagId, String currentEmail) {
        Document document = getDocumentWithPermission(documentId, currentEmail, true);
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        document.getTags().add(tag);
        return toResponse(documentRepository.save(document));
    }

    public DocumentResponse removeTag(Long documentId, Long tagId, String currentEmail) {
        Document document = getDocumentWithPermission(documentId, currentEmail, true);
        document.getTags().removeIf(t -> t.getId().equals(tagId));
        return toResponse(documentRepository.save(document));
    }

    public void deleteDocument(Long id, String currentEmail) {
        Document document = getDocumentWithPermission(id, currentEmail, false);
        String name = document.getFileName();
        deleteFileQuietly(document.getFilePath());
        documentRepository.delete(document);
        auditLogService.log("DELETE", currentEmail, id, name, "Document deleted");
    }

    public Resource downloadDocument(Long id, String currentEmail) {
        Document document = getDocumentWithPermission(id, currentEmail, false);
        try {
            Path path = Paths.get(document.getFilePath()).toAbsolutePath().normalize();
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) {
                throw new ResourceNotFoundException("File not found on disk");
            }
            auditLogService.log("DOWNLOAD", currentEmail, id, document.getFileName(), "File downloaded");
            return resource;
        } catch (IOException ex) {
            throw new BadRequestException("Could not load file");
        }
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private Document getDocumentWithPermission(Long id, String currentEmail, boolean editAccessRequired) {
        User currentUser = getUserByEmail(currentEmail);
        Document document = getDocumentById(id);

        if (currentUser.getRole() == Role.ADMIN) {
            return document;
        }

        boolean isOwner = document.getUploadedBy().getId().equals(currentUser.getId());

        if (editAccessRequired) {
            if (!isOwner) {
                throw new ForbiddenException("You do not have permission to modify this document");
            }
        } else {
            // For viewing/downloading/history
            if (!isOwner && document.getStatus() != DocumentStatus.APPROVED) {
                throw new ForbiddenException("This document is not yet approved or you do not have permission");
            }
        }

        return document;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Invalid file type. Allowed: PDF, DOCX, XLSX, PPTX, JPG, PNG");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds 10MB");
        }
    }

    private String saveFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
            String filename = UUID.randomUUID() + "_" + originalName.replaceAll("\\s+", "_");
            Path targetPath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return targetPath.toString();
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file");
        }
    }

    private void deleteFileQuietly(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException ignored) {
        }
    }

    public DocumentResponse toResponse(Document document) {
        List<TagResponse> tags = document.getTags() != null
                ? document.getTags().stream()
                    .map(t -> TagResponse.builder().id(t.getId()).name(t.getName()).color(t.getColor()).build())
                    .toList()
                : List.of();
        return DocumentResponse.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .category(document.getCategory())
                .description(document.getDescription())
                .uploadedBy(document.getUploadedBy().getEmail())
                .uploadedByName(document.getUploadedBy().getName())
                .uploadDate(document.getUploadDate())
                .status(document.getStatus())
                .folderId(document.getFolder() != null ? document.getFolder().getId() : null)
                .folderName(document.getFolder() != null ? document.getFolder().getName() : null)
                .approvedBy(document.getApprovedBy() != null ? document.getApprovedBy().getEmail() : null)
                .approvedAt(document.getApprovedAt())
                .tags(tags)
                .build();
    }
}
