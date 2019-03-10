import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';

class Roll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0,
      selected: [],
    };

    this.getSelectedImages = this.getSelectedImages.bind(this);
  }

  getSelectedImages(images, current) {
    var num = images.length;

    this.setState({
      num: num,
      selected: images,
    });
    const {navigate} = this.props.navigation;
    //console.log(current);
    //console.log(this.state.selected);
    navigate('Create Page', {'type':'image', 'data':current});
    this.state.selected=[];
  }

  render() {
    return (
      <View style={styles.container}>
        <CameraRollPicker
          groupTypes='SavedPhotos'
          maximum={1}
          selected={this.state.selected}
          assetType='Photos'
          imagesPerRow={3}
          imageMargin={5}
          callback={this.getSelectedImages} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#F6AE2D',
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
  },
});

export default Roll;
