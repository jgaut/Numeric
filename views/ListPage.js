import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Storage from '@aws-amplify/storage';
import { Constants } from 'expo';

const numColumns = 2;

class ListPageScreen extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {data: {"list":[]}, max:8, min:0};
    this.ListAllElement();
    //console.log('taille : '+Dimensions.get('window').width / numColumns);
    
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
    Storage.list('numeric/indicateurs/numeric_', {level: 'public'})
    .then(result => {
      //console.log('data from S3' +JSON.stringify(result));
      taille=result.length;
      //console.log('taille:'+taille);
      result.forEach(item=>{
        
        if(item.key.match(regex)){
          //tmp.push(item);
          //console.log(item);
          //this.forceUpdate();
          Storage.get(item.key, {level: 'public'})
            .then(result => {
              fetch(result)
                .then(response => response.json())
                  .then(data => {
                    //console.log(data);
                    //Find image background
                    var tmp2 = data[0];
                    //console.log('================>'+JSON.stringify(tmp2));
                    var regex = /\.json/gi;
                    var image = item.key.replace(regex, ".jpg")

                    regex = /indicateurs/gi;
                    image = image.replace(regex, "images");

                    //console.log("key image : "+image);
                    Storage.get(image, {level: 'public'}).then(result => {
                      fetch(result).then(response => {
                        //console.log(response.url);
                        tmp2.uri=response.url;
                        tmp2.key=Math.random();
                        tmp.push(tmp2);
                        //console.log(data.uri);
                        //console.log(data.key);
                        cpt++;
                        if(cpt==taille){
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
    //console.log('item::'+JSON.stringify(parseInt(item.fontSize,10)));
    var styleText=[{}];
    var styleImage=[{}];
    var regexText = /style_text_.*/g;
    var regexImage = /style_image_.*/g;

    for (var obj in item) {
      if(obj.match(regexText)){
        var tmp = obj.replace("style_text_", "");
        styleText.push({tmp:item[obj]});
        console.log(styleText);
      } else if(obj.match(regexImage)) {
        var tmp = obj.replace("style_image_", "");
        styleImage.push({tmp:item[obj]});
        console.log(styleImage);
      } else {
        //console.log(obj+" => "+item[obj]);
      }
    }

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }else if(item.type='number'){
      return (
        <TouchableOpacity
          key={Math.random()}
          style={styles.item}
        >
          <ImageBackground source={{uri: item.uri}} style={styles.item, {width: '100%', height: '100%', position: "absolute"},{opacity: item.opacity}}/>
          <Text style={{flex:1, textAlign: 'center', textAlignVertical: 'center', position: 'absolute'},{color: item.color, fontSize: parseInt(item.fontSize,10)}}>{item.value}</Text>
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
    backgroundColor: 'transparent',
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
    flex:1,
    textAlign: 'center', 
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 30,
  },
});

export default ListPageScreen;
