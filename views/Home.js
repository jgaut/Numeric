import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import Auth from '@aws-amplify/auth';

class HomeScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      user:''
    };
  }

  componentWillMount(){
    Auth.currentAuthenticatedUser({bypassCache: false})
      .then((user) => {
        console.log(user);
        this.setState({user: user.attributes.email});
        }
      ).catch((err) => {
        console.log(err);
        }
      );
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.form}>
      <Text style={styles.label} h2>Welcome {this.state.user} !</Text>
      <TouchableOpacity onPress={() => {
        // After retrieveing the confirmation code from the user
        Auth.signOut()
        .then((data) => {
          console.log(data);
          navigate('App', {number: Math.random()});
          }
        )
        .catch(err => console.log(err));
      }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
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
    paddingTop: 30
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

export default HomeScreen;
