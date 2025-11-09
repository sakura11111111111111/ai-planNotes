import 'package:intl/intl.dart';

class DateTimeUtils {
  // Format date to yyyy-MM-dd
  static String formatDate(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  // Format date to yyyy-MM-dd HH:mm:ss
  static String formatDateTime(DateTime date) {
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(date);
  }

  // Format date to relative time (e.g., "今天", "明天", "2天后")
  static String formatRelativeDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      final targetDate = DateTime(date.year, date.month, date.day);
      
      final difference = targetDate.difference(today).inDays;
      
      if (difference == 0) {
        return '今天';
      } else if (difference == 1) {
        return '明天';
      } else if (difference == 2) {
        return '后天';
      } else if (difference > 0) {
        return '$difference天后';
      } else if (difference == -1) {
        return '昨天';
      } else {
        return '${-difference}天前';
      }
    } catch (e) {
      return dateStr;
    }
  }

  // Parse ISO 8601 date string
  static DateTime? parseDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) {
      return null;
    }
    try {
      return DateTime.parse(dateStr);
    } catch (e) {
      return null;
    }
  }

  // Format duration in seconds to human-readable string
  static String formatDuration(int seconds) {
    if (seconds < 60) {
      return '$seconds秒';
    } else if (seconds < 3600) {
      final minutes = seconds ~/ 60;
      final remainingSeconds = seconds % 60;
      return remainingSeconds > 0
          ? '$minutes分$remainingSeconds秒'
          : '$minutes分钟';
    } else {
      final hours = seconds ~/ 3600;
      final minutes = (seconds % 3600) ~/ 60;
      return minutes > 0 ? '$hours小时$minutes分' : '$hours小时';
    }
  }
}
