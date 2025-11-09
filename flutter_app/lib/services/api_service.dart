import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/api_response.dart';
import 'storage_service.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.connectTimeout,
      receiveTimeout: ApiConfig.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  );

  // Add request interceptor to automatically add auth token
  static void init() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = StorageService.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) {
          // Handle 401 Unauthorized - token expired
          if (error.response?.statusCode == 401) {
            // Clear token and user info
            StorageService.clearAll();
          }
          return handler.next(error);
        },
      ),
    );
  }

  // Generic GET request
  static Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
      );
      return ApiResponse<T>.fromJson(response.data, fromJson);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic POST request
  static Future<ApiResponse<T>> post<T>(
    String path, {
    dynamic data,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.post(path, data: data);
      return ApiResponse<T>.fromJson(response.data, fromJson);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic PUT request
  static Future<ApiResponse<T>> put<T>(
    String path, {
    dynamic data,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.put(path, data: data);
      return ApiResponse<T>.fromJson(response.data, fromJson);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Generic DELETE request
  static Future<ApiResponse<T>> delete<T>(
    String path, {
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.delete(path);
      return ApiResponse<T>.fromJson(response.data, fromJson);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Error handling
  static ApiException _handleError(DioException e) {
    if (e.response != null) {
      final data = e.response!.data;
      if (data is Map<String, dynamic>) {
        return ApiException(
          code: data['code'] ?? e.response!.statusCode ?? 0,
          message: data['message'] ?? 'Unknown error',
        );
      }
      return ApiException(
        code: e.response!.statusCode ?? 0,
        message: e.response!.statusMessage ?? 'Unknown error',
      );
    }
    
    // Network error
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return ApiException(code: 0, message: '网络连接超时');
    }
    
    if (e.type == DioExceptionType.connectionError) {
      return ApiException(code: 0, message: '网络连接失败，请检查网络设置');
    }
    
    return ApiException(code: 0, message: '网络请求失败');
  }
}
