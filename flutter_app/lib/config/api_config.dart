class ApiConfig {
  // Development environment - Use 10.0.2.2 for Android emulator to access localhost
  // For physical device, use your computer's IP address (e.g., 192.168.1.100)
  static const String baseUrl = 'http://10.0.2.2:8080/api';
  
  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 10);
  
  // API Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String categories = '/categories';
  static const String notes = '/notes';
  static const String tasks = '/tasks';
  static const String todayTasks = '/tasks/today';
  static const String reviewSubmit = '/reviews/submit';
}
