import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Constants } from 'expo';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import Storage from '@aws-amplify/storage';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import Moment from 'moment';

class DetailsPageScreen extends React.Component {
  
  constructor(...args) {
    super(...args);

    this.state = {dataX:['0', '1'], dataY:[], key:''};

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
                        console.log(data);
                        //console.log('X : ' + JSON.stringify(this.state["data"][0]["X"]));
                        this.state.dataX = [];
                        this.state.dataY = [];

                        data.forEach(item=>{
                            this.state.dataX.push(Moment.unix(parseFloat(item['_time'])).format("D"));
                            this.state.dataY.push(parseFloat(item['value']));
                            
                            //console.log(Moment.unix(parseFloat(item['_time'])).format("MM/DD/YYYY")); //basically you can do all sorts of the formatting and others

                            
                            //console.log(JSON.stringify(dataTmp));
                        });

                        this.state.dataX = [...new Set(this.state.dataX)]; 

                        //console.log('after set : ' + this.state["data"][0]["X"]);
                        //console.log('Y : ' + this.state.dataY);
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
    if(this.state.key==''){
        return <View></View>;
    }else{
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: 'row', marginLeft:5}}>
                <YAxis
                    data={this.state.dataY}
                    contentInset={{ left: 5, right: 5 }}
                    svg={axesSvg}
                />
                <View style={{ flex: 1 }}>
                    <LineChart
                        style={{ flex: 1}}
                        data={this.state.dataY}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ flex: 1}}
                        data={this.state.dataX}
                        formatLabel={(value, index) => {return value;}}
                        contentInset={{ left: 5, right: 5 }}
                        svg={axesSvg}
                    />
                </View>
            </View>
        </View>
        );
  };
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
});

export default DetailsPageScreen;
