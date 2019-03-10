import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'; //https://facebook.github.io/react-native/docs/flatlist#refreshing
import { createStackNavigator } from 'react-navigation';
import { Constants } from 'expo';
import Storage from '@aws-amplify/storage';

const numColumns = 1;
const ITEM_HEIGHT = Dimensions.get('window').width / numColumns;

class ListPageScreen extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {list:[]};
    this.state.list=this.ListAllElement();
    console.log(this.state.list);
  }

  ListAllElement = () => {

    //var regex = /numeric_.*\.json/g;
    var regex = /.*/g;
    var list =[];

    Storage.list('', {level: 'private'})
    .then(result => {
      //console.log('data from S3' +result);
      result.forEach(function(item){
        //console.log(item);
        if(item.key.match(regex)){
          Storage.get(item.key, {level: 'private'})
            .then(result => {
              fetch(result)
                .then(response => response.json())
                  .then(data => {
                    console.log("data :"+JSON.stringify(data));
                    list.push(data);
                  })
                  .catch(error => {console.log(error);
                }
              );
            }
          )
          .catch(err => console.log(err));
          
        }
      });
      }
    )
    .catch(err => console.log(err));
    return list
  }

  render() {

    return (
      <View style={styles.container}>
      <FlatList
        //data={formatData(this.state.list, numColumns)}
        data={this.state.list}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={numColumns}
      />
      </View>
    );
  
  }

  renderItem = ({ item, index }) => {

    const {navigate} = this.props.navigation;
    console.log("create page : " + item.key);

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }else{
      return (
        <TouchableOpacity
          key = {Math.random()}
          style={styles.item}
          onPress={()=>{
            console.log("create page : " + item.key);
            //navigate('Create Page', {fromKey: item.key});
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
  console.log("formatData : " + data);
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
