class Note {
  final int noteId;
  final String title;
  final String content;
  final int? categoryId;
  final String? categoryName;
  final bool isSupervised;
  final int supervisionDurationSeconds;
  final String? aiSummary;
  final int currentReviewStage;
  final String? nextReviewDate;
  final String createdAt;
  final String updatedAt;

  Note({
    required this.noteId,
    required this.title,
    required this.content,
    this.categoryId,
    this.categoryName,
    required this.isSupervised,
    required this.supervisionDurationSeconds,
    this.aiSummary,
    required this.currentReviewStage,
    this.nextReviewDate,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Note.fromJson(Map<String, dynamic> json) {
    return Note(
      noteId: json['noteId'] as int,
      title: json['title'] as String,
      content: json['content'] as String,
      categoryId: json['categoryId'] as int?,
      categoryName: json['categoryName'] as String?,
      isSupervised: json['isSupervised'] as bool,
      supervisionDurationSeconds: json['supervisionDurationSeconds'] as int,
      aiSummary: json['aiSummary'] as String?,
      currentReviewStage: json['currentReviewStage'] as int,
      nextReviewDate: json['nextReviewDate'] as String?,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'noteId': noteId,
      'title': title,
      'content': content,
      if (categoryId != null) 'categoryId': categoryId,
      if (categoryName != null) 'categoryName': categoryName,
      'isSupervised': isSupervised,
      'supervisionDurationSeconds': supervisionDurationSeconds,
      if (aiSummary != null) 'aiSummary': aiSummary,
      'currentReviewStage': currentReviewStage,
      if (nextReviewDate != null) 'nextReviewDate': nextReviewDate,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}

class NoteCreateRequest {
  final String title;
  final String content;
  final int? categoryId;
  final bool isSupervised;
  final int supervisionDurationSeconds;

  NoteCreateRequest({
    required this.title,
    required this.content,
    this.categoryId,
    required this.isSupervised,
    this.supervisionDurationSeconds = 10,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      if (categoryId != null) 'categoryId': categoryId,
      'isSupervised': isSupervised,
      'supervisionDurationSeconds': supervisionDurationSeconds,
    };
  }
}
