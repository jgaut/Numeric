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
                    console.log('X : ' + this.state.dataX);
                    //console.log('Y : ' + this.state.dataY);
                    this.forceUpdate();
                  })
            });
  }

  render() {
    
    const {navigate} = this.props.navigation;

    //this.state.dataX =[1552309200,1552406400,1552410000,1552413600,1552417200,1552420800,1552424400,1552428000,1552431600,1552435200,1552438800,1552442400,1552446000,1552449600,1552453200,1552456800,1552460400,1552464000,1552467600,1552471200,1552474800,1552478400,1552482000,1552485600,1552489200,1552492800,1552496400,1552500000,1552503600,1552507200,1552510800,1552514400,1552518000,1552521600,1552525200,1552528800,1552532400,1552536000,1552539600,1552543200,1552546800,1552550400,1552554000,1552557600,1552561200,1552564800,1552568400,1552572000,1552575600,1552579200,1552582800,1552586400,1552590000,1552593600,1552597200,1552600800,1552604400,1552608000,1552611600,1552615200,1552618800,1552622400,1552626000,1552629600,1552633200,1552636800,1552640400,1552644000,1552647600,1552651200,1552654800,1552658400,1552662000,1552665600,1552669200,1552672800,1552676400,1552680000,1552683600,1552687200,1552690800,1552694400,1552698000,1552701600,1552705200,1552708800,1552712400,1552716000,1552719600,1552723200,1552726800,1552730400,1552734000,1552737600,1552741200,1552744800,1552748400,1552752000,1552755600,1552759200,1552762800,1552766400,1552770000,1552773600,1552777200,1552780800,1552784400,1552788000,1552791600,1552795200,1552798800,1552802400,1552806000,1552809600,1552813200,1552816800,1552820400,1552824000,1552827600,1552831200,1552834800,1552838400,1552842000,1552845600,1552849200,1552852800,1552856400,1552860000];
    //this.state.dataY =[3433.8,3432,3431.8,3428.9,3424.9,3440.4,3438.1,3440.2,3436.3,3435.1,3432.7,3432.1,3441.5,3435.6,3432,3432.7,3435.4,3429.2,3421.5,3409.4,3413.9,3428.1,3428.9,3415.1,3421.5,3418.6,3422.4,3418.6,3413,3412.9,3404.4,3410.1,3411.3,3406.5,3420.3,3418,3415.1,3416.0,3413.4,3408.9,3403.6,3412.9,3413.9,3423.0,3415.1,3417.3,3418.6,3419.5,3426.4,3419.2,3426,3424.8,3422.4,3423.7,3424.9,3420.3,3421.3,3429.2,3432.4,3427.6,3424.5,3425.7,3427.9,3423.7,3422.0,3419.5,3431.4,3433.0,3448.9,3449.1,3444.2,3445.4,3461.3,3455,3462.4,3462.0,3464,3457.7,3452.0,3451.5,3455.8,3467.0,3483.3,3480.1,3495.6,3548.4,3540.7,3541.2,3540.4,3535.2,3543.2,3548.0,3545.0,3513.2,3520.8,3527.5,3520.0,3525.3,3525.5,3527.7,3523.7,3520.6,3528.3,3530.7,3531.7,3513.3,3515.6,3501.6,3504.1,3494.5,3495.8,3504.3,3503,3505.0,3501.6,3515.2,3514.0,3510.5,3517.3,3518.3,3520.3,3513.5,3513.2,3517.7,3520.6,3526.0,3527.0,3519.4];
    console.log('X : ' + this.state.dataX);
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
                        formatLabel={(value, index) => value}
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
