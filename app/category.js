'use strict';

import React, { Component } from 'react';
import {
  	StyleSheet,
  	ScrollView,
  	Text,
  	TouchableOpacity,
  	View
} from 'react-native';

import { connect } from 'react-redux'
import * as Actions from './redux/actions'
import * as CONFIGS from './configs/configs';

import Loading from './loading'
import ArticleList from './articleList'

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

class Category extends Component
{

	constructor (props) {
    	super(props);
  	}

	componentDidMount()
    {
		// 获取分类数据
		this.props.dispatch( Actions.getCategory() );
    }

	// 已加载组件收到新的参数时调用
	componentWillReceiveProps (nextProps)
	{
		//console.log(nextProps.category);
		this.categoryData = nextProps.category;
	}

	render ()
	{
		// 如果分类数据没有加载完
		if (typeof(this.categoryData) == 'undefined' || this.categoryData.loaded != true) {
			return (
				<Loading />
			)
		}

		return (
			<View style={styles.container}>
				<View style={styles.topnav}>
					<TouchableOpacity style={styles.navleft} onPress={() => this.props.navigator.pop()} ><Icon name="arrow-left" size={24} color="#fff" /></TouchableOpacity>
					<Text style={styles.navtit}>栏目</Text>
					<TouchableOpacity style={styles.navright} onPress={() => this.props.navigator.push({name:'searchPage'})}><Icon name="search" size={24} color="#fff" /></TouchableOpacity>
				</View>
				<ScrollableTabView
					tabBarBackgroundColor="#fff"
					tabBarUnderlineColor="#C4AD7D"
					tabBarActiveTextColor="#C4AD7D"
					tabBarInactiveTextColor="#888"
					renderTabBar={() => <ScrollableTabBar />} >
					{
						this.categoryData.data.map((itme) => {
							return (
								<ArticleList tabLabel={itme.title} key={itme.id} url={CONFIGS.CATEGORY_CONTENT_API + itme.id} navigator={this.props.navigator} />
							);
						})
					}

			    </ScrollableTabView>
	        </View>
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
      marginTop:15
  },
});


// 绑定redux数据到this.props
function select(store)
{
	return {
		category: store.category,
	}
}

export default connect(select)(Category);
