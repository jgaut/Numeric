import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Constants } from 'expo';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import Storage from '@aws-amplify/storage';

class DetailsPageScreen extends React.Component {
  
  constructor() {
    super();
    this.state = {dataY:[], dataX:[], key:''};

    this.loadDetails();

    this.props.navigation.addListener('didFocus', () => {
        this.loadDetails();
    });

    this.props.navigation.addListener('didBlur', () => {
    });

  }

  loadDetails(){
    this.state.dataX=[1];
    this.state.dataY=[1];
    
    this.state.key=this.props.navigation.state.params.key;
    var regex = /numeric_/gi;
    var dKey = this.state.key.replace(regex, 'numeric_details_');

    Storage.get(dKey, {level: 'public'})
            .then(result => {
              fetch(result)
                .then(response => response.json())
                  .then(data => {
                    //console.log(data);
                    this.state.dataX=[];
                    this.state.dataY=[];
                    data.forEach(item=>{
                      this.state.dataX.push(parseFloat(item['_time']));
                      this.state.dataY.push(parseFloat(item['value']));
                    });
                    //console.log('X : ' + this.state.dataX);
                    //console.log('Y : ' + this.state.dataY);
                    this.forceUpdate();
                  })
            });
  }

  componentWillMount(){

    
  }

  render() {
    
    const {navigate} = this.props.navigation;
    //console.log('X : ' + this.state.dataX);
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 5, bottom: 0 }
    const xAxisHeight = 30

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.5, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={this.state.dataY}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10}}>
                    <LineChart
                        style={{ flex: 1}}
                        data={this.state.dataY}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ flex: 1, bottom:0, x:500}}
                        data={this.state.dataX}
                        formatLabel={(value, index) => value}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                    />
                </View>
            </View>
            <View style={{ flex: 0.5, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={this.state.dataY}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={this.state.dataY}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{flex: 1, bottom:0}}
                        data={this.state.dataX}
                        formatLabel={(value, index) => value}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
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
