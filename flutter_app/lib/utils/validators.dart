class Validators {
  // Username validation: 3-50 characters
  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return '用户名不能为空';
    }
    if (value.length < 3) {
      return '用户名至少需要3个字符';
    }
    if (value.length > 50) {
      return '用户名不能超过50个字符';
    }
    return null;
  }

  // Email validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return '邮箱不能为空';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return '请输入有效的邮箱地址';
    }
    return null;
  }

  // Password validation: at least 8 characters, contains letters and numbers
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return '密码不能为空';
    }
    if (value.length < 8) {
      return '密码至少需要8个字符';
    }
    if (!RegExp(r'[a-zA-Z]').hasMatch(value)) {
      return '密码必须包含字母';
    }
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return '密码必须包含数字';
    }
    return null;
  }

  // Confirm password validation
  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return '请确认密码';
    }
    if (value != password) {
      return '两次输入的密码不一致';
    }
    return null;
  }

  // Title validation
  static String? validateTitle(String? value) {
    if (value == null || value.isEmpty) {
      return '标题不能为空';
    }
    if (value.length > 200) {
      return '标题不能超过200个字符';
    }
    return null;
  }

  // Content validation
  static String? validateContent(String? value) {
    if (value == null || value.isEmpty) {
      return '内容不能为空';
    }
    return null;
  }

  // Category name validation
  static String? validateCategoryName(String? value) {
    if (value == null || value.isEmpty) {
      return '分类名称不能为空';
    }
    if (value.length > 50) {
      return '分类名称不能超过50个字符';
    }
    return null;
  }

  // Supervision duration validation
  static String? validateSupervisionDuration(String? value) {
    if (value == null || value.isEmpty) {
      return '监督时长不能为空';
    }
    final duration = int.tryParse(value);
    if (duration == null) {
      return '请输入有效的数字';
    }
    if (duration < 1) {
      return '监督时长至少为1秒';
    }
    if (duration > 300) {
      return '监督时长不能超过300秒';
    }
    return null;
  }
}
