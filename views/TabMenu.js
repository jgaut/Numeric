import React from 'react';
import { Platform, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {createAppContainer, createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import HomeScreen from './Home';
import ListPageScreen from './ListPage';
import Image from 'react-native-remote-svg'

class TabMenuScreen extends React.Component {

  constructor() {
    super();
  }

  componentWillMount(){
  }

  render() {
    return (
      <View>
        <MyTab/>
      </View>
    );
  }
}

const MyTabNavigator = createBottomTabNavigator({
  'Liste': {
    screen: ListPageScreen,
    navigationOptions: ({navigation}) => ({
      drawerLockMode: 'locked-closed',
      tabBarLabel: () => {},
      tabBarIcon: ({ tintColor }) => (<Text>Liste</Text>)
    }),
  },
  'Menu': {
    screen: () => {},
    navigationOptions: () => ({
      tabBarLabel: () => {},
      tabBarIcon: ({}) => (<Text>Menu</Text>), 
      tabBarOnPress: (...props) => {props[0].navigation.openDrawer();},
    }),
  },
}, 
{
  navigationOptions: {
    headerMode: 'none'
  },
  tabBarOptions: {
      inactiveBackgroundColor: 'white',
      style: {
        height:50,
        padding:0,
        margin:0,
        border:0,

      },
      tabStyle: {
        padding:0,
        margin:0,

      },
      labelStyle: {
        padding:0,
        margin:0,
      },
    },
});

const styles = StyleSheet.create({
  barbouton: {
    height: 40,
    width: 40, 
    padding: 0,
    margin:0,
  },
});

const MyTab = createAppContainer(MyTabNavigator);

export default MyTab;

//this.props.navigation.navigate('DrawerOpen');