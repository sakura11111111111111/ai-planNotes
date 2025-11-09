import 'package:flutter/foundation.dart';
import '../models/task.dart';
import '../services/task_service.dart';

class TaskProvider extends ChangeNotifier {
  List<Task> _tasks = [];
  bool _isLoading = false;
  String? _error;

  List<Task> get tasks => _tasks;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasTasks => _tasks.isNotEmpty;

  // Load today's tasks
  Future<void> loadTodayTasks() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _tasks = await TaskService.getTodayTasks();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Submit review
  Future<ReviewSubmitResponse?> submitReview(
    ReviewSubmitRequest request,
  ) async {
    _error = null;
    try {
      final response = await TaskService.submitReview(request);
      
      // Remove the completed task from the list
      _tasks.removeWhere((task) => task.noteId == request.noteId);
      notifyListeners();
      
      return response;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
