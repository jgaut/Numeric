import React from 'react';
import React from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import { Constants } from 'expo';
import { Grid, LineChart, XAxis, YAxis, AreaChart } from 'react-native-svg-charts'
import Storage from '@aws-amplify/storage';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import Moment from 'moment';
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import dateFns from 'date-fns'

class GraphPageScreen extends React.Component {
  
    constructor(...args) {
        super(...args);

        this.state = {};

        this.props.navigation.addListener('didBlur', () => {
        });

    }

    componentDidMount(){
        this.props.navigation.addListener('didFocus', () => {
            this.loadDetails();
        });
    }

    render() {

        return (
            <View>
                
            </View>
        );

    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
});

export default GraphPageScreen;
