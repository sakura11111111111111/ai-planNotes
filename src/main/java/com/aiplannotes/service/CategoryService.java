package com.aiplannotes.service;

import com.aiplannotes.dto.CategoryResponse;
import com.aiplannotes.dto.CreateCategoryRequest;
import com.aiplannotes.dto.UpdateCategoryRequest;
import com.aiplannotes.entity.Category;
import com.aiplannotes.entity.User;
import com.aiplannotes.exception.BusinessException;
import com.aiplannotes.repository.CategoryRepository;
import com.aiplannotes.repository.NoteRepository;
import com.aiplannotes.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        // Check if category name already exists for this user
        if (categoryRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new BusinessException(409, "Conflict: Category name already exists.");
        }
        
        User user = new User();
        user.setId(userId);
        
        Category category = new Category();
        category.setUser(user);
        category.setName(request.getName());
        
        Category savedCategory = categoryRepository.save(category);
        
        return new CategoryResponse(
                savedCategory.getId(),
                savedCategory.getName(),
                savedCategory.getCreatedAt()
        );
    }
    
    public List<CategoryResponse> getAllCategories() {
        Long userId = SecurityUtils.getCurrentUserId();
        
        List<Category> categories = categoryRepository.findByUserId(userId);
        
        return categories.stream()
                .map(cat -> new CategoryResponse(cat.getId(), cat.getName(), cat.getCreatedAt()))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(404, "Category not found"));
        
        category.setName(request.getName());
        Category updatedCategory = categoryRepository.save(category);
        
        return new CategoryResponse(
                updatedCategory.getId(),
                updatedCategory.getName(),
                updatedCategory.getCreatedAt()
        );
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(404, "Category not found"));
        
        // Check if category has notes
        if (noteRepository.existsByCategoryId(id)) {
            throw new BusinessException(409, "Conflict: Cannot delete category because it contains notes.");
        }
        
        categoryRepository.delete(category);
    }
}
