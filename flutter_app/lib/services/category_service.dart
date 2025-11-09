import '../config/api_config.dart';
import '../models/category.dart';
import 'api_service.dart';

class CategoryService {
  // Get all categories
  static Future<List<Category>> getCategories() async {
    final response = await ApiService.get<List<dynamic>>(
      ApiConfig.categories,
      fromJson: (data) => data as List<dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return response.data!
        .map((json) => Category.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  // Create category
  static Future<Category> createCategory(String name) async {
    final response = await ApiService.post<Map<String, dynamic>>(
      ApiConfig.categories,
      data: {'name': name},
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return Category.fromJson(response.data!);
  }

  // Update category
  static Future<Category> updateCategory(int id, String name) async {
    final response = await ApiService.put<Map<String, dynamic>>(
      '${ApiConfig.categories}/$id',
      data: {'name': name},
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return Category.fromJson(response.data!);
  }

  // Delete category
  static Future<void> deleteCategory(int id) async {
    final response = await ApiService.delete(
      '${ApiConfig.categories}/$id',
    );

    if (!response.isSuccess) {
      throw Exception(response.message);
    }
  }
}
