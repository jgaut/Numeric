import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, InputText, Dimensions, Image } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import Storage from '@aws-amplify/storage';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import { Constants } from 'expo';
import Swipeable from 'react-native-swipeable-row';

class CreatePage extends Component {

  state = {
    list: [...Array(1)].map((d, index) => ({
      key: `item-${index}`,
      type: "Loading",
      backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
    })),
    isMoving: false,
    isSav: false,
    isEdit: false,
  }

  constructor(...args) {
    super(...args);

    this.props.navigation.addListener('didFocus', () => {
      
      //From listPage
      if(this.props.navigation.state.params.fromKey!=null && this.props.navigation.state.params.fromKey!=''){
        console.log('time to launch!');
        this.launch();
        this.props.navigation.state.params.fromKey=null;
      }else 
      //From edit note
      if(this.props.navigation.state.params.type!=null && this.props.navigation.state.params.type!=''){
        switch(this.props.navigation.state.params.type) {
          case 'note':
            if(!this.props.navigation.state.params.key || this.props.navigation.state.params.key==''){
              this.AddElement('note');
            }else{
              this.MajElement(this.props.navigation.state.params);
            }
            
            break;

          case 'text':
            this.AddElement('text');
            break;

          case 'image':
            this.AddElement('image');
            break;

          default :
            console.log("error with this type : "+ this.props.navigation.state.params.type)
        }
      }
      this.props.navigation.state.params.type=null;
    });

    this.props.navigation.addListener('didBlur', () => {
      console.log('time to sav!');
      this.SavMyData(false);
    });

  }

  componentWillMount(){
    
  }

  launch(){
    console.log("launch ! : "+this.props.navigation.state.params.fromKey);
    var key = this.props.navigation.state.params.fromKey;
    this.state.list = [...Array(1)].map((d, index) => ({
      key: `item-${index}`,
      type: "Loading",
      backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
    }));
    Storage.get(key+'.json', {level: 'private'})
      .then(result => {
        //console.log('get result'+result);

        fetch(result)
          .then(response => response.json())
            .then(data => {
              //console.log("data :" + JSON.stringify(data));
              this.state.data=data;
              var tmp = this.state.data.list.map((d, index) => ({
                                key: `item-${index}`,
                                type: d.type,
                                text: d.text,
                                uri: d.uri,
                                width: d.width,
                                height: d.height,
                              }));
              this.setState({'list': tmp});
              this.forceUpdate(); 
              this.state.isSav=true;
            })
            .catch(error => {console.log(error);
            //console.log('init data');
            this.state.data={'id': key, 'list':[]};
            //console.log('state.data.id : '+JSON.stringify(key));
            this.forceUpdate();
            this.state.isSav=true;
          });
          
      })
      .catch(err => console.log(err));
  }

  SavMyData(e) {
    //console.log('state.data : '+JSON.stringify(this.state.data));
    //console.log('state.data.list : '+JSON.stringify(this.state.data.list));
    //console.log('state.list : '+JSON.stringify(this.state.list));
    //console.log('state.isSav : '+this.state.isSav);
    if(!this.state.isSav && this.state.data && this.state.list){
      this.state.data.list = this.state.list;
      Storage.put(this.state.data.id+".json", JSON.stringify(this.state.data), {
        level: 'private',
        contentType: 'text/plain'
      })
      .then (result => {/*console.log(result);*/ this.setState({isSav:true}); if(e){this.launch();}})
      .catch(err => console.log(err));
    }
  }

  AddElement(type) {

    if(!this.state.data.list){
      this.state.data.list=[];
    }

    switch (type) {
      case 'note':
        this.state.data.list.push({"type":"note", "text":this.props.navigation.state.params.text});
        console.log('add note');
        break;
      case 'text':
        this.state.data.list.push({"type":"text", "text":this.props.navigation.state.params.text});
        console.log('add text');
        break;
      case 'image':
        var d=this.props.navigation.state.params.data
        this.state.data.list.push({"type":"image", "uri":d.uri, "height":d.height, "width":d.width});
        console.log('add image');
        break;
      default:
        console.log('Sorry, we are out of ' + type + '.');
    }

    var tmp = this.state.data.list.map((d, index) => ({
                                key: `item-${index}`,
                                type: d.type,
                                text: d.text,
                                uri: d.uri,
                                width: d.width,
                                height: d.height,
                              }));
    this.setState({'list': tmp});
    //console.log(JSON.stringify(tmp));

    //unsave
    this.setState({isSav:false});
    
    //force to refresh
    this.forceUpdate();
  }

  MajElement(obj) {

    if(obj.type=='note' || obj.type=='text') {
    
      this.state.list.forEach(function(element) {
        //console.log(element);
        if(element.key == obj.key){
          element.text = obj.text;
        }
      });
    }
    
    //unsave
    this.setState({isSav:false});
    
    //force to refresh
    this.forceUpdate();
  }

  DelElement(key) {
      var tmp=[];
      this.state.list.forEach(function(element) {
        //console.log(element);
        if(element.key != key){
          tmp.push(element);
        }
      });
    
      this.setState({'list': tmp});
    //unsave
    this.setState({isSav:false});
    
    //force to refresh
    //this.forceUpdate();
  }

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    //console.log("item : " +item);
    //console.log("item : " +item.text||item.uri);
    //console.log("compo : " +JSON.stringify(this.state.isMoving));

    const {navigate} = this.props.navigation;

    if(item.type=="text" || item.type=='note'){
        var key = item.key;
        var text = item.text;
          return (
          <Swipeable 
          leftContent={(
        <View style={[styles.leftSwipeItem, {backgroundColor: 'lightskyblue', flex:1}]}>
          <Text>Delete</Text>
        </View>
      )}
            leftActionActivationDistance={50}
            onLeftActionRelease={this.DelElement(key)}
            style={this.state.isMoving ? styles.MovingBlock : styles.nothing}
            onLongPress={()=>{console.log("onLongPress!");if(this.state.isMoving){move();}else{navigate('EditNote', {'type': 'text', 'key':key, 'text':text})}}}
            onPressOut={()=>{console.log("onPressOut!");if(this.state.isMoving){moveEnd();}}}
          >
            <Text 
              style={this.state.isMoving ? styles.nothing : item.type=='note'? styles.note : styles.text}
              key={Math.random()} 
            >
              {item.text}
            </Text>

          </Swipeable>
        );
}else if(item.type='image'){

        return (
          <TouchableOpacity
            //style={} 
            style={this.state.isMoving ? styles.MovingBlock : styles.nothing}
            onLongPress={()=>{console.log("onLongPress!");if(this.state.isMoving){move();}}}
            onPressOut={()=>{console.log("onPressOut!");if(this.state.isMoving){moveEnd();}}}
          >
            <Image 
            style={this.state.isMoving ? styles.nothing : {width: Dimensions.get('window').width, height: Math.min((item.height * Dimensions.get('window').width / item.width), item.height) || 100}}
            //style={this.state.isMoving ? styles.nothing : styles.nothing}
              key={Math.random()} 
              source={{uri: item.uri}} 
            />

          </TouchableOpacity>
        );
}else{
          console.log('Sorry, we are out of ' + item.type + '.');
  }
}

  render() {

    const {navigate} = this.props.navigation;

    return (
      <View style={styles.container}>

        <DraggableFlatList
          data={this.state.list}
          renderItem={( item, index, move, moveEnd, isActive ) => this.renderItem(item, index, move, moveEnd, isActive)}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          scrollPercent={5}
          onMoveEnd={({ data }) => {this.setState({'list': data}); this.setState({'isSav': false});}}
        />


        <View style={styles.submitButton}>
          
          <TouchableOpacity key={Math.random()} onPress={() => {navigate('EditNote')}}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add note</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity key={Math.random()} onPress={() => {navigate('EditText')}}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add text</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity key={Math.random()} onPress={() => {navigate('Roll'); console.log('go to roll');}}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add image</Text>
            </View>
          </TouchableOpacity>
        
          <TouchableOpacity key={Math.random()} onPress={() => {console.log("onPressButton");this.setState({'isMoving':this.state.isMoving?false:true});}}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{this.state.isMoving?"End move":"Start move"}</Text>
            </View>
          </TouchableOpacity>

        </View>


      </View>
    )
  }
}

const styles = StyleSheet.create({
button: {
  padding:5,
  margin:5,
  height: 40,
  backgroundColor: '#2196F3',
  alignItems: 'stretch',
  justifyContent: 'center',
    },
  buttonText: {
    color: 'white'
  },
container: {
    backgroundColor: '#f5fcff',
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  nothing: {
  },
  MovingBlock: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555' 
  },
  note: {
    padding:5,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555' 
  },
  text: {
    padding:5,
    height: 150,
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#555' 
  },
  submitButton: {
    position: 'absolute',
    bottom:0,
    left:0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editMode: {
    position: 'absolute',
    flex: 1,
  },
});

export default CreatePage