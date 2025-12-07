import 'package:flutter/material.dart';

class AddCourseView extends StatefulWidget {
  final Map<String, dynamic>? courseToEdit;

  const AddCourseView({super.key, this.courseToEdit});

  @override
  State<AddCourseView> createState() => _AddCourseViewState();
}

class _AddCourseViewState extends State<AddCourseView> {
  // --- CONTROLLERS ---
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _instructorController = TextEditingController();
  final TextEditingController _imageController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _promoPriceController = TextEditingController();
  final TextEditingController _descController = TextEditingController();

  // --- VARIABLES D'ÉTAT ---
  String _selectedCategory = "Développement";
  String _selectedLevel = "Intermédiaire";
  String _status = "Brouillon";
  
  // On a supprimé _selectedPresetImage qui posait problème.
  // On utilise directement _imageController.text pour gérer la sélection.

  int _promoPercentage = 0; // Pourcentage entier

  // --- DONNÉES STATIQUES ---
  final List<String> _categories = ["Développement", "Design", "Business", "Marketing"];
  final List<String> _levels = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];
  final List<String> _statuses = ["Brouillon", "Publié"];

  final Map<String, String> _presetImages = {
    "React": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    "Figma": "https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg",
    "Marketing": "https://img.freepik.com/free-photo/marketing-strategy-planning-strategy-concept_53876-42950.jpg",
    "Python": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png",
    "Adobe": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/600px-Adobe_Photoshop_CC_icon.svg.png",
    "Agile": "https://img.freepik.com/free-vector/scrum-method-concept-illustration_114360-1548.jpg",
  };

  @override
  void initState() {
    super.initState();
    if (widget.courseToEdit != null) {
      final c = widget.courseToEdit!;
      _titleController.text = c['title'] ?? '';
      _instructorController.text = c['instructor'] ?? '';
      _imageController.text = c['image'] ?? '';
      
      // Gestion sécurisée des prix
      _priceController.text = (c['oldPrice'] ?? c['price'] ?? 0).toString();
      
      if (c['oldPrice'] != null && c['price'] != null && c['price'] < c['oldPrice']) {
        _promoPriceController.text = c['price'].toString();
      }

      if (_categories.contains(c['category'])) {
        _selectedCategory = c['category'];
      }
      
      _calculatePercentage();
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _instructorController.dispose();
    _imageController.dispose();
    _priceController.dispose();
    _promoPriceController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _calculatePercentage() {
    double original = double.tryParse(_priceController.text) ?? 0;
    double promo = double.tryParse(_promoPriceController.text) ?? 0;

    setState(() {
      if (original > 0 && promo > 0 && promo < original) {
        _promoPercentage = (((original - promo) / original) * 100).round();
      } else {
        _promoPercentage = 0;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isEditing = widget.courseToEdit != null;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          isEditing ? "Modifier le Cours" : "Créer un Nouveau Cours",
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildLabel("Titre du cours *"),
            _buildTextField(_titleController, "Ex: React Avancé - Les Hooks"),
            const SizedBox(height: 20),

            _buildLabel("Catégorie *"),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade400),
                borderRadius: BorderRadius.circular(8),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedCategory,
                  isExpanded: true,
                  items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                  onChanged: (val) => setState(() => _selectedCategory = val!),
                ),
              ),
            ),
            const SizedBox(height: 20),

            _buildLabel("Formateur *"),
            _buildTextField(_instructorController, "Ex: Ahmed Ben Ali"),
            const SizedBox(height: 20),

            _buildLabel("Image du cours"),
            _buildTextField(
              _imageController, 
              "/images/default-course.jpg",
              onChanged: (val) => setState(() {}), // Rafraîchir pour l'aperçu et la sélection
            ),
            const SizedBox(height: 10),
            const Text("Ou choisir une image prédéfinie :", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
            const SizedBox(height: 10),

            // GRILLE IMAGES
            SizedBox(
              height: 110,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _presetImages.entries.map((entry) {
                  // On compare directement l'URL du champ texte avec l'URL de la liste
                  bool isSelected = _imageController.text == entry.value;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _imageController.text = entry.value;
                      });
                    },
                    child: Container(
                      width: 100,
                      margin: const EdgeInsets.only(right: 10),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: isSelected ? const Color(0xFF6C63FF) : Colors.grey.shade300,
                          width: isSelected ? 3 : 1
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        children: [
                          Expanded(
                            child: ClipRRect(
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                              child: Image.network(
                                entry.value, 
                                fit: BoxFit.cover, 
                                width: double.infinity,
                                errorBuilder: (c,e,s) => const Icon(Icons.broken_image, color: Colors.grey),
                              ),
                            ),
                          ),
                          Container(
                            width: double.infinity,
                            color: isSelected ? const Color(0xFF6C63FF) : Colors.grey[100],
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            child: Text(
                              entry.key,
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 10, color: isSelected ? Colors.white : Colors.black),
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 20),

            // APERÇU
            if (_imageController.text.isNotEmpty)
              Center(
                child: Container(
                  height: 150,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade300),
                    image: DecorationImage(
                      image: NetworkImage(_imageController.text),
                      fit: BoxFit.cover,
                      onError: (e, s) {}, 
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 20),

            _buildLabel("Prix Original (TND) *"),
            _buildTextField(_priceController, "Ex: 129", isNumber: true, onChanged: (v) => _calculatePercentage()),
            const SizedBox(height: 20),

            _buildLabel("Prix Promotionnel (TND)"),
            _buildTextField(_promoPriceController, "Ex: 89 (laisser vide pour pas de promotion)", isNumber: true, onChanged: (v) => _calculatePercentage()),
            const SizedBox(height: 10),

            _buildLabel("Pourcentage de Promotion"),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Réduction calculée :"),
                  Text(
                    "$_promoPercentage %",
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.black87),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            _buildLabel("Niveau"),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade400),
                borderRadius: BorderRadius.circular(8),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedLevel,
                  isExpanded: true,
                  items: _levels.map((l) => DropdownMenuItem(value: l, child: Text(l))).toList(),
                  onChanged: (val) => setState(() => _selectedLevel = val!),
                ),
              ),
            ),
            const SizedBox(height: 20),

            _buildLabel("Description"),
            TextField(
              controller: _descController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: "Description du cours...",
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 20),

            _buildLabel("Statut"),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade400),
                borderRadius: BorderRadius.circular(8),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _status,
                  isExpanded: true,
                  items: _statuses.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (val) => setState(() => _status = val!),
                ),
              ),
            ),
            const SizedBox(height: 40),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Annuler", style: TextStyle(color: Colors.grey)),
                  ),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Cours enregistré avec succès !")),
                      );
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6C63FF),
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text(isEditing ? "Modifier le Cours" : "Créer le Cours"),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        text,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black87),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, {bool isNumber = false, Function(String)? onChanged}) {
    return TextField(
      controller: controller,
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade400),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade400),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
      ),
    );
  }
}
