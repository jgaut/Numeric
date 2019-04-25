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

class DetailsPageScreen extends React.Component {
  
    constructor(...args) {
        super(...args);

        this.state = {dataX:[[0,1],[0,1]], dataY:[[0,1], [0,1]], key:''};

        this.props.navigation.addListener('didFocus', () => {
            this.loadDetails();
        });

        this.props.navigation.addListener('didBlur', () => {
        });

    }

    loadDetails(){

        for (let i=0; i<2; i++){

            var regex = /numeric_/gi;
            var tmp = this.props.navigation.state.params.key;
            tmp = tmp.replace(regex, 'numeric_details_'+i+'_');
            console.log('numeric_details_'+i+'_');
            console.log(tmp);

            Storage.get(tmp, {level: 'public'})
                .then(result => {
                    fetch(result).then(response => response.json()).then(data => {

                        //this.state.dataX[i] = [...new Set()];
                        //this.state.dataY[i] = [...new Set()];
                        var dataX = [...new Set()];
                        var dataY = [...new Set()];
                        data.forEach(item=>{
                            console.log(item);
                            dataX.push(item['_time']);
                            dataY.push(parseInt(item['value']));
                        });

                        dataX = [...new Set(dataX)];

                        console.log(JSON.stringify(dataX));
                        console.log(dataY);

                        this.setState({
                            dataX
                        });

                        this.setState({
                            dataY
                        });

                        //this.forceUpdate();
                    });
                });  
        }
    }

    render() {
    
        const axesSvg = { fontSize: 8, fill: 'grey' };
        const verticalContentInset = {};
        const xAxisHeight = 10;

        return (
            <View style={{ paddingTop: Constants.statusBarHeight + 5}}>
                <View style={{ height: (Dimensions.get('window').height-Constants.statusBarHeight-5)/2-5, paddingBottom: 5, paddingLeft:5, flexDirection: 'row' }}>
                    <YAxis
                        data={this.state.dataY[0]}
                        style={{ marginBottom: xAxisHeight }}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
                        <LineChart
                            style={{ flex: 1 }}
                            data={this.state.dataY[0]}
                            contentInset={verticalContentInset}
                            svg={{ stroke: 'rgb(134, 65, 244, 0.5)' }}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            style={{ height: xAxisHeight }}
                            data={this.state.dataX[0]}
                            formatLabel={(index) => this.state.dataX[0][index]}
                            contentInset={{ left: 15, right: 15 }}
                            svg={{
                            fill: 'black',
                            fontSize: 8,
                            rotation: 0,
                            originY: 10,
                            y: 5,
                        }}
                        />
                    </View>
                </View>


                <View style={{ height: (Dimensions.get('window').height-Constants.statusBarHeight-5)/2-5, paddingBottom: 5, paddingLeft:5, flexDirection: 'row' }}>
                    <YAxis
                        data={this.state.dataY[1]}
                        style={{ marginBottom: xAxisHeight }}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
                        <LineChart
                            style={{ flex: 1 }}
                            data={this.state.dataY[1]}
                            contentInset={verticalContentInset}
                            svg={{ stroke: 'rgb(134, 65, 244, 0.5)' }}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            style={{ height: xAxisHeight }}
                            data={this.state.dataX[1]}
                            formatLabel={(index) => this.state.dataX[1][index]}
                            contentInset={{ left: 80, right: 15 }}
                            svg={{
                            fill: 'black',
                            fontSize: 8,
                            rotation: 0,
                            originY: 10,
                            y: 5,
                        }}
                        />
                    </View>
                </View>

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

export default DetailsPageScreen;
