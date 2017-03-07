/*
    启动图片展示页面
*/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

        this.state = {
            name: '',
            passwd: '',
            isSubmit: false,
        };
    }

    onLogin()
    {
        if (this.state.name.length <= 0) {
            Alert.alert(
                '请填写用户名',
                null,
                [{text: '确定'},]);
        } else if (this.state.passwd.length == 0) {
            Alert.alert(
                '请填写密码',
                null,
                [{text: '确定'},]);
        } else if (this.state.passwd.length < 6) {
            Alert.alert(
                '密码不能小于6位数',
                null,
                [{text: '确定'},]);
        } else {

            this.setState({ isSubmit:true, });

            let url = 'http://112.124.18.75/ydjr/api/user/generate_auth_cookie/?insecure=cool'
                        +'&seconds=31536000'
                        +'&username='+ this.state.name
                        +'&password='+ this.state.passwd;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ isSubmit:false, });

                    if (data.status == 'ok') {
                        let info = {uid:data.user.id, cookie:data.cookie, username:data.user.username, displayname:data.user.displayname, email:data.user.email, password: this.state.passwd};
						AsyncStorage.removeItem('user');
                        AsyncStorage.setItem('user', JSON.stringify(info)).done(() => this.navigator.push({name:'homePage'}) );
                    } else {
                        Alert.alert(
                            "错误的用户名或密码",
                            null,
                            [{text: '确定'},]);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                    this.setState({ isSubmit:false, });
                });
        }
    }

    render()
    {

        let btn = null;

        // 如果正在提交数据
        if (this.state.isSubmit) {
            btn = <View style={{backgroundColor: '#000000',borderRadius:5, padding:10, marginTop:20,marginLeft:20,marginRight:20,}}>
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>正在登录...</Text>
                    </View>;
        } else {
            btn = <View style={{backgroundColor: '#000000',borderRadius:5, padding:10,marginTop:20,marginLeft:20,marginRight:20,}}>
                        <TouchableOpacity onPress={() => this.onLogin()} >
                        <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>登录</Text>
                        </TouchableOpacity>
                  </View>;
        }

        return (
            <View style={styles.container}>

				<View style={styles.topnav}>
					<TouchableOpacity style={styles.navleft} onPress={() => this.navigator.pop()} ><Icon name="chevron-left" size={24} color="#fff" /></TouchableOpacity>
					<Text style={styles.navtit}>登录</Text>
					<TouchableOpacity style={styles.navright} onPress={() => this.navigator.push({name:'registerPage'}) }><Icon name="user-plus" size={24} color="#fff" /></TouchableOpacity>
				</View>

                <View style={styles.item}>
					<View style={styles.bdr}>
                    <TextInput
                        style={{height: 40, borderColor: '#000000',}}
                        placeholder='用户名'
                        onChangeText={(text) => this.setState({name: text})}
                        value={this.state.name}
                        autoCapitalize='none'
                        maxLength={12}
						underlineColorAndroid = 'transparent'
						selectionColor= '#292C35'
                    />
					</View>
                </View>
                <View style={styles.item}>
					<View style={styles.bdr}>
                    <TextInput
                        style={{height: 40, borderColor: '#000000',}}
                        placeholder='登录密码'
                        onChangeText={(text) => this.setState({passwd: text})}
                        value={this.state.passwd}
                        autoCapitalize='none'
                        maxLength={32}
                        secureTextEntry={true}
						underlineColorAndroid = 'transparent'
						selectionColor= '#292C35'
                    />
					</View>
                </View>

                {btn}

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
    tit: {
        textAlign: 'left',
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
