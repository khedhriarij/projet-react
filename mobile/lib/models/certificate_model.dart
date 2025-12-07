class CertificateModel {
  final String id;
  final String studentId;
  final String studentName;
  final String courseId;
  final String courseTitle;
  final DateTime issueDate;
  final String certificateUrl;

  CertificateModel({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.courseId,
    required this.courseTitle,
    required this.issueDate,
    required this.certificateUrl,
  });

  Map<String, dynamic> toMap() {
    return {
      'studentId': studentId,
      'studentName': studentName,
      'courseId': courseId,
      'courseTitle': courseTitle,
      'issueDate': issueDate.toIso8601String(),
      'certificateUrl': certificateUrl,
    };
  }
}
