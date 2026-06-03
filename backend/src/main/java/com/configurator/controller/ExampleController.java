package com.configurator.controller;

import com.configurator.dto.ExampleDto;
import com.configurator.service.ExampleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ExampleController {

    private final ExampleService exampleService;

    @GetMapping
    public ResponseEntity<ExampleDto.ItemListResponse> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ExampleDto.ItemListResponse response = exampleService.getAllItems(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExampleDto.ItemResponse> getItemById(@PathVariable UUID id) {
        ExampleDto.ItemResponse response = exampleService.getItemById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ExampleDto.ItemResponse> createItem(
            @Valid @RequestBody ExampleDto.CreateItemRequest request,
            Authentication authentication) {
        ExampleDto.ItemResponse response = exampleService.createItem(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExampleDto.ItemResponse> updateItem(
            @PathVariable UUID id,
            @Valid @RequestBody ExampleDto.UpdateItemRequest request,
            Authentication authentication) {
        ExampleDto.ItemResponse response = exampleService.updateItem(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id, Authentication authentication) {
        exampleService.deleteItem(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}