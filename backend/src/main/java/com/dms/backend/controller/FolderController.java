package com.dms.backend.controller;

import com.dms.backend.dto.FolderRequest;
import com.dms.backend.dto.FolderResponse;
import com.dms.backend.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @GetMapping
    public ResponseEntity<List<FolderResponse>> getAllFolders(Authentication authentication) {
        return ResponseEntity.ok(folderService.getAllFolders(authentication.getName()));
    }

    @GetMapping("/tree")
    public ResponseEntity<List<FolderResponse>> getFolderTree(Authentication authentication) {
        return ResponseEntity.ok(folderService.getFolderTree(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(
            @RequestBody FolderRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(folderService.createFolder(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> renameFolder(
            @PathVariable Long id,
            @RequestBody FolderRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(folderService.renameFolder(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable Long id,
            Authentication authentication) {
        folderService.deleteFolder(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
