package com.dms.backend.service;

import com.dms.backend.dto.FolderRequest;
import com.dms.backend.dto.FolderResponse;
import com.dms.backend.entity.Folder;
import com.dms.backend.entity.User;
import com.dms.backend.exception.BadRequestException;
import com.dms.backend.exception.ForbiddenException;
import com.dms.backend.exception.ResourceNotFoundException;
import com.dms.backend.repository.FolderRepository;
import com.dms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public List<FolderResponse> getFolderTree(String email) {
        User user = getUser(email);
        List<Folder> roots = folderRepository.findByCreatedByAndParentIsNull(user);
        return roots.stream().map(this::toResponse).toList();
    }

    public List<FolderResponse> getAllFolders(String email) {
        User user = getUser(email);
        return folderRepository.findByCreatedBy(user).stream().map(f ->
            FolderResponse.builder()
                .id(f.getId())
                .name(f.getName())
                .parentId(f.getParent() != null ? f.getParent().getId() : null)
                .color(f.getColor())
                .createdBy(f.getCreatedBy().getEmail())
                .createdAt(f.getCreatedAt())
                .children(new ArrayList<>())
                .build()
        ).toList();
    }

    public FolderResponse createFolder(FolderRequest request, String email) {
        User user = getUser(email);
        Folder parent = null;
        if (request.getParentId() != null) {
            parent = folderRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
            if (!parent.getCreatedBy().getId().equals(user.getId())) {
                throw new ForbiddenException("You do not own the parent folder");
            }
        }
        if (folderRepository.existsByNameAndParentAndCreatedBy(request.getName(), parent, user)) {
            throw new BadRequestException("A folder with this name already exists here");
        }
        Folder folder = Folder.builder()
                .name(request.getName())
                .parent(parent)
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .color(request.getColor() != null ? request.getColor() : "#6366f1")
                .build();
        return toResponse(folderRepository.save(folder));
    }

    public FolderResponse renameFolder(Long id, FolderRequest request, String email) {
        Folder folder = getWithPermission(id, email);
        folder.setName(request.getName());
        if (request.getColor() != null) folder.setColor(request.getColor());
        return toResponse(folderRepository.save(folder));
    }

    public void deleteFolder(Long id, String email) {
        Folder folder = getWithPermission(id, email);
        folderRepository.delete(folder);
    }

    private Folder getWithPermission(Long id, String email) {
        User user = getUser(email);
        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
        if (!folder.getCreatedBy().getId().equals(user.getId())) {
            throw new ForbiddenException("You do not have permission for this folder");
        }
        return folder;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public FolderResponse toResponse(Folder folder) {
        List<FolderResponse> children = folder.getChildren() != null
                ? folder.getChildren().stream().map(this::toResponse).toList()
                : new ArrayList<>();
        return FolderResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .parentId(folder.getParent() != null ? folder.getParent().getId() : null)
                .color(folder.getColor())
                .createdBy(folder.getCreatedBy().getEmail())
                .createdAt(folder.getCreatedAt())
                .children(children)
                .build();
    }
}
