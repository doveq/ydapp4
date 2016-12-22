'use strict';

/**
   左侧滑动菜单
*/

import React, { Component } from 'react';
import {
  	StyleSheet,
  	Text,
  	TouchableOpacity,
  	View,
	AsyncStorage,
} from 'react-native';

import { connect } from 'react-redux'
import * as Actions from './redux/actions'
import * as CONFIGS from './configs/configs';

import Loading from './loading'

import Icon from 'react-native-vector-icons/FontAwesome';

export default class sideMenu extends Component
{
	constructor (props) {
    	super(props);

		this.state = {
            isLogin: false,
            username: null,
        };
  	}

	// 在初始化渲染执行之后立刻调用一次
    componentDidMount()
    {
        this.auth();
    }

	async auth()
    {
        // 查看用户是否已经登录
        let user = await AsyncStorage.getItem('user');
        if (user != null) {
            user = JSON.parse(user);
            this.setState({
                isLogin: true,
                username: user.username,
            });
        }
    }

	async onLogout()
    {
        await AsyncStorage.removeItem('user');
        this.setState({
            isLogin: false,
            username: null,
        });
    }

	render ()
	{
		let login =  <View style={styles.item} key={9998} >
                <TouchableOpacity onPress={() => this.props.navigator.push({name:'loginPage'})} >
                <Text style={styles.itemStr}>
                    <Icon name="sign-in" size={18} color="#fff" />     {'登录'}
                </Text>
                </TouchableOpacity>
            </View>;

        let reg =  <View style={styles.item} key={9999} >
                <TouchableOpacity onPress={() => this.props.navigator.push({name:'registerPage'})} >
                <Text style={styles.itemStr}>
                    <Icon name="user-plus" size={18} color="#fff" />    {'注册'}
                </Text>
                </TouchableOpacity>
            </View>;

		let uinfo = null;
        let logout = null;

        if (this.state.isLogin) {
            login = null;
            reg = null;
            uinfo = <View style={styles.item} key={9997} >
                      <Text style={styles.itemStr}>
                          <Icon name="user" size={18} color="#fff" />    {this.state.username}
                      </Text>
                    </View>;

            logout = <View style={styles.item} key={9996} >
                      <TouchableOpacity onPress={() => this.onLogout()} >
                      <Text style={styles.itemStr}>
                          <Icon name="sign-out" size={18} color="#fff" />    {'退出登录'}
                      </Text>
                      </TouchableOpacity>
                    </View>;
        }

		return (
			<View style={styles.container}>
				<View key={9995}>
					<TouchableOpacity onPress={this.props.closeDrawer}  style={{paddingBottom:15,paddingTop:15,paddingLeft:15,paddingRight:15,}}>
						<Text style={{textAlign:"right",}}><Icon name="chevron-right" size={18} color="#fff" /></Text>
					</TouchableOpacity>
				</View>

				<View style={styles.item} key={1} >
					<TouchableOpacity  onPress={ () => this.props.navigator.push({name:'homePage'}) } >
					<Text style={styles.itemStr}>
						<Icon name="ellipsis-h" size={18} color="#fff" />     首页
					</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.item} key={2} >
					<TouchableOpacity  onPress={ () => this.props.navigator.push({name:'categoryPage'}) } >
					<Text style={styles.itemStr}>
						<Icon name="ellipsis-h" size={18} color="#fff" />     栏目专题
					</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.item} key={1} >
					<TouchableOpacity  onPress={ () => this.props.navigator.push({name:'searchPage'}) } >
					<Text style={styles.itemStr}>
						<Icon name="ellipsis-h" size={18} color="#fff" />     搜索
					</Text>
					</TouchableOpacity>
				</View>

				<View style={{marginTop:20,}}></View>

				{login}
				{reg}
				{uinfo}
				{logout}

			</View>

		);
	}

}

let styles = StyleSheet.create({
  	container: {
    	flex: 1,
    	flexDirection: 'column',
		backgroundColor: '#292C35',
  	},
	item: {
	    paddingTop: 10,
	    paddingBottom: 10,
	    paddingLeft: 10,
	    marginLeft:10,
	    marginRight:10,
	    borderStyle: 'solid',
	    borderBottomWidth: 0.3,
	    borderBottomColor: '#626B76',
	},
	itemStr: {
		fontSize: 18,
	    color:'#fff',
	    textAlign:'left',
	},
});
