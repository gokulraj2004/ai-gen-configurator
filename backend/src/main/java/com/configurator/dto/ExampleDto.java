package com.configurator.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;
import java.util.Set;

public class ExampleDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateItemRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        private Set<String> tags;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateItemRequest {
        private String title;
        private String description;
        private Set<String> tags;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemResponse {
        private String id;
        private String title;
        private String description;
        private String ownerId;
        private Set<String> tags;
        private String createdAt;
        private String updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemListResponse {
        private List<ItemResponse> items;
        private int totalItems;
        private int totalPages;
        private int currentPage;
    }
}