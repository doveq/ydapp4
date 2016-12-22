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
} from 'react-native';

import { connect } from 'react-redux'
import * as Actions from './redux/actions'
import * as CONFIGS from './configs/configs';

import Loading from './loading'

var DEVICE_WIDTH = Dimensions.get('window').width;

class ArticleList extends Component
{
	constructor (props) {
    	super(props);

		this.state = {
	      	dataSource: new ListView.DataSource({
	        	rowHasChanged: (row1, row2) => row1 !== row2,
	      	})
	    };

		this.articleListData = [];
		//this.url = CONFIGS.CATEGORY_CONTENT_API + this.props.id;
		this.url = this.props.url;
		this.page = 1;

		// 是否显示分类标签
		if (typeof(this.props.isShowCaty) != 'undefined' && this.props.isShowCaty == true)
			this.isShowCaty = true;
		else
			this.isShowCaty = false;
  	}

	componentDidMount()
    {
		// 显示搜索
		this.props.dispatch( Actions.getArticleList(this.url) );
    }

	// 已加载组件收到新的参数时调用
	componentWillReceiveProps (nextProps)
	{
		//console.log(nextProps.articleList);
		this.articleListData = nextProps.articleList;
	}

	// 进入详情页
    onPostButton(id)
    {
        this.props.navigator.push({
            name: 'articlePage',
            params: {id: id},
        });
    }

	// 生成每条数据显示
	renderItem(data, sectionID, rowID)
	{
		// 如果设置了特殊图片,则按图片显示
        if (data.thumbnail_images != null) {

			let tag = null;
			if (this.isShowCaty && typeof(data.categories[0]) != 'undefined') {
				tag = <View style={styles.imgItemTag} ><Text style={styles.imgTagTxt} >{data.categories[0].title}</Text></View>
			}

            return (
				<TouchableOpacity onPress={() => this.onPostButton(data.id)} >
                <View style={styles.imgItem} key={data.id} >
                    <Image
                        resizeMode={'cover'}
                        source={{uri:data.thumbnail_images.full.url}}
                        style={styles.imgItemThumb}/>

					{tag}
                    <View style={styles.imgItemTit} >
						<Text style={styles.imgItemTxt} numberOfLines={20} >{data.title}</Text>
					</View>
                </View>
				</TouchableOpacity>
            );
        } else {
            // 按标题显示
            return (
				<TouchableOpacity onPress={() => this.onPostButton(data.id)} >
                <View style={styles.strItem} key={data.id}>
                    <Text key={'post' + data.id} style={styles.strItemTit} numberOfLines={20}>{data.title}</Text>
                </View>
				</TouchableOpacity>
            );
        }
	}

	// 瀑布流刷新调用
	onEndReached ()
	{
	    if (typeof(this.articleListData[this.url]) != 'undefined' && this.articleListData[this.url].loaded == true && this.articleListData[this.url].isMore == true) {
			//this.setState({isRefreshing: true});
			// 获取分类文章列表
			this.page = this.page +1;
			this.props.dispatch( Actions.getArticleList(this.url, this.page) );
		}
  	}

	renderFooter () {
	    if (typeof(this.articleListData[this.url]) != 'undefined' && this.articleListData[this.url].loading == true ) {
	      	return (
	        	<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
	          		<Text style={{textAlign: 'center', fontSize: 16}}>加载中…</Text>
			  	</View>
	      	);
	    }
	}

	render ()
	{
		// 如果分类数据没有加载完
		if (typeof(this.articleListData[this.url]) == 'undefined' || this.articleListData[this.url].loaded != true) {
			return (
				<Loading />
			)
		}

		return (
      		<ListView
        		initialListSize={10}
        		dataSource={this.state.dataSource.cloneWithRows(this.articleListData[this.url].data)}
        		renderRow={this.renderItem.bind(this)}
        		style={styles.listView}
        		onEndReachedThreshold={10}
				onEndReached={this.onEndReached.bind(this)}
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
	imgItemThumb: {
      	width: DEVICE_WIDTH,
      	height: 200,
  	},
  	imgItemTit: {
      	position: 'absolute',
      	bottom: 20,
      	left:0,
		paddingLeft:15,
		paddingRight:15,
  	},
	imgItemTxt: {
		fontSize: 17,
		color: '#fff',
      	textAlign: 'left',
		fontWeight: "600",
		textShadowOffset: {width: 1.5, height: 1},
		textShadowRadius: 1,
		textShadowColor: '#000000',
		backgroundColor: 'transparent',
	},
	imgItemTag: {
		position: 'absolute',
      	bottom: 47,
      	left:15,
		backgroundColor: '#fff',
		paddingLeft:5,
		paddingRight:5,
		paddingTop:3,
		paddingBottom:3,
	},
	imgTagTxt: {
		color: '#4A4A4A',
		fontSize: 14,
		textAlign: 'left',
	},
  	strItem: {
      	borderStyle: 'solid',
      	borderBottomWidth: 0.3,
      	borderBottomColor: '#CECECE',
      	flex: 1,
      	justifyContent: 'center',
      	height: 70,
      	paddingLeft: 15,
      	paddingRight: 15,
  	},
  	strItemTit: {
      	textAlign: 'left',
      	fontSize: 16,
      	fontWeight: "400",
      	color: '#333333',
  	},
});

// 绑定redux数据到this.props
function select(store)
{
	return {
		articleList: store.articleList,
	}
}

export default connect(select)(ArticleList);
