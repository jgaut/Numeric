import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class HomeScreen extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount(){
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.form}>
      <Text style={styles.label} h2>My best profile !</Text>
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
  label: {
    paddingTop: 30
  },
});

export default HomeScreen;
