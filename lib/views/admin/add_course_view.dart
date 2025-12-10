import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class AddCourseView extends StatefulWidget {
  final Map<String, dynamic>? courseToEdit;

  const AddCourseView({super.key, this.courseToEdit});

  @override
  State<AddCourseView> createState() => _AddCourseViewState();
}

class _AddCourseViewState extends State<AddCourseView> {
  final _formKey = GlobalKey<FormState>();

  // Contrôleurs
  late TextEditingController _titleController;
  late TextEditingController _instructorController;
  late TextEditingController _priceController;
  late TextEditingController _oldPriceController;
  late TextEditingController _imageController;
  late TextEditingController _durationController;
  late TextEditingController _descriptionController;

  String _selectedCategory = "Développement";
  String _selectedLevel = "Débutant";
  bool _isLoading = false;

  final List<String> _categories = [
    "Développement",
    "Design",
    "Business",
    "Marketing",
    "IT & Logiciels"
  ];

  final List<String> _levels = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];

  @override
  void initState() {
    super.initState();
    // Initialisation des contrôleurs avec les données existantes si on est en mode modification
    final c = widget.courseToEdit;
    _titleController = TextEditingController(text: c?['title'] ?? "");
    _instructorController = TextEditingController(text: c?['instructor'] ?? "");
    _priceController = TextEditingController(text: c?['price']?.toString() ?? "");
    _oldPriceController = TextEditingController(text: c?['originalPrice']?.toString() ?? "");
    _imageController = TextEditingController(text: c?['image'] ?? "");
    _durationController = TextEditingController(text: c?['duration'] ?? "");
    _descriptionController = TextEditingController(text: c?['description'] ?? "");

    if (c != null) {
      if (_categories.contains(c['category'])) {
        _selectedCategory = c['category'];
      }
      if (_levels.contains(c['level'])) {
        _selectedLevel = c['level'];
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _instructorController.dispose();
    _priceController.dispose();
    _oldPriceController.dispose();
    _imageController.dispose();
    _durationController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  // --- FONCTION DE SAUVEGARDE CONNECTÉE À FIREBASE ---
  Future<void> _saveCourse() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      // Préparation des données
      final double price = double.tryParse(_priceController.text) ?? 0.0;
      final double? oldPrice = double.tryParse(_oldPriceController.text);
      
      // Calcul automatique de la note et des étudiants pour un nouveau cours
      // Si c'est une modif, on garde les anciennes valeurs, sinon on initialise
      final double rating = widget.courseToEdit != null 
          ? (widget.courseToEdit!['rating'] ?? 0.0) 
          : 0.0;
      final int students = widget.courseToEdit != null 
          ? (widget.courseToEdit!['students'] ?? 0) 
          : 0;

      final Map<String, dynamic> courseData = {
        "title": _titleController.text,
        "category": _selectedCategory,
        "instructor": _instructorController.text,
        "price": price,
        "originalPrice": oldPrice,
        "image": _imageController.text,
        "duration": _durationController.text,
        "level": _selectedLevel,
        "description": _descriptionController.text,
        "rating": rating,
        "students": students,
        "updatedAt": FieldValue.serverTimestamp(),
      };

      if (widget.courseToEdit == null) {
        // --- CAS 1 : CRÉATION (Ajout) ---
        courseData["createdAt"] = FieldValue.serverTimestamp();
        await FirebaseFirestore.instance.collection('courses').add(courseData);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Cours créé avec succès !"), backgroundColor: Colors.green),
          );
        }
      } else {
        // --- CAS 2 : MODIFICATION (Update) ---
        // On utilise l'ID du document pour faire la mise à jour
        String courseId = widget.courseToEdit!['id'];
        await FirebaseFirestore.instance.collection('courses').doc(courseId).update(courseData);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Cours modifié avec succès !"), backgroundColor: Colors.green),
          );
        }
      }

      if (mounted) {
        Navigator.pop(context); // Retour à la liste
      }

    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erreur: $e"), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.courseToEdit != null;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(
          isEditing ? "Modifier le Cours" : "Nouveau Cours",
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveCourse,
            child: _isLoading 
              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
              : Text(
                isEditing ? "ENREGISTRER" : "CRÉER",
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF6C63FF)),
              ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSectionTitle("Informations Générales"),
              const SizedBox(height: 15),
              _buildTextField("Titre du cours", _titleController, icon: Icons.title),
              const SizedBox(height: 15),
              _buildDropdown("Catégorie", _categories, _selectedCategory, (val) {
                setState(() => _selectedCategory = val!);
              }),
              const SizedBox(height: 15),
              _buildTextField("Nom du formateur", _instructorController, icon: Icons.person),

              const SizedBox(height: 30),
              _buildSectionTitle("Détails & Prix"),
              const SizedBox(height: 15),
              Row(
                children: [
                  Expanded(child: _buildTextField("Prix (TND)", _priceController, icon: Icons.attach_money, isNumber: true)),
                  const SizedBox(width: 15),
                  Expanded(child: _buildTextField("Prix barré (Optionnel)", _oldPriceController, icon: Icons.money_off, isNumber: true)),
                ],
              ),
              const SizedBox(height: 15),
              Row(
                children: [
                  Expanded(child: _buildTextField("Durée (ex: 10h)", _durationController, icon: Icons.timer)),
                  const SizedBox(width: 15),
                  Expanded(
                    child: _buildDropdown("Niveau", _levels, _selectedLevel, (val) {
                      setState(() => _selectedLevel = val!);
                    }),
                  ),
                ],
              ),

              const SizedBox(height: 30),
              _buildSectionTitle("Visuel & Description"),
              const SizedBox(height: 15),
              _buildTextField("URL de l'image", _imageController, icon: Icons.image),
              const SizedBox(height: 15),
              _buildTextField("Description complète", _descriptionController, maxLines: 5),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller,
      {IconData? icon, bool isNumber = false, int maxLines = 1}) {
    return TextFormField(
      controller: controller,
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      maxLines: maxLines,
      validator: (value) {
        if (value == null || value.isEmpty) {
          if (label.contains("Optionnel")) return null;
          return "Ce champ est requis";
        }
        return null;
      },
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: icon != null ? Icon(icon, color: Colors.grey) : null,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }

  Widget _buildDropdown(String label, List<String> items, String value, void Function(String?)? onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
