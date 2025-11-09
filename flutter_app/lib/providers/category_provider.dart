import 'package:flutter/foundation.dart';
import '../models/category.dart';
import '../services/category_service.dart';

class CategoryProvider extends ChangeNotifier {
  List<Category> _categories = [];
  bool _isLoading = false;
  String? _error;

  List<Category> get categories => _categories;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load categories
  Future<void> loadCategories() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _categories = await CategoryService.getCategories();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create category
  Future<bool> createCategory(String name) async {
    _error = null;
    try {
      final category = await CategoryService.createCategory(name);
      _categories.add(category);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Update category
  Future<bool> updateCategory(int id, String name) async {
    _error = null;
    try {
      final updatedCategory = await CategoryService.updateCategory(id, name);
      final index = _categories.indexWhere((c) => c.categoryId == id);
      if (index != -1) {
        _categories[index] = updatedCategory;
        notifyListeners();
      }
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Delete category
  Future<bool> deleteCategory(int id) async {
    _error = null;
    try {
      await CategoryService.deleteCategory(id);
      _categories.removeWhere((c) => c.categoryId == id);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
