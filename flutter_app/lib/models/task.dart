class Task {
  final int noteId;
  final String title;
  final String? categoryName;
  final bool isSupervised;
  final int supervisionDurationSeconds;
  final int currentReviewStage;
  final String? aiSummary;
  final String content;

  Task({
    required this.noteId,
    required this.title,
    this.categoryName,
    required this.isSupervised,
    required this.supervisionDurationSeconds,
    required this.currentReviewStage,
    this.aiSummary,
    required this.content,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      noteId: json['noteId'] as int,
      title: json['title'] as String,
      categoryName: json['categoryName'] as String?,
      isSupervised: json['isSupervised'] as bool,
      supervisionDurationSeconds: json['supervisionDurationSeconds'] as int,
      currentReviewStage: json['currentReviewStage'] as int,
      aiSummary: json['aiSummary'] as String?,
      content: json['content'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'noteId': noteId,
      'title': title,
      if (categoryName != null) 'categoryName': categoryName,
      'isSupervised': isSupervised,
      'supervisionDurationSeconds': supervisionDurationSeconds,
      'currentReviewStage': currentReviewStage,
      if (aiSummary != null) 'aiSummary': aiSummary,
      'content': content,
    };
  }
}

enum ReviewResult {
  remembered('REMEMBERED'),
  fuzzy('FUZZY'),
  forgotten('FORGOTTEN');

  final String value;
  const ReviewResult(this.value);
}

class ReviewSubmitRequest {
  final int noteId;
  final ReviewResult result;
  final int reviewDurationSeconds;

  ReviewSubmitRequest({
    required this.noteId,
    required this.result,
    required this.reviewDurationSeconds,
  });

  Map<String, dynamic> toJson() {
    return {
      'noteId': noteId,
      'result': result.value,
      'reviewDurationSeconds': reviewDurationSeconds,
    };
  }
}

class ReviewSubmitResponse {
  final String nextReviewDate;

  ReviewSubmitResponse({required this.nextReviewDate});

  factory ReviewSubmitResponse.fromJson(Map<String, dynamic> json) {
    return ReviewSubmitResponse(
      nextReviewDate: json['nextReviewDate'] as String,
    );
  }
}
