import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native';
import Auth from '@aws-amplify/auth';

class SignInScreen extends React.Component {
  
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      err: '',
      errColor: '#f5fcff'
    };
  }

  render() {
    
    const {navigate} = this.props.navigation;

    return (

    <KeyboardAvoidingView  behavior='padding' style={styles.container} keyboardVerticalOffset='0'>
      
      <View style={styles.form}>
      
        <Text style={{color: this.state.ErrColor, paddingTop: 100}} h2>{this.state.err}</Text>
        
        <Text style={styles.label} h2>{this.state.email==''?' ':"Email"}</Text>

        <TextInput 
          placeholder="Email" 
          secureTextEntry={false} 
          style={styles.input} 
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          mode="outlined"/>
        <Text style={styles.label} h2>{this.state.password==''?' ':"Password"}</Text>
        
        <TextInput 
          placeholder="Password" 
          secureTextEntry={true} 
          style={styles.input} 
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          mode="outlined"/>

        <TouchableOpacity onPress={() => {

            const username = this.state.email;
            const password = this.state.password;
            const error = false;

            this.setState({errColor: '#000000'});  
            this.setState({err: ''});  

            Auth.signUp(
              this.state.email,
              this.state.password)
              .then((data) => {
                console.log(data);
                navigate('SignUpConfirm', {username: data.user.username});
              })
              .catch((err) => {
                console.log(err);
                if(err && err.code && typeof err.code != 'undefined' && err.code == 'UsernameExistsException'){

                  // For advanced usage
                  // You can pass an object which has the username, password and validationData which is sent to a PreAuthentication Lambda trigger
                  Auth.signIn({
                      username, // Required, the username
                      password, // Optional, the password
                  }).then((user) => {
                    console.log(user);
                    navigate('App', {number: Math.random()});
                    }
                  )
                  .catch((err) => {
                    console.log(err);
                    if(err && err.code && typeof err.code != 'undefined' && err.code == 'UserNotConfirmedException'){
                      navigate('SignUpConfirm', {username: this.state.email});
                    }else{
                      this.setState({ err: err.message || err || ''});
                      this.setState({errColor: '#000000'}); 
                    }
                    }
                  );
                }else{
                    this.setState({errColor: '#000000'}); 
                    this.setState({ err: err.message || err || ''});

                }
              }
              );
                
        }}>
         
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign in / Sign Up</Text>
            </View>
          </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
    );
  };

}

const styles = StyleSheet.create({
  form: {
    padding: 80, 
    backgroundColor: '#f5fcff',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  label: {
    color: '#000000'
  },
button: {    
    padding: 20,
    backgroundColor: '#2196F3',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white'
  },
container: {
    backgroundColor: '#f5fcff',
    flex: 1,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555',
  },
});

export default SignInScreen;
