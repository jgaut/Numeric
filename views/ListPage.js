import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Storage from '@aws-amplify/storage';

const numColumns = 3;

class ListPageScreen extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {data: {"list":[]}, max:30, min:-10};
    this.ListAllElement();
    
  }

  componentWillMount(){
   // this.scrollToItem('item' : this.state.data.list[112]);
  }

  ListAllElement = () => {
    for(let i=this.state.min; i<=this.state.max; i++){
      let item = {key:i};
      this.state.data.list.push(item);
    }

    var regex = /numeric_.*\.json/g;
    var tmp =[];
    var taille=0;
    var cpt=0;
    Storage.list('/numeric*', {level: 'private'})
    .then(result => {
      //console.log('data from S3' +result);
      taille=result.length;
      console.log('taille:'+taille);
      result.forEach(item=>{
        
        if(item.key.match(regex)){
          //tmp.push(item);
          console.log(item);
          //this.forceUpdate();
          Storage.get(item.key, {level: 'private'})
            .then(result => {
              fetch(result)
                .then(response => response.json())
                  .then(data => {
                    data.key=Math.random();
                    tmp.push(data);
                    cpt++;
                    if(taille==cpt){
                    this.state.data.list=tmp;
                    this.forceUpdate();
                    console.log("tmp :"+JSON.stringify(tmp));
                    }
                    //console.log("list :"+JSON.stringify(list));
                  })
                  .catch(error => {console.log(error);
                }
              );
            }
          )
          .catch(err => console.log(err));
          
        }else{
          //console.log('ignore :'+item.key);
        }
      });

      //console.log('finito');
      }
    )
    .catch(err => console.log(err));

  }

  render() {

    return (
      <FlatList
        data={formatData(this.state.data.list, numColumns)}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={numColumns}
      />
    );
  
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity
        key = { item.key }
        style={styles.item}
      >
      <View
        style={styles.item}
      >
        <Text style={styles.itemText}>{item.value}</Text>
      </View>
      </TouchableOpacity>
    );
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
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

export default ListPageScreen;
