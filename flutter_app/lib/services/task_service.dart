import '../config/api_config.dart';
import '../models/task.dart';
import 'api_service.dart';

class TaskService {
  // Get today's tasks
  static Future<List<Task>> getTodayTasks() async {
    final response = await ApiService.get<List<dynamic>>(
      ApiConfig.todayTasks,
      fromJson: (data) => data as List<dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return response.data!
        .map((json) => Task.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  // Submit review result
  static Future<ReviewSubmitResponse> submitReview(
    ReviewSubmitRequest request,
  ) async {
    final response = await ApiService.post<Map<String, dynamic>>(
      ApiConfig.reviewSubmit,
      data: request.toJson(),
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw Exception(response.message);
    }

    return ReviewSubmitResponse.fromJson(response.data!);
  }
}
