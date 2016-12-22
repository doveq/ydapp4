'use strict';

import React, { Component } from 'react';
import {
  	StyleSheet,
  	Text,
  	View
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class Loading extends Component
{
	render ()
	{
		return(
			<View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
              	<Text style={{fontSize: 18, textAlign: 'center',}} ><Icon name="paper-plane-o" size={20} />  正在努力加载 </Text>
          	</View>
		);
	}
}
