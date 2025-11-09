// 表单验证工具

/**
 * 验证用户名
 * 规则：3-50个字符，只能包含字母、数字、下划线
 */
export function validateUsername(username: string): string | null {
  if (!username || username.trim() === '') {
    return '用户名不能为空';
  }
  if (username.length < 3) {
    return '用户名至少需要3个字符';
  }
  if (username.length > 50) {
    return '用户名不能超过50个字符';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return '用户名只能包含字母、数字和下划线';
  }
  return null;
}

/**
 * 验证密码
 * 规则：至少6个字符
 */
export function validatePassword(password: string): string | null {
  if (!password || password.trim() === '') {
    return '密码不能为空';
  }
  if (password.length < 6) {
    return '密码至少需要6个字符';
  }
  return null;
}

/**
 * 验证邮箱
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return '邮箱不能为空';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址';
  }
  return null;
}

/**
 * 验证笔记标题
 */
export function validateNoteTitle(title: string): string | null {
  if (!title || title.trim() === '') {
    return '标题不能为空';
  }
  if (title.length > 200) {
    return '标题不能超过200个字符';
  }
  return null;
}

/**
 * 验证笔记内容
 */
export function validateNoteContent(content: string): string | null {
  if (!content || content.trim() === '') {
    return '内容不能为空';
  }
  return null;
}

/**
 * 验证监督时长
 * 规则：10-300秒
 */
export function validateSupervisionDuration(duration: number): string | null {
  if (duration < 10) {
    return '监督时长至少需要10秒';
  }
  if (duration > 300) {
    return '监督时长不能超过300秒';
  }
  return null;
}

/**
 * 验证分类名称
 */
export function validateCategoryName(name: string): string | null {
  if (!name || name.trim() === '') {
    return '分类名称不能为空';
  }
  if (name.length > 50) {
    return '分类名称不能超过50个字符';
  }
  return null;
}
