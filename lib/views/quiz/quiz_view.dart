import 'package:flutter/material.dart';
import '../../models/quiz_model.dart';
import '../../services/certificate_service.dart';
import 'certificate_view.dart';
import '../../models/certificate_model.dart'; // Pour récupérer le modèle après génération

class QuizView extends StatefulWidget {
  final QuizModel quiz;
  final String courseTitle; // Pour afficher sur le certificat

  const QuizView({super.key, required this.quiz, required this.courseTitle});

  @override
  State<QuizView> createState() => _QuizViewState();
}

class _QuizViewState extends State<QuizView> {
  int currentQuestionIndex = 0;
  int score = 0;
  bool isCompleted = false;
  bool isProcessing = false; // Pour éviter les doubles clics

  void _answerQuestion(int selectedIndex) {
    if (selectedIndex == widget.quiz.questions[currentQuestionIndex].correctOptionIndex) {
      score++;
    }

    if (currentQuestionIndex < widget.quiz.questions.length - 1) {
      setState(() {
        currentQuestionIndex++;
      });
    } else {
      _finishQuiz();
    }
  }

  Future<void> _finishQuiz() async {
    setState(() {
      isCompleted = true;
    });

    double percentage = (score / widget.quiz.questions.length) * 100;
    bool passed = percentage >= widget.quiz.passingScore;

    if (passed) {
      // Générer le certificat automatiquement
      setState(() => isProcessing = true);
      final certService = CertificateService();
      await certService.generateCertificate(widget.quiz.courseId, widget.courseTitle);
      setState(() => isProcessing = false);
    }

    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        title: Row(
          children: [
            Icon(passed ? Icons.check_circle : Icons.error, color: passed ? Colors.green : Colors.red),
            const SizedBox(width: 10),
            Text(passed ? "Félicitations !" : "Échec"),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(passed 
              ? "Vous avez réussi avec un score de ${percentage.toInt()}% !"
              : "Score : ${percentage.toInt()}%. Il faut ${widget.quiz.passingScore}% pour réussir."),
            const SizedBox(height: 10),
            if (passed) const Text("Votre certificat a été généré avec succès. 🎓"),
            if (!passed) const Text("Révisez le cours et réessayez plus tard."),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Ferme le dialog
              Navigator.pop(context); // Retourne à l'écran précédent
            },
            child: const Text("Fermer"),
          ),
          if (passed)
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6C63FF)),
              onPressed: () {
                // Créer un modèle temporaire pour l'affichage immédiat
                final tempCert = CertificateModel(
                  id: "temp",
                  studentId: "me",
                  studentName: "Moi", // Idéalement récupérer du UserProvider
                  courseId: widget.quiz.courseId,
                  courseTitle: widget.courseTitle,
                  issueDate: DateTime.now(),
                  certificateUrl: "",
                );
                
                Navigator.pop(context); // Ferme dialog
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => CertificateView(certificate: tempCert)),
                );
              },
              child: const Text("Voir mon Certificat", style: TextStyle(color: Colors.white)),
            )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (widget.quiz.questions.isEmpty) {
      return Scaffold(appBar: AppBar(), body: const Center(child: Text("Aucune question dans ce quiz.")));
    }

    final question = widget.quiz.questions[currentQuestionIndex];
    double progress = (currentQuestionIndex + 1) / widget.quiz.questions.length;

    return Scaffold(
      appBar: AppBar(
        title: Text("Quiz : ${widget.quiz.title}"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(6.0),
          child: LinearProgressIndicator(value: progress, color: const Color(0xFF6C63FF), backgroundColor: Colors.grey[200]),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Question ${currentQuestionIndex + 1}/${widget.quiz.questions.length}",
              style: TextStyle(color: Colors.grey[600], fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Text(
              question.questionText,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 40),
            Expanded(
              child: ListView.separated(
                itemCount: question.options.length,
                separatorBuilder: (_, __) => const SizedBox(height: 15),
                itemBuilder: (context, index) {
                  return InkWell(
                    onTap: () => _answerQuestion(index),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                        boxShadow: [BoxShadow(color: Colors.grey.shade100, blurRadius: 5, offset: const Offset(0, 3))],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 30, height: 30,
                            decoration: BoxDecoration(color: const Color(0xFF6C63FF).withOpacity(0.1), shape: BoxShape.circle),
                            child: Center(child: Text("${index + 1}", style: const TextStyle(color: Color(0xFF6C63FF), fontWeight: FontWeight.bold))),
                          ),
                          const SizedBox(width: 15),
                          Expanded(child: Text(question.options[index], style: const TextStyle(fontSize: 16))),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
