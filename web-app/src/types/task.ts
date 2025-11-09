// 今日任务（复习任务）
export interface TodayTask {
  noteId: number;
  title: string;
  categoryName?: string;
  isSupervised: boolean;
  supervisionDurationSeconds?: number;
  currentReviewStage: number;
  aiSummary?: string;
}

// 复习结果
export type ReviewResult = 'REMEMBERED' | 'FUZZY' | 'FORGOTTEN';

// 提交复习请求
export interface SubmitReviewRequest {
  noteId: number;
  result: ReviewResult;
  reviewDurationSeconds: number;
}

// 提交复习响应
export interface SubmitReviewResponse {
  nextReviewDate: string;
}
