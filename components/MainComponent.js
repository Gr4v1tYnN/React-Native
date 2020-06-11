import React, { Component } from 'react';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import { View, Platform } from 'react-native';
import { DISHES } from '../shared/dishes';
import { createStackNavigator } from 'react-navigation';

const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu},
    Dishdetail: { screen: Dishdetail }
}, {
    initialRouterName: 'Menu',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        }
    }
});

class Main extends Component {

  render() {
 
    return (
        <View style={{flex:1, paddintTop: Platform.OS === 'ios' ? 0 : 1}}>
            <MenuNavigator />
        </View>
    );
  }
}
  
export default Main;