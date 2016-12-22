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
	WebView,
} from 'react-native';

import { connect } from 'react-redux'
import * as Actions from './redux/actions'
import * as CONFIGS from './configs/configs';

import Icon from 'react-native-vector-icons/FontAwesome';

import Loading from './loading'

class Comments extends Component
{
	constructor (props)
	{
    	super(props);

		this.state = {
	      	dataSource: new ListView.DataSource({
	        	rowHasChanged: (row1, row2) => row1 !== row2,
	      	})
	    };

		this.page = 1;
  	}

	componentDidMount()
    {
		// 获取评论
		this.props.dispatch( Actions.getComments(this.props.id) );
    }

	// 已加载组件收到新的参数时调用
	componentWillReceiveProps (nextProps)
	{
		console.log(nextProps.comments);
		this.commentsData = nextProps.comments;
	}


	// 生成每条数据显示
	renderItem(data, sectionID, rowID)
	{
		return (
			<View style={styles.coms} key={data.id} >
				<Image
					resizeMode={'cover'}
					source={{uri:data.author_avatar_urls['48']}}
					style={styles.avatar}/>

				<Text>{data.author_name}</Text>
				<Text>{data.date}</Text>
				<Text>{data.content.rendered.replace(/<[^>]+>/g,"")}</Text>
			</View>
		);
	}

	render ()
	{
		if (typeof(this.commentsData) == 'undefined' || this.commentsData.loaded != true) {
			return (
				<Loading />
			)
		}

		return (
      		<ListView
        		initialListSize={10}
        		dataSource={this.state.dataSource.cloneWithRows(this.commentsData.data)}
        		renderRow={this.renderItem.bind(this)}
        		style={styles.listView}
        		onEndReachedThreshold={10}
				//onEndReached={this.onEndReached.bind(this)}
				//renderFooter={this.renderFooter.bind(this)}
      		/>
    	);

	}

}


let styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	flexDirection: 'column'
  	},
	listView: {
    	backgroundColor: '#eeeeec'
  	},
	coms: {},
	avatar: {

	},
});

// 绑定redux数据到this.props
function select(store)
{
	return {
		comments: store.comments,
	}
}

export default connect(select)(Comments);
