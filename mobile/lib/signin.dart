import 'package:flutter/material.dart';
import 'package:mobile/services/auth_services.dart';
import 'package:mobile/signup_screen.dart';

class SigninScreen extends StatefulWidget {
  const SigninScreen({super.key});

  @override
  State<SigninScreen> createState() => _SigninScreenState();
}

class _SigninScreenState extends State<SigninScreen> {
  TextEditingController emailCTRL=TextEditingController();
  TextEditingController passwordCTRL=TextEditingController();

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
                'SignIn',
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
                  onPressed: () {
                    AuthServices.handleSignUp(emailCTRL.text, passwordCTRL.text, context);
                  },
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
                      Text('Google Sign In'),
                    ],
                  ), // Row
                ), // ElevatedButton
              ), // SizedBox
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
                  child: Text('Sign In', style: TextStyle(fontSize: 16)),
                ), // ElevatedButton
              ), // SizedBox
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have Account?",
                    style: TextStyle(color: Colors.black, fontSize: 12),
                  ), // Text
                  GestureDetector(
                    onTap: () {
                      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context)=>SignupScreen()), (router)=>false);
                    },
                    child: Text(
                      'SignUp',
                      style: TextStyle(
                        color: Colors.orange,
                        fontSize: 14,
                        decoration: TextDecoration.underline,
                        decorationColor: Colors.orange,
                        fontWeight: FontWeight.w700,
                      ), // TextStyle
                    ), // Text
                  ), // GestureDetector
                ],
              ), // Row
            ],
          ),
        ),
      ),
    ); // Scaffold
  }
}