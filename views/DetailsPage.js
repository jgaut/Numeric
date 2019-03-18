import React from 'react';
import { StyleSheet, Text} from 'react-native';
import { Constants } from 'expo';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'

class DetailsPageScreen extends React.Component {
  
  constructor() {
    super();
    this.state = {};
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
