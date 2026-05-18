package com.dms.backend.controller;

import com.dms.backend.dto.DocumentResponse;
import com.dms.backend.dto.DocumentUpdateRequest;
import com.dms.backend.dto.DocumentVersionResponse;
import com.dms.backend.dto.ApprovalRequest;
import com.dms.backend.entity.Document;
import com.dms.backend.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "folderId", required = false) Long folderId,
            Authentication authentication) {
        return ResponseEntity.ok(
                documentService.upload(file, category, description, authentication.getName(), folderId));
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments(
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) String category,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.searchAndFilter(fileName, category, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DocumentResponse>> getMyDocuments(Authentication authentication) {
        return ResponseEntity.ok(documentService.getDocumentsByUser(authentication.getName()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DocumentResponse>> getPendingDocuments() {
        return ResponseEntity.ok(documentService.getPendingDocuments());
    }

    @GetMapping("/user/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByUser(@PathVariable String email) {
        return ResponseEntity.ok(documentService.getDocumentsByUser(email));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentResponse>> search(@RequestParam String fileName, Authentication authentication) {
        return ResponseEntity.ok(documentService.searchByFileName(fileName, authentication.getName()));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<DocumentResponse>> filterByCategory(@RequestParam String category, Authentication authentication) {
        return ResponseEntity.ok(documentService.filterByCategory(category, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody DocumentUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.updateDocument(id, request, authentication.getName()));
    }

    @PutMapping(value = "/{id}/replace", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> replaceFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.replaceFile(id, file, authentication.getName()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DocumentResponse> approve(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.approveDocument(id, authentication.getName()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DocumentResponse> reject(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalRequest request,
            Authentication authentication) {
        String remarks = request != null ? request.getRemarks() : null;
        return ResponseEntity.ok(documentService.rejectDocument(id, authentication.getName(), remarks));
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<DocumentVersionResponse>> getVersions(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.getVersionHistory(id, authentication.getName()));
    }

    @PostMapping("/{id}/tags/{tagId}")
    public ResponseEntity<DocumentResponse> addTag(
            @PathVariable Long id,
            @PathVariable Long tagId,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.addTag(id, tagId, authentication.getName()));
    }

    @DeleteMapping("/{id}/tags/{tagId}")
    public ResponseEntity<DocumentResponse> removeTag(
            @PathVariable Long id,
            @PathVariable Long tagId,
            Authentication authentication) {
        return ResponseEntity.ok(documentService.removeTag(id, tagId, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        documentService.deleteDocument(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable Long id,
            Authentication authentication) throws IOException {
        Resource resource = documentService.downloadDocument(id, authentication.getName());
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .body(resource);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> preview(
            @PathVariable Long id,
            Authentication authentication) throws IOException {
        Resource resource = documentService.downloadDocument(id, authentication.getName());
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + document.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .body(resource);
    }
}
