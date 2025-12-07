class QuizModel {
  final String id;
  final String courseId;
  final String title;
  final List<QuestionModel> questions;
  final int passingScore;

  QuizModel({
    required this.id,
    required this.courseId,
    required this.title,
    required this.questions,
    this.passingScore = 70,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'courseId': courseId,
      'title': title,
      'questions': questions.map((q) => q.toMap()).toList(),
      'passingScore': passingScore,
    };
  }

  factory QuizModel.fromMap(Map<String, dynamic> map, String id) {
    return QuizModel(
      id: id,
      courseId: map['courseId'] ?? '',
      title: map['title'] ?? '',
      questions: (map['questions'] as List<dynamic>?)
          ?.map((q) => QuestionModel.fromMap(q))
          .toList() ?? [],
      passingScore: map['passingScore'] ?? 70,
    );
  }
}

class QuestionModel {
  final String questionText;
  final List<String> options;
  final int correctOptionIndex;

  QuestionModel({
    required this.questionText,
    required this.options,
    required this.correctOptionIndex,
  });

  Map<String, dynamic> toMap() {
    return {
      'questionText': questionText,
      'options': options,
      'correctOptionIndex': correctOptionIndex,
    };
  }

  factory QuestionModel.fromMap(Map<String, dynamic> map) {
    return QuestionModel(
      questionText: map['questionText'] ?? '',
      options: List<String>.from(map['options'] ?? []),
      correctOptionIndex: map['correctOptionIndex'] ?? 0,
    );
  }
}
