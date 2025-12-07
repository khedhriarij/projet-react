class CourseModel {
  final String id;
  final String title;
  final String description;
  final double price;
  final double? originalPrice; // Ajouté
  final String category;
  final String image;
  final String instructor;
  final double rating;
  final int students;
  final String duration;
  final String level;
  final int? discountPercentage; // Ajouté

  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    this.originalPrice, // Ajouté au constructeur
    required this.category,
    required this.image,
    required this.instructor,
    required this.rating,
    required this.students,
    required this.duration,
    required this.level,
    this.discountPercentage, // Ajouté au constructeur
  });
}
