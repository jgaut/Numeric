import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Constants } from 'expo';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import Storage from '@aws-amplify/storage';

class DetailsPageScreen extends React.Component {
  
  constructor() {
    super();
    this.state = {dataY:[], dataX:[], key:''};

  }

  componentWillMount(){
    this.state.key=this.props.navigation.state.params.key;
    var regex = /numeric_/gi;
    var dKey = this.state.key.replace(regex, 'numeric_details_');

    Storage.get(dKey, {level: 'public'})
            .then(result => {
              fetch(result)
                .then(response => response.json())
                  .then(data => {
                    //console.log(data);
                    data.forEach(item=>{
                      this.state.dataX.push(item['_time']);
                      this.state.dataY.push(item['value']);
                    });
                    console.log('X : ' + this.state.dataX);
                    console.log('Y : ' + this.state.dataY);
                    this.forceUpdate();
                  })
            });
  }

  render() {
    
    const {navigate} = this.props.navigation;

    

    //this.state.dataY = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ];
    //this.state.dataX = [ 1,2,3,4,5 ];

        const axesSvg = { fontSize: 10, fill: 'grey' };
        const verticalContentInset = { top: 10, bottom: 10 }
        const xAxisHeight = 30

    return (
            <View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
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
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={this.state.dataX}
                        formatLabel={(value, index) => index}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                    />
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
