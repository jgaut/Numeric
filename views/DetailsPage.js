import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Constants } from 'expo';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import Storage from '@aws-amplify/storage';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import Moment from 'moment';
import * as d3scale from 'd3-scale';

class DetailsPageScreen extends React.Component {
  
  constructor(...args) {
    super(...args);

    this.state = {data:[{X:[1], Y:[1]}, {X:[1], Y:[1]}], key:''};

    this.props.navigation.addListener('didFocus', () => {
        this.loadDetails();
    });

    this.props.navigation.addListener('didBlur', () => {
    });

    //this.loadDetails();

  }

  loadDetails(){
    /*this.state.data[0].X=[1];
    this.state.data[0].Y=[1];
    this.state.data[1].X=[1];
    this.state.data[1].Y=[1];
    this.forceUpdate();*/
    //console.log(this.props.navigation.state.params.key);

    if(this.state.key!=this.props.navigation.state.params.key){
   

            var regex = /numeric_/gi;
            var tmp = this.props.navigation.state.params.key;
            tmp = tmp.replace(regex, 'numeric_details_'+'0'+'_');
            //console.log(tmp);
            //console.log(JSON.stringify(this.state.data[g]));

            Storage.get(tmp, {level: 'public'})
                .then(result => {
                    fetch(result).then(response => response.json()).then(data => {
                        //console.log(data);
                        console.log('X : ' + JSON.stringify(this.state["data"][0]["X"]));
                        this.state["data"][0]["X"] = [];
                        this.state["data"][0]["Y"] = [];

                        data.forEach(item=>{
                            this.state["data"][0]["X"].push(Moment.unix(parseFloat(item['_time'])).format("d mm"));
                            this.state["data"][0]["Y"].push(parseFloat(item['value']));
                            
                            //console.log(Moment.unix(parseFloat(item['_time'])).format("MM/DD/YYYY")); //basically you can do all sorts of the formatting and others

                            
                            //console.log(JSON.stringify(dataTmp));
                        });

                        this.state["data"][0]["X"] = [...new Set(this.state["data"][0]["X"])]; 

                        //console.log('after set : ' + this.state["data"][0]["X"]);
                        //console.log('Y : ' + this.state.dataY);
                        this.forceUpdate();
                    });
                });

            tmp = this.props.navigation.state.params.key;
            tmp = tmp.replace(regex, 'numeric_details_'+'1'+'_');

            Storage.get(tmp, {level: 'public'})
                .then(result => {
                    fetch(result).then(response => response.json()).then(data => {
                        //console.log(data);
                        //console.log('X : ' + JSON.stringify(this.state["data"][1]["X"]));
                        this.state["data"][1]["X"] = [];
                        this.state["data"][1]["Y"] = [];

                        data.forEach(item=>{
                            this.state["data"][1]["X"].push(parseFloat(item['_time']));
                            this.state["data"][1]["Y"].push(parseFloat(item['value']));

                            //console.log(JSON.stringify(dataTmp));
                        });

                        //console.log('X : ' + this.state.data[g]["X"]);
                        //console.log('Y : ' + this.state.dataY);
                        this.forceUpdate();
                    });
                });

        this.state.key=this.props.navigation.state.params.key;
    }
  }

  render() {
    
    //const {navigate} = this.props.navigation;
    console.log('X : ' + this.state.data[0]["X"]);
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 5, bottom: 0 }
    const xAxisHeight = 5

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <YAxis
                    data={this.state.data[0]["Y"]}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10}}>
                    <LineChart
                        style={{ flex: 1}}
                        data={this.state.data[0]["Y"]}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ flex: 1, bottom:0, x:500}}
                        data={this.state.data[0]["X"]}
                        formatLabel={(value, index) => {return this.state.data[0]["X"][index];}}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                        xScale={d3scale.scaleTime}
                    />
                </View>
            </View>
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
