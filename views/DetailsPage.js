import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
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

    this.state = {data:[], key:''};

    this.state.data = [
            {
                value: 50,
                date: dateFns.setHours(new Date(2018, 0, 0), 6),
            },
            {
                value: 10,
                date: dateFns.setHours(new Date(2018, 0, 0), 9),
            },
            {
                value: 150,
                date: dateFns.setHours(new Date(2018, 0, 0), 15),
            },
            {
                value: 10,
                date: dateFns.setHours(new Date(2018, 0, 0), 18),
            },
            {
                value: 100,
                date: dateFns.setHours(new Date(2018, 0, 0), 21),
            },
            {
                value: 20,
                date: dateFns.setHours(new Date(2018, 0, 0), 24),
            },
        ];

    this.props.navigation.addListener('didFocus', () => {
        this.loadDetails();
    });

    this.props.navigation.addListener('didBlur', () => {
    });

    //this.loadDetails();
    console.log('Y : ' + this.state.data);
    console.log(dateFns.setHours(new Date(2018, 0, 0), 21));

  }

  loadDetails(){
    /*this.state.data[0].X=[1];
    this.state.data[0].Y=[1];
    this.state.data[1].X=[1];
    this.state.data[1].Y=[1];
    this.forceUpdate();*/
    //console.log(this.props.navigation.state.params.key);
    console.log("loaddetails");

    if(this.state.key!=this.props.navigation.state.params.key){
   
        this.state.key=this.props.navigation.state.params.key;

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
                        this.state.data = [...new Set()];
                        data.forEach(item=>{

                            //this.state.dataX.push(Moment.unix(parseFloat(item['_time'])).format("D"));
                            //this.state.dataY.push(parseFloat(item['value']));
                            var myDate = item['_time'];
                            this.state.data.push({date: new Date(myDate), value: item['value']});
                            //console.log(Moment.unix(parseFloat(item['_time'])).format("MM/DD/YYYY")); //basically you can do all sorts of the formatting and others

                            
                            //console.log(JSON.stringify(dataTmp));
                        });



                        //this.state.dataX = [...new Set(this.state.dataX)]; 

                        //console.log('after set : ' + this.state["data"][0]["X"]);
                        console.log('Y : ' + this.state.data);
                        this.forceUpdate();
                    });
                });    
    }
  }

  render() {
    
    //const {navigate} = this.props.navigation;
    //console.log('X : ' + this.state.data[0]["X"]);
    const axesSvg = { fontSize: 8, fill: 'grey' };
    const verticalContentInset = {};
    const xAxisHeight = 10;
  
    return (
        <View style={{ height: 500, padding: 20 }}>
                <AreaChart
                    style={{ flex: 1 }}
                    data={ this.state.data }
                    yAccessor={ ({ item }) => item.value }
                    xAccessor={ ({ item }) => item.date }
                    xScale={ scale.scaleTime }
                    contentInset={{ top: 10, bottom: 10 }}
                    svg={{ fill: 'rgba(134, 65, 244, 0.5)' }}
                    curve={ shape.curveLinear }
                >
                    <Grid/>
                </AreaChart>
                <XAxis
                    data={ this.state.data }
                    svg={{
                        fill: 'black',
                        fontSize: 8,
                        fontWeight: 'bold',
                        rotation: 20,
                        originY: 30,
                        y: 5,
                    }}
                    xAccessor={ ({ item }) => item.date }
                    scale={ scale.scaleTime }
                    numberOfTicks={ 6 }
                    style={{ marginHorizontal: -15, height: 20 }}
                    contentInset={{ left: 10, right: 25 }}
                    formatLabel={ (value) => dateFns.format(value, 'HH:mm') }
                />
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
