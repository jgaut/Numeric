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

    this.state = {dataX:[], dataY:[], key:''};

    this.props.navigation.addListener('didFocus', () => {
        this.loadDetails();
    });

    this.props.navigation.addListener('didBlur', () => {
    });

    //this.loadDetails();
    //console.log('Y : ' + this.state.data);
    //console.log(JSON.stringify(this.state.data));

  }

  loadDetails(){
    /*this.state.data[0].X=[1];
    this.state.data[0].Y=[1];
    this.state.data[1].X=[1];
    this.state.data[1].Y=[1];
    this.forceUpdate();*/
    //console.log(this.props.navigation.state.params.key);
    //console.log("loaddetails");


    var regex = /numeric_/gi;
    var tmp = this.props.navigation.state.params.key;
    tmp = tmp.replace(regex, 'numeric_details_'+'0'+'_');
    //console.log(tmp);
    //console.log(JSON.stringify(this.state.data[g]));

    Storage.get(tmp, {level: 'public'})
        .then(result => {
            fetch(result).then(response => response.json()).then(data => {
                //console.log(data);
                //this.state.data=data;
                this.state.dataX = [...new Set()];
                this.state.dataY = [...new Set()];
                data.forEach(item=>{
                    this.state.dataX.push(item['_time']);
                    this.state.dataY.push(parseInt(item['value']));
                });
                this.state.dataX = [...new Set(this.state.dataX]; 

                this.forceUpdate();
            });
        });    
    }

  render() {
    
    //const {navigate} = this.props.navigation;
    console.log('X : ' + JSON.stringify(this.state.dataX));
    const axesSvg = { fontSize: 8, fill: 'grey', fontWeight: 'bold' };
    const verticalContentInset = {};
    const xAxisHeight = 10;
    if(this.state.dataX.length!=0 || this.state.dataX.length!=0) {
        return (
            <View style={{ height: (Dimensions.get('window').height-Constants.statusBarHeight)/2, padding: 5, flexDirection: 'row', paddingTop: Constants.statusBarHeight + 5 }}>
                <YAxis
                    data={this.state.dataY}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={this.state.dataY}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244, 0.5)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ height: xAxisHeight }}
                        data={this.state.dataX}
                        formatLabel={(index) => this.state.dataX[index]}
                        contentInset={{ left: 15, right: 15 }}
                        svg={{
                        fill: 'black',
                        fontSize: 8,
                        fontWeight: 'bold',
                        rotation: 0,
                        originY: 10,
                        y: 5,
                    }}
                    />
                </View>
            </View>
        );
        } else{
            return (<View></View>);
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
});

export default DetailsPageScreen;
