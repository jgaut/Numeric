import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ImageBackground } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Storage from '@aws-amplify/storage';
import { Constants } from 'expo';
import TimerMixin from 'react-timer-mixin';

const numColumns = 3;

class ListPageScreen extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {data: {"list":[]}, max:8, min:0};
    this.ListAllElement();
    //console.log('taille : '+Dimensions.get('window').width / numColumns);
    this.props.navigation.addListener('didFocus', () => {
      this.timer = setInterval(() => {
        console.log('Reload !');
        var myKey="numeric/indicateurs/numeric_btc_euro.json";
        var oldElement;
        for (var i=0; i<this.state.data.list.length; i++) {
          if(myKey == this.state.data.list[i].key){
            oldElement=this.state.data.list[i];
          }
        }
        console.log("ancien élément : " + JSON.stringify(oldElement));
        //this.ListAllElement();
      }, 10000);
    });
    this.props.navigation.addListener('didBlur', () => {
      clearTimeout(this.timer);
    });
  }

  ListAllElement = () => {
    for(let i=this.state.min; i<=this.state.max; i++){
      let item = {key:i};
      this.state.data.list.push(item);
    }

    var regex = /numeric_.*\.json/g;
    var tmp = [];
    var taille=0;
    var cpt=0;

    //Liste de tous les indicateurs
    Storage.list('numeric/indicateurs/numeric_', {level: 'public'})
    .then(result => {
      console.log('data from S3' +JSON.stringify(result));
      taille=result.length;
      //console.log('taille:'+taille);

      //Pour chaque indicateur
      result.forEach(item=>{
        
        //S'il respecte le format du fichier
        if(item.key.match(regex)){
          //tmp.push(item);
          //console.log(item);
          //this.forceUpdate();

          //Recherche d'un élément déjà présent
          var myKey=item.key;
          var oldElement=this.state.data.list.find(function(element, myKey) {return element.key == myKey;});
          console.log("ancien élément : " + JSON.stringify(oldElement));

          //Si l'indicateur a été mis à jour.
          //if(item.lastModified != )
          
          //Récupération de l'élément
          Storage.get(item.key, {level: 'public'})
            .then(result => {
              fetch(result)
                .then(response => response.json())
                  .then(data => {
                    //console.log(data);
                    //Find image background
                    var tmp2 = data[0];
                    Storage.get('numeric/images/'+tmp2.image_src, {level: 'public'}).then(result => {
                      fetch(result).then(response => {
                        //console.log(response.url);
                        tmp2.uri=response.url;
                        tmp2.key=item.key;
                        tmp2.lastModified=item.lastModified;
                        tmp.push(tmp2);
                        console.log(tmp2);
                        //console.log(data.key);
                        cpt++;
                        if(cpt==taille){
                          this.state.data.list=tmp;
                          this.forceUpdate();
                          console.log("tmp :"+JSON.stringify(tmp));
                          console.log('Update view !');
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
    var styleText={};
    var styleImage={};
    var regexText = /style_text_.*/g;
    var regexImage = /style_image_.*/g;

    for (var obj in item) {
      if(obj.match(regexText)){
        var tmp = obj.replace("style_text_", "");
        styleText[tmp]=parseFloat(item[obj],10)||parseInt(item[obj])||item[obj];
        //console.log(styleText);
      } else if(obj.match(regexImage)) {
        var tmp = obj.replace("style_image_", "");
        styleImage[tmp]=parseFloat(item[obj],10)||parseInt(item[obj])||item[obj];
        //console.log(styleImage);
      } else {
        //console.log(obj+" => "+item[obj]);
      }
    }

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    } else if(item.type='number') {
      return (
        <TouchableOpacity
          key={Math.random()}
          style={styles.item}
        >
          <ImageBackground 
            source={{uri: item.uri}} 
            style={[styles.image,styleImage]}
            imageStyle={{ borderRadius: 5 }}
          />
          <Text style={[styles.text,styleText]} multiline={true}>{item.value}</Text>
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
  image: {
    width:'100%',
    height:'100%',
    position:'absolute',
  },
  text: {
    flex:1,
    textAlign:'center',
    textAlignVertical:'center',
    position: 'absolute',
  },
});

export default ListPageScreen;
