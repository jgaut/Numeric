import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

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
    let {width, height} = Dimensions.get('window');
    console.log(width, height);
    return (
      <View>
        <Text h2>ChatBot</Text>
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
