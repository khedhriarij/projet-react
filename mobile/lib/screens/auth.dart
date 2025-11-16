import 'package:flutter/material.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() {
    return _AuthScreenState();
  }
}

class _AuthScreenState extends State<AuthScreen> {
  final _form=GlobalKey<FormState>();
  var _isLogin=true;
  var _enteredEmail='';
  var _entredPassword='';
  void _submit(){
    final isValid =_form.currentState!.validate();
    if(isValid){
      _form.currentState!.save();
      print(_enteredEmail);
      print(_entredPassword);
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.primary,
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                margin: const EdgeInsets.only(
                  top: 30,
                  bottom: 20,
                  left: 20,
                  right: 20,
                ), // EdgeInsets.only
                width: 200,
                child: Image.asset('assets/images/image.png'),

              ), // Container
              Card(
                  margin: const EdgeInsets.all(20),
                  child:SingleChildScrollView(
                    child: Padding(

                      padding: const EdgeInsets.all(16),
                      child: Form(
                        key:_form,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            TextFormField(
                              decoration: const InputDecoration(
                                  labelText: 'Email Address'
                              ),
                              keyboardType: TextInputType.emailAddress,
                              autocorrect: false,
                              textCapitalization: TextCapitalization.none,
                              validator: (value){
                                if(value == null || value.trim().isEmpty ||
                                ! value.contains('@')){
                                  return 'please enter a valid email address.';
                                }
                                return null;

                              },
                              onSaved: (value) {
                                _enteredEmail = value!;
                              },
                            ),


                            TextFormField(
                              decoration: const InputDecoration(
                                  labelText: 'Password'
                              ),
                              obscureText: true,
                              validator: (value){
                                if(value == null || 6 > value.trim().length ){
                                  return 'password must be at least 6 characters long.';
                                }
                                return null;

                              },
                                onSaved: (value) {
                              _entredPassword = value!;
                            }

                            ),

                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed:_submit,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                              ),
                              child:  Text(_isLogin ? 'Login': 'Signup'),
                            ),
                            TextButton(
                              onPressed: (){
                                setState(() {
                                  _isLogin= !_isLogin;
                                });
                              },
                              child: Text(_isLogin
                                  ? 'Create an account'
                                  : 'I already have an account'),
                            ),
                          ],
                        ),
                      ),

                    ),
                  )
              )
            ],
          ), // Column
        ), // SingleChildScrollView
      ), // Center
    ); // Scaffold
  }
}