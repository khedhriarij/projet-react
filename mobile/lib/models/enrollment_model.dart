class Enrollment {
  final String id;
  final String userId;
  final String courseId;
  final double progress;
  final DateTime enrolledAt;
  final DateTime? lastAccessed;
  final String nextLesson;
  final bool completed;

  Enrollment({
    required this.id,
    required this.userId,
    required this.courseId,
    required this.progress,
    required this.enrolledAt,
    this.lastAccessed,
    required this.nextLesson,
    this.completed = false,
  });

  factory Enrollment.fromJson(Map<String, dynamic> json) {
    return Enrollment(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      courseId: json['courseId'] ?? '',
      progress: (json['progress'] ?? 0).toDouble(),
      enrolledAt: DateTime.parse(json['enrolledAt'] ?? DateTime.now().toIso8601String()),
      lastAccessed: json['lastAccessed'] != null 
          ? DateTime.parse(json['lastAccessed'])
          : null,
      nextLesson: json['nextLesson'] ?? 'Introduction',
      completed: json['completed'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'courseId': courseId,
      'progress': progress,
      'enrolledAt': enrolledAt.toIso8601String(),
      'lastAccessed': lastAccessed?.toIso8601String(),
      'nextLesson': nextLesson,
      'completed': completed,
    };
  }

  String get timeAgo {
    final now = DateTime.now();
    final difference = now.difference(enrolledAt);

    if (difference.inDays > 30) {
      return 'Il y a ${(difference.inDays / 30).floor()} mois';
    } else if (difference.inDays > 0) {
      return 'Il y a ${difference.inDays} jours';
    } else if (difference.inHours > 0) {
      return 'Il y a ${difference.inHours} heures';
    } else {
      return 'À l\'instant';
    }
  }
}