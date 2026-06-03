package com.configurator.service;

import com.configurator.dto.ExampleDto;
import com.configurator.exception.ResourceNotFoundException;
import com.configurator.model.Item;
import com.configurator.model.Tag;
import com.configurator.model.User;
import com.configurator.repository.ItemRepository;
import com.configurator.repository.TagRepository;
import com.configurator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExampleService {

    private final ItemRepository itemRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public ExampleDto.ItemListResponse getAllItems(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Item> itemPage = itemRepository.findAll(pageRequest);

        List<ExampleDto.ItemResponse> items = itemPage.getContent().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());

        return ExampleDto.ItemListResponse.builder()
                .items(items)
                .totalItems((int) itemPage.getTotalElements())
                .totalPages(itemPage.getTotalPages())
                .currentPage(page)
                .build();
    }

    public ExampleDto.ItemResponse getItemById(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return mapItemToResponse(item);
    }

    @Transactional
    public ExampleDto.ItemResponse createItem(ExampleDto.CreateItemRequest request, String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<Tag> tags = resolveTags(request.getTags());

        Item item = Item.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(owner)
                .tags(tags)
                .build();

        Item saved = itemRepository.save(item);
        return mapItemToResponse(saved);
    }

    @Transactional
    public ExampleDto.ItemResponse updateItem(UUID id, ExampleDto.UpdateItemRequest request, String userEmail) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (!item.getOwner().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only update your own items");
        }

        if (request.getTitle() != null) {
            item.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getTags() != null) {
            item.setTags(resolveTags(request.getTags()));
        }

        Item saved = itemRepository.save(item);
        return mapItemToResponse(saved);
    }

    @Transactional
    public void deleteItem(UUID id, String userEmail) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (!item.getOwner().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only delete your own items");
        }

        itemRepository.delete(item);
    }

    private Set<Tag> resolveTags(Set<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }
        return tagNames.stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build())))
                .collect(Collectors.toSet());
    }

    private ExampleDto.ItemResponse mapItemToResponse(Item item) {
        Set<String> tagNames = item.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        return ExampleDto.ItemResponse.builder()
                .id(item.getId().toString())
                .title(item.getTitle())
                .description(item.getDescription())
                .ownerId(item.getOwner().getId().toString())
                .tags(tagNames)
                .createdAt(item.getCreatedAt().toString())
                .updatedAt(item.getUpdatedAt().toString())
                .build();
    }
}