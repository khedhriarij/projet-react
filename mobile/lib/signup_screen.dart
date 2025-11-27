import 'package:flutter/material.dart';
import 'package:mobile/services/AuthServices/auth_services.dart';
class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State <SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  TextEditingController emailCTRL=TextEditingController();
  TextEditingController passwordCTRL=TextEditingController();
  bool loader=false;
  @override
  Widget build(BuildContext context) {
     return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 200,
                height: 200,
                child: Image.asset(
                  'assets/images/logo.png',
                  fit: BoxFit.cover,
                ), // Image.asset
              ), // SizedBox
              Text(
                'SignUp',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color:Colors.black,
                ),
              ),
              SizedBox(height: 30,),
              TextFormField(
                controller: emailCTRL,
                decoration: InputDecoration(
                  hintText: 'Email',
                  filled: true,
                  fillColor: Colors.grey.withOpacity(0.25),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ), // OutlineInputBorder
                  prefixIcon: Icon(Icons.email, color: Colors.black,),
                ), // InputDecoration
                keyboardType: TextInputType.emailAddress,
              ),
              SizedBox(height: 20,),
              TextFormField(
                controller: passwordCTRL,
                obscureText: true,
                decoration: InputDecoration(
                    hintText: 'Password',
                    filled: true,
                    fillColor: Colors.grey.withOpacity(0.25),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ), // OutlineInputBorder
                    prefixIcon: Icon(Icons.lock, color: Colors.black,),
                    suffixIcon: GestureDetector(
                      onTap: () {},
                      child: Icon(
                        Icons.remove_red_eye_outlined,
                        color: Colors.black,
                      ),
                    )
                ), // InputDecoration
                keyboardType: TextInputType.emailAddress,
              ), // TextFormField
              SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    'Forget Password?',
                    style: TextStyle(
                      color: Colors.orange,
                      fontSize: 14,
                      decorationColor: Colors.orange,
                      fontWeight: FontWeight.w700,
                    ), // TextStyle
                  ), // Text
                ],
              ), // Row

              SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                  ), // ElevatedButton.styleFrom
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 24, // Taille réduite
                        height: 24, // Taille réduite
                        child: Image.asset("assets/images/Logo-google-icon.png"),
                      ),
                      SizedBox(width: 10),
                      Text('Google Sign Up'),
                    ],
                  ), // Row
                ), // ElevatedButton
              ), // SizedBox
              SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      loader=true;
                    });
                    AuthServices.handleSignUp(
                        emailCTRL.text.toString(),
                        passwordCTRL.text.toString(),
                        context,
                    );
                    setState(() {
                      loader=false;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                  ), // ElevatedButton.styleFrom
                  child: Text('Sign Up', style: TextStyle(fontSize: 16)),
                ), // ElevatedButton
              ), // SizedBox
              SizedBox(height: 20),

            ],
          ),
        ),
      ),
    );
  }
}
