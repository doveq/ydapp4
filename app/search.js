'use strict';

import React, { Component } from 'react';
import {
  	StyleSheet,
  	Text,
  	TouchableOpacity,
  	View,
	Dimensions,
	ListView,
	RefreshControl,
	Image,
	TextInput,
} from 'react-native';

import { connect } from 'react-redux'
import * as Actions from './redux/actions'
import * as CONFIGS from './configs/configs';

import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from './loading'

export default class Search extends Component
{
	constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

		this.state = {
            keys: '',
        };
    }


	onSearch()
	{
		this.navigator.push({name:'homePage', params: {search: this.state.keys}, });
	}

	render()
    {
		return (
            <View style={styles.container}>

				<View style={styles.topnav}>
					<TouchableOpacity style={styles.navleft} onPress={() => this.navigator.pop()} ><Icon name="chevron-left" size={24} color="#fff" /></TouchableOpacity>
					<Text style={styles.navtit}>搜索</Text>
				</View>

                <View style={styles.item}>
					<View style={styles.bdr}>
                    <TextInput
                        style={{height: 40, borderColor: '#000000',}}
                        placeholder='搜索'
                        onChangeText={(text) => this.setState({keys: text})}
                        value={this.state.name}
                        autoCapitalize='none'
                        maxLength={12}
						underlineColorAndroid = 'transparent'
						selectionColor= '#292C35'
                    />
					</View>
                </View>

				<View style={{backgroundColor: '#000000',borderRadius:5, padding:10,marginTop:20,marginLeft:20,marginRight:20,}}>
                    <TouchableOpacity onPress={() => this.onSearch()} >
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>搜索</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
	}
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
	item: {
        paddingTop:20,
		paddingLeft:20,
		paddingRight:20,
    },
	topnav: {
      	backgroundColor: '#292C35',
      	height:48,
      	justifyContent: 'center',
      	alignItems: 'center',
  	},
	navleft: {
      position: 'absolute',
	  left: 0,
	  top: 0,
	  paddingLeft:15,
	  paddingTop:12,
	  paddingBottom:12,
	  paddingRight:15,
  },
  navright: {
      position: 'absolute',
      right:0,
      top: 0,
	  paddingLeft:15,
	  paddingTop:12,
	  paddingBottom:12,
	  paddingRight:15,
  },
  navtit: {
      flex:1,
      color: '#fff',
      fontSize: 20,
      textAlign: 'center',
      marginTop:15,
  },
  bdr: {
	  borderBottomColor: '#292C35',
	  borderBottomWidth: 1,
  },
});
