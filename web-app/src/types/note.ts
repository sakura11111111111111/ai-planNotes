// AI 总结
export interface AiSummary {
  summaryText: string;
  createdAt: string;
  modelUsed?: string;
}

// 复习记录（当前）
export interface CurrentReviewRecord {
  stageNumber: number;
  scheduledFor: string;
}

// 笔记
export interface Note {
  id: number;
  title: string;
  content: string;
  categoryId?: number | null;
  categoryName?: string;
  isSupervised: boolean;
  supervisionDurationSeconds?: number;
  aiSummary?: AiSummary | null;
  aiSummaryPreview?: string | null;
  currentReviewRecord?: CurrentReviewRecord | null;
  createdAt: string;
  updatedAt?: string;
}

// 笔记列表项（简化版）
export interface NoteListItem {
  id: number;
  title: string;
  isSupervised: boolean;
  aiSummaryPreview?: string | null;
  createdAt: string;
}

// 创建笔记请求
export interface CreateNoteRequest {
  title: string;
  content: string;
  categoryId?: number | null;
  isSupervised: boolean;
  supervisionDurationSeconds?: number;
}

// 更新笔记请求
export interface UpdateNoteRequest {
  title: string;
  content: string;
  categoryId?: number | null;
  isSupervised: boolean;
  supervisionDurationSeconds?: number;
}

// AI 总结请求
export interface SummarizeRequest {
  noteId: number;
}
