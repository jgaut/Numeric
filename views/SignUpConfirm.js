import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import Auth from '@aws-amplify/auth';

class ProfileScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '',
      code: '',
      err: '',
    }
  }

  componentWillMount(){
    this.setState({ username: this.props.navigation.state.params.username});
    console.log(this.state.username);
  }



  render() {
    const {navigate} = this.props.navigation;
    var test=<Text style='color:black'>blabla</Text>
    
    return (
      <View style={styles.form}>
      
      <Text style={styles.label} h2>{this.state.err}</Text>


      <TextInput 
          placeholder="Code" 
          secureTextEntry={false} 
          style={styles.input} 
          value={this.state.code}
          onChangeText={code => this.setState({ code })}
          mode="outlined"/>

      <TouchableOpacity onPress={() => {
        // After retrieveing the confirmation code from the user
        Auth.confirmSignUp(
          this.state.username,
          this.state.code, {
          // Optional. Force user confirmation irrespective of existing alias. By default set to True.
          forceAliasCreation: true
        }).then((data) => {
          console.log('data');
          console.log(data);
          navigate('App', {number: Math.random()});
        }).catch((err) => {
          console.log('err');
            console.log(err);
            this.setState({ err: err.message || err || ''});
        });
      }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Confirm</Text>
            </View>
          </TouchableOpacity>
          
      </View>
    );
  }
}



const styles = StyleSheet.create({
  form: {
    padding: 60, 
    backgroundColor: '#f5fcff',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  input: {
    height: 26, 
    fontSize: 20, 
    color: '#000', 
    borderBottomWidth: 1, 
    borderBottomColor: '#555' 
  },
  label: {
    paddingTop: 30,

    color: 'black'
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
  }
});

export default ProfileScreen;
