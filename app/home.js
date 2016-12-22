'use strict';

/**
   显示所有的文章列表
*/

import React, { Component } from 'react';
import {
  	StyleSheet,
  	ScrollView,
  	Text,
  	TouchableOpacity,
  	View,
	StatusBar,
} from 'react-native';

import { connect } from 'react-redux';
import * as Actions from './redux/actions';
import * as CONFIGS from './configs/configs';

import Loading from './loading';
import ArticleList from './articleList';
import SideMenu from './sideMenu';

import Icon from 'react-native-vector-icons/FontAwesome';
import Drawer from 'react-native-drawer';

export default class Home extends Component
{

	constructor (props) {
    	super(props);
  	}

	componentDidMount()
    {

    }

	// 已加载组件收到新的参数时调用
	componentWillReceiveProps (nextProps)
	{

	}

	render ()
	{
		console.log(this.props.search);
		let aurl = CONFIGS.HOME_LIST_API;
		if (this.props.search) {
			// 如果是搜索则调用显示搜索数据
			aurl = CONFIGS.SEARCH_ARTICLE_API + this.props.search;
		}

		return (
			<Drawer
				ref={c => this.drawer = c}
			  	type="static"
			  	content={<SideMenu navigator={this.props.navigator} closeDrawer={() => {this.drawer.close()}} />}
			  	openDrawerOffset={(viewport) => viewport.width - 200}
			  	styles={styles.drawer}
			  	tweenHandler={Drawer.tweenPresets.parallax}
				open={false}
				>
				<StatusBar hidden={true} />

					<View style={styles.container}>
						<View style={styles.topnav}>
							<TouchableOpacity style={styles.navleft} onPress={() => this.drawer.open(true)} ><Icon name="ellipsis-v" size={24} color="#fff" /></TouchableOpacity>
							<Text style={styles.navtit}>能源评论</Text>
							<TouchableOpacity style={styles.navright} onPress={() => this.props.navigator.push({name:'searchPage'})}><Icon name="search" size={24} color="#fff" /></TouchableOpacity>
						</View>

						<ArticleList url={aurl} navigator={this.props.navigator} isShowCaty={true} />
			        </View>

			</Drawer>
		);
	}
}

let styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	flexDirection: 'column'
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
  drawer: {
	  shadowColor: '#000000',
	  shadowOpacity: 0.8,
	  shadowRadius: 3,
  },
});
