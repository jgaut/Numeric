import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Storage from '@aws-amplify/storage';

const numColumns = 2;

class ListPageScreen extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {data: {"list":[]}, max:8, min:0};
    this.ListAllElement();
    console.log('taille : '+Dimensions.get('window').width / numColumns);
    
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
    Storage.list('Numeric/Indicateurs/numeric_', {level: 'private'})
    .then(result => {
      console.log('data from S3' +JSON.stringify(result));
      taille=result.length;
      //console.log('taille:'+taille);
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
                    //Find image background
                    var regex = /\.json/gi;
                    var image = item.key.replace(regex, ".jpg")

                    regex = /Indicateurs/gi;
                    image = image.replace(regex, "Images");

                    console.log("key image : "+image);
                    Storage.get(image, {level: 'private'}).then(result => {
                      fetch(result).then(response => {
                        console.log(response);
                        data.uri=response;
                        data.key=Math.random();
                        tmp.push(data);
                        cpt++;
                        if(taille==cpt){
                          this.state.data.list=tmp;
                          this.forceUpdate();
                        }
                      });
                    });
                    
                    //console.log("tmp :"+JSON.stringify(tmp));
                    //console.log("list :"+JSON.stringify(list));
                  }).catch(error => {console.log(error);});
            }).catch(err => console.log(err));
        }
      });
    });

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
       <ImageBackground source={item.uri} style={{width: '100%', height: '100%'}}>
        <Text style={styles.itemText}>{item.value}</Text>
        </ImageBackground>
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
