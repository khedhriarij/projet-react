class CourseModel {
  final String id;
  final String title;
  final String description;
  final double price;
  final double? originalPrice;
  final String category;
  final String image;
  final String instructor;
  final double rating;
  final int students;
  final String duration;
  final String level;
  final bool featured;
  final int discountPercentage;
  final bool hasPromotion;

  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.category,
    required this.image,
    required this.instructor,
    required this.rating,
    required this.students,
    required this.duration,
    required this.level,
    required this.featured,
    required this.discountPercentage,
    required this.hasPromotion,
  });

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    return CourseModel(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      originalPrice: (json['originalPrice'] as num?)?.toDouble(),
      category: json['category'] ?? '',
      image: json['image'] ?? '',
      instructor: json['instructor'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      students: (json['students'] as num?)?.toInt() ?? 0,
      duration: json['duration'] ?? '',
      level: json['level'] ?? '',
      featured: json['featured'] ?? false,
      discountPercentage: (json['discountPercentage'] as num?)?.toInt() ?? 0,
      hasPromotion: json['hasPromotion'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'price': price,
      'originalPrice': originalPrice,
      'category': category,
      'image': image,
      'instructor': instructor,
      'rating': rating,
      'students': students,
      'duration': duration,
      'level': level,
      'featured': featured,
      'discountPercentage': discountPercentage,
      'hasPromotion': hasPromotion,
    };
  }
}