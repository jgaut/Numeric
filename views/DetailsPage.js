import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Constants } from 'expo';

class DetailsPageScreen extends React.Component {
  
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

      <View style={styles.container}>
        <Text>{this.props.navigation.state.params.key}
        </Text>
        
      </View>

        
    );
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
});

export default DetailsPageScreen;
