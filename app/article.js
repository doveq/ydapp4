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
	TextInput,
	AsyncStorage,
	Alert,
  Platform,
  ScrollView,
} from 'react-native';

import { connect } from 'react-redux'
import * as Actions from './redux/actions'
import * as CONFIGS from './configs/configs';

import Icon from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Loading from './loading'
import Comments from './comments'

var DEVICE_WIDTH = Dimensions.get('window').width;
var DEVICE_HEIGHT = Dimensions.get('window').height;

class Article extends Component
{
	constructor (props) {
    	super(props);

		this.state = {
	      	inputHeight: 0,
			inputText: '',
			isSubmit: false,

	    };

		this.user = null;
		this.url = CONFIGS.ARTICLE_CONTENT_API + this.props.id;
  	}

	componentDidMount()
    {
		this.auth();
    }

	// 已加载组件收到新的参数时调用
	componentWillReceiveProps (nextProps)
	{
		this.articleData = nextProps.article;
	}

	async auth()
    {
        // 查看用户是否已经登录
        let user = await AsyncStorage.getItem('user');
        if (user != null) {
            this.user = JSON.parse(user);
        }
    }

	// 提交评论
	postComms()
	{
		// 不能重复提交
		if (this.state.isSubmit) {
			return;
		}

		if (this.user == null) {
            Alert.alert(
                "用户注册登录后才能发表评论",
                null,
                [{text: '确定'},]);

            return;
        }

        if (this.state.inputText.length <= 0) {
            Alert.alert(
                "请填写评论内容",
                null,
                [{text: '确定'},]);

            return;
        }

		//console.log(this.user);
        this.setState({ isSubmit:true, });

        let url = "http://112.124.18.75/ydjr/api/user/post_comment/?insecure=cool&comment_status=1"
              +"&post_id=" + this.props.id
              +"&cookie="+ this.user.cookie
              +"&content="+ this.state.inputText;

        url = "http://112.124.18.75/ydjr/api/respond/submit_comment/?post_id=" + this.props.id
          + "&name=" + this.user.username
          + "&email=" + this.user.email
          + "&content=" + this.state.inputText;

        console.log(url);

        fetch(encodeURI(url))
            .then((response) => response.json())
            .then((data) => {
                this.setState({ isSubmit:false, });
				console.log(data);
                if (data.status == 'ok') {
                    Alert.alert(
                        "评论成功",
                        null,
                        [{text: '确定'},]);

					// 跳转刷新当前页面
					this.props.navigator.push({
			            name: 'articlePage',
			            params: {id: this.props.id},
			        });
                } else {
                    Alert.alert(
                        "评论提交失败",
                        null,
                        [{text: '确定'},]);
                }
            })
            .catch((error) => {
                console.warn(error);
                this.setState({ isSubmit:false, });
            });
	}


	render ()
	{
		//let url = CONFIGS.ARTICLE_CONTENT_API + this.props.id;

		return (
			<View style={styles.container} >
				<View style={styles.topnav}>
					<TouchableOpacity style={styles.navleft} onPress={() => this.props.navigator.pop()} ><Icon name="arrow-left" size={24} color="#fff" /></TouchableOpacity>
					<Text style={styles.navtit}></Text>
					<TouchableOpacity style={styles.navleft} onPress={() => this.props.navigator.pop()} ><Icon name="arrow-left" size={24} color="#fff" /></TouchableOpacity>
				</View>

				<WebView
                  automaticallyAdjustContentInsets={false}
                  style={{flex: 1}}
                  source={{uri: this.url}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  decelerationRate="normal"
                  scalesPageToFit={false}
				  startInLoadingState={true}
                />

				<View ref='inputView' style={{flexDirection: 'row', paddingLeft:10, paddingTop:15, paddingRight:10, paddingBottom:15,borderColor: '#dfdfdf', borderTopWidth: 1,}}>
					<View style={{ borderColor: '#dfdfdf', borderWidth: 1,flex:1,}}>
					   <TextInput style={{backgroundColor: '#f7f7f7', height:38,}}
					   		multiline={true}
							onChange={(event) => {
								this.setState({
						            inputText: event.nativeEvent.text,
						            inputHeight: event.nativeEvent.contentSize.height,
						         });
							 }}
					   		value={this.state.inputText}
							placeholder="伟大的言论从你开始..."
							underlineColorAndroid = 'transparent'
							selectionColor= '#292C35'
						/>
					</View>

					<TouchableOpacity onPress={() => this.postComms()} >
						<Text style={{backgroundColor:'#292C35',color:'#fff',width:50, height:40,paddingTop:10,marginLeft:10,textAlign:'center',borderRadius:5,}}>发表</Text>
					</TouchableOpacity>
				</View>

        <KeyboardSpacer/>

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
      marginTop:10,
  },
});

// 绑定redux数据到this.props
function select(store)
{
	return {
		article: store.article,
	}
}

export default connect(select)(Article);
