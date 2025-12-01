import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_models/course_viewmodel.dart';
import '../../view_models/auth_viewmodel.dart';
import '../auth/login_view.dart';
import '../../models/course_model.dart';

class CatalogView extends StatefulWidget {
  const CatalogView({super.key});

  @override
  State<CatalogView> createState() => _CatalogViewState();
}

class _CatalogViewState extends State<CatalogView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CourseViewModel>(context, listen: false).loadCourses();
    });
  }

  @override
  Widget build(BuildContext context) {
    final courseViewModel = Provider.of<CourseViewModel>(context);
    final authViewModel = Provider.of<AuthViewModel>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Catalogue des Cours'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              // TODO: Implémenter la recherche
            },
          ),
          IconButton(
            icon: Icon(Icons.person),
            onPressed: () {
              // TODO: Navigation vers le profil
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Filtres rapides
          Container(
            height: 50,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: ['Tous', 'Développement', 'Design', 'Business']
                  .map((category) => Padding(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: FilterChip(
                  label: Text(category),
                  selected: courseViewModel.selectedCategory == category,
                  onSelected: (selected) {
                    courseViewModel.setSelectedCategory(selected ? category : 'Tous');
                  },
                ),
              )).toList(),
            ),
          ),

          // Résultats
          Expanded(
            child: courseViewModel.loading
                ? Center(child: CircularProgressIndicator())
                : courseViewModel.filteredCourses.isEmpty
                ? _buildEmptyState()
                : _buildCoursesList(courseViewModel),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (!authViewModel.isAuthenticated) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => LoginView()),
            );
          }
        },
        child: Icon(Icons.school),
        backgroundColor: Colors.orange,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, size: 80, color: Colors.grey[300]),
          SizedBox(height: 16),
          Text(
            'Aucun cours trouvé',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[600],
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Essayez de modifier vos critères de recherche',
            style: TextStyle(color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildCoursesList(CourseViewModel courseViewModel) {
    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: courseViewModel.filteredCourses.length,
      itemBuilder: (context, index) {
        final course = courseViewModel.filteredCourses[index];
        return _buildCourseCard(course, courseViewModel);
      },
    );
  }

  Widget _buildCourseCard(CourseModel course, CourseViewModel courseViewModel) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      child: ListTile(
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            course.image,
            width: 60,
            height: 60,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                width: 60,
                height: 60,
                color: Colors.grey[200],
                child: Icon(Icons.school, color: Colors.grey[400]),
              );
            },
          ),
        ),
        title: Text(
          course.title,
          style: TextStyle(fontWeight: FontWeight.bold),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(course.instructor),
            SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.star, size: 16, color: Colors.amber),
                SizedBox(width: 4),
                Text(course.rating.toString()),
                SizedBox(width: 8),
                Icon(Icons.people, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text('${course.students}'),
              ],
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (course.hasPromotion)
              Text(
                '${course.originalPrice?.toStringAsFixed(0)} TND',
                style: TextStyle(
                  decoration: TextDecoration.lineThrough,
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            Text(
              '${course.price.toStringAsFixed(0)} TND',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
          ],
        ),
        onTap: () {
          courseViewModel.selectCourse(course);
          // TODO: Navigation vers les détails du cours
        },
      ),
    );
  }
}