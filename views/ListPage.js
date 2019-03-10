import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'; //https://facebook.github.io/react-native/docs/flatlist#refreshing
import { createStackNavigator } from 'react-navigation';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Constants } from 'expo';
 
const moment = extendMoment(Moment);

const numColumns = 3;
const ITEM_HEIGHT = Dimensions.get('window').width / numColumns;

class ListPageScreen extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {data: {"list":[]}};
    this.ListAllElement();
  }

  ListAllElement = () => {
    const range = moment.range('2019-01-01', '2019-12-31');
    let m = '';
    
    for (let day of range.by('day')) {
      let n = day.format('MM');
      if(m!=n){
        m=n;
        let item = {key:day.format('MMMM YYYY'), month:true};
        this.state.data.list.push(item);
      }

      let item = {key:day.format('YYYY-MM-DD'), month:false};
      this.state.data.list.push(item);
    }
  }

  render() {

    return (
      <View style={styles.container}>
      <FlatList
        data={formatData(this.state.data.list, numColumns)}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={numColumns}
        progressViewOffset={(number)=>{console.log('offset : '+number)}}
        initialNumToRender={30}
        initialScrollIndex={100}
         getItemLayout={(data, index) => (
          {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
          )}
      />
      </View>
    );
  
  }

  renderItem = ({ item, index }) => {

    const {navigate} = this.props.navigation;

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }else if(item.month === true){
      return (<View
        style={styles.item}
      >
        <Text style={styles.itemText}>{item.key}</Text>
      </View>
      );
    }else{
      return (
        <TouchableOpacity
          key = { item.key }
          style={styles.item}
          onPress={()=>{
            console.log("create page : " + item.key);
            navigate('Create Page', {fromKey: item.key});
            //navigate('Example', {fromKey: item.key});
          }}
        >
        <View
          style={styles.item}
        >
          <Text style={styles.itemText}>{item.key}</Text>
        </View>
        </TouchableOpacity>
      );
    }
  };
}

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);
  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return data;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: ITEM_HEIGHT, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

export default ListPageScreen;
