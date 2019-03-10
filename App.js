import React from 'react';
import { View, Text } from 'react-native';
import awsconfig from './aws-exports';
import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import SignInUpScreen from './views/SignInUp';
import SignUpConfirmScreen from './views/SignUpConfirm';
import AppAuthScreen from './AppAuth';
import ExampleScreen from './views/Example';
import RollScreen from './views/Camerarollpicker';
import EditNoteScreen from './views/EditNote';
import EditTextScreen from './views/EditText';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
Storage.configure(awsconfig);

class AppScreen extends React.Component {

  constructor(...args) {
      super(...args);
      this.props.navigation.addListener('didFocus', () => {
        this.launch();
      });
    }
  
  static navigationOptions = {
    header: null
  };

  updateText = () => {
  /*  Auth.signIn(this.state.email, this.state.password).then(user => console.log(user)).catch(err => console.log(err));*/
  }

  componentWillMount(){

  }

  launch(){
    const {navigate} = this.props.navigation;
    Auth.currentAuthenticatedUser({bypassCache: false})
      .then((user) => {
        console.log(user);
        navigate('AppAuth', {user: user.attributes.email});
        }
      ).catch((err) => {
        console.log(err);
        navigate('SignInUp');
        }
      );
  }

  render() {
    return (
     <View>{this.launch()}</View>
    );
  }
}

const AppNavigator = createStackNavigator({
  App: {screen: AppScreen},
  SignInUp: {screen: SignInUpScreen},
  SignUpConfirm: {screen: SignUpConfirmScreen},
  AppAuth: {screen: AppAuthScreen},
  Roll: {screen: RollScreen},
  Example: {screen: ExampleScreen},
  EditNote: {screen: EditNoteScreen},
  EditText: {screen: EditTextScreen},
},
{
    headerMode: 'none'}
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
