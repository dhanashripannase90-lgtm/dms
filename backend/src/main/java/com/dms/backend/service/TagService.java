package com.dms.backend.service;

import com.dms.backend.dto.TagRequest;
import com.dms.backend.dto.TagResponse;
import com.dms.backend.entity.Tag;
import com.dms.backend.exception.BadRequestException;
import com.dms.backend.exception.ResourceNotFoundException;
import com.dms.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream().map(this::toResponse).toList();
    }

    public TagResponse createTag(TagRequest request) {
        if (tagRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Tag '" + request.getName() + "' already exists");
        }
        Tag tag = Tag.builder()
                .name(request.getName().trim())
                .color(request.getColor() != null ? request.getColor() : "#6366f1")
                .build();
        return toResponse(tagRepository.save(tag));
    }

    public Tag getById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found: " + id));
    }

    public void deleteTag(Long id) {
        Tag tag = getById(id);
        tagRepository.delete(tag);
    }

    public TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .color(tag.getColor())
                .build();
    }
}
