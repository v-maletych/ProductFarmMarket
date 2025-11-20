package com.productfarmmarket.controller;

import com.productfarmmarket.model.Category;
import com.productfarmmarket.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // Отримання всіх категорій - ДОСТУПНО УСІМ (Публічні дані)
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Додавання нової категорії - ТІЛЬКИ ADMIN
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    // Отримання категорії за ID - ДОСТУПНО УСІМ
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    // Оновлення категорії - ТІЛЬКИ ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
        Category existingCategory = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        existingCategory.setName(category.getName());
        return categoryRepository.save(existingCategory);
    }

    // Видалення категорії - ТІЛЬКИ ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }
}