class Category {
  final int categoryId;
  final String name;
  final int? noteCount;

  Category({
    required this.categoryId,
    required this.name,
    this.noteCount,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      categoryId: json['categoryId'] as int,
      name: json['name'] as String,
      noteCount: json['noteCount'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'categoryId': categoryId,
      'name': name,
      if (noteCount != null) 'noteCount': noteCount,
    };
  }
}
