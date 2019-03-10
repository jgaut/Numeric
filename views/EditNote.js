import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Constants } from 'expo';

class EditNote extends Component {

  state = {
    text: '',
    key:'',
  }

  constructor(...props) {
    super(...props);
    if(this.props.navigation.state.params){
      this.state.key = this.props.navigation.state.params.key;
    this.state.text = this.props.navigation.state.params.text;
  
    }
  }

  render() {
    
    const {navigate} = this.props.navigation;

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
   
          <TextInput 
            style={styles.note} 
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
            />
          <View style={styles.submitButton}>
            
            <TouchableOpacity key={Math.random()} onPress={() => {navigate('Create Page', {'type':'note', 'type': 'note', 'key':this.state.key, 'text':this.state.text});}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>OK</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity key={Math.random()} onPress={() => {navigate('Create Page')}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
      
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
button: {
  padding:5,
  margin:5,
  height: 40,
  width:200,
  backgroundColor: '#2196F3',
  alignItems: 'stretch',
  justifyContent: 'center',
    },
  buttonText: {
    color: 'white'
  },
container: {
    backgroundColor: '#f5fcff',
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  container2: {
    justifyContent: 'center', 
alignItems: 'center' 
  },
  nothing: {

  },
  MovingBlock: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555' 
  },
  note: {
    padding:5,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555' 
  },
  text: {
    padding:5,
    height: 150,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555' 
  },
  submitButton: {
    bottom:0,
    left:0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editMode: {
    position: 'absolute',
    flex: 1,
  },
});

export default EditNote;
