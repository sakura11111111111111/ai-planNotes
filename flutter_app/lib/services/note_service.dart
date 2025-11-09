import '../config/api_config.dart';
import '../models/note.dart';
import 'api_service.dart';

class NoteService {
  // Get all notes or by category
  static Future<List<Note>> getNotes({int? categoryId}) async {
    final response = await ApiService.get<List<dynamic>>(
      ApiConfig.notes,
      queryParameters: categoryId != null ? {'categoryId': categoryId} : null,
      fromJson: (data) => data as List<dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return response.data!
        .map((json) => Note.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  // Get note by ID
  static Future<Note> getNoteById(int id) async {
    final response = await ApiService.get<Map<String, dynamic>>(
      '${ApiConfig.notes}/$id',
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return Note.fromJson(response.data!);
  }

  // Create note
  static Future<Note> createNote(NoteCreateRequest request) async {
    final response = await ApiService.post<Map<String, dynamic>>(
      ApiConfig.notes,
      data: request.toJson(),
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return Note.fromJson(response.data!);
  }

  // Update note
  static Future<Note> updateNote(int id, NoteCreateRequest request) async {
    final response = await ApiService.put<Map<String, dynamic>>(
      '${ApiConfig.notes}/$id',
      data: request.toJson(),
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return Note.fromJson(response.data!);
  }

  // Delete note
  static Future<void> deleteNote(int id) async {
    final response = await ApiService.delete(
      '${ApiConfig.notes}/$id',
    );

    if (!response.isSuccess) {
      throw Exception(response.message);
    }
  }
}
