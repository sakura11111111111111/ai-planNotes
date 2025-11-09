import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static SharedPreferences? _prefs;
  
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _usernameKey = 'username';
  static const String _emailKey = 'email';

  // Initialize SharedPreferences
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Token management
  static Future<bool> saveToken(String token) async {
    return await _prefs?.setString(_tokenKey, token) ?? false;
  }

  static String? getToken() {
    return _prefs?.getString(_tokenKey);
  }

  static Future<bool> clearToken() async {
    return await _prefs?.remove(_tokenKey) ?? false;
  }

  // User info management
  static Future<bool> saveUserInfo({
    required int userId,
    required String username,
    required String email,
  }) async {
    final results = await Future.wait([
      _prefs?.setInt(_userIdKey, userId) ?? Future.value(false),
      _prefs?.setString(_usernameKey, username) ?? Future.value(false),
      _prefs?.setString(_emailKey, email) ?? Future.value(false),
    ]);
    return results.every((result) => result);
  }

  static int? getUserId() {
    return _prefs?.getInt(_userIdKey);
  }

  static String? getUsername() {
    return _prefs?.getString(_usernameKey);
  }

  static String? getEmail() {
    return _prefs?.getString(_emailKey);
  }

  // Clear all stored data
  static Future<bool> clearAll() async {
    return await _prefs?.clear() ?? false;
  }
}
