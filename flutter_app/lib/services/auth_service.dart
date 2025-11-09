import '../config/api_config.dart';
import '../models/api_response.dart';
import '../models/user.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  // User login
  static Future<LoginResponse> login(String username, String password) async {
    final response = await ApiService.post<Map<String, dynamic>>(
      ApiConfig.login,
      data: {
        'username': username,
        'password': password,
      },
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw ApiException(
        code: response.code,
        message: response.message,
      );
    }

    final loginData = LoginResponse.fromJson(response.data!);
    await StorageService.saveToken(loginData.token);
    return loginData;
  }

  // User registration
  static Future<User> register({
    required String username,
    required String password,
    required String email,
  }) async {
    final response = await ApiService.post<Map<String, dynamic>>(
      ApiConfig.register,
      data: {
        'username': username,
        'password': password,
        'email': email,
      },
      fromJson: (data) => data as Map<String, dynamic>,
    );

    if (!response.isSuccess || response.data == null) {
      throw ApiException(
        code: response.code,
        message: response.message,
      );
    }

    final user = User.fromJson(response.data!);
    await StorageService.saveUserInfo(
      userId: user.userId,
      username: user.username,
      email: user.email,
    );
    return user;
  }

  // Logout
  static Future<void> logout() async {
    await StorageService.clearAll();
  }

  // Check if user is authenticated
  static bool isAuthenticated() {
    return StorageService.getToken() != null;
  }
}
