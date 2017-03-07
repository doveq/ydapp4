/*
    个人信息页面
*/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class Personal extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

        this.state = {
            username: '',
            email: '',
            uid: '',
            cookie: '',
            passwd: '',
            repasswd: '',
            isLogin: false,
        };
        this.user = null;
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
                  uid: user.uid,
                  email: user.email,
                  cookie: user.cookie,
              });
              this.user = user;
          }
      }


    onReg()
    {
        if ( !(/^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/.test(this.state.email)) ) {
            Alert.alert(
                '请填写正确的邮箱地址',
                null,
                [{text: '确定'},]);
        } else if (this.state.passwd.length > 0 && this.state.passwd.length < 6) {
            Alert.alert(
                '密码不能小于6位数',
                null,
                [{text: '确定'},]);
        } else if (this.state.passwd !== this.state.repasswd) {
            Alert.alert(
                '重复密码不正确',
                null,
                [{text: '确定'},]);
        } else {
            this.reguer();
        }

    }

    reguer()
    {
        this.setState({ isSubmit:true });
        // 31536000 设置一年的过期时间
        let reg = "http://112.124.18.75/my-user.php?act=update"
                    +"&name="+ this.state.username
                    +"&email="+ this.state.email
                    +"&passwd="+ this.state.passwd

        fetch(reg)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ isSubmit:false, });
                console.log(data);
                if (data.error != 'ok') {
                    Alert.alert(
                        '提交失败请重试',
                        data.error,
                        [{text: '确定'},]);
                } else {
                    // 注册成功保存登入信息
                    let info = {uid:this.user.user_id, cookie:this.user.cookie, username:this.user.username, displayname:this.user.displayname, email:this.state.email};
                    console.log(info);
                    AsyncStorage.setItem('user', JSON.stringify(info)).done(()=> this.navigator.push({name:'homePage'}));
                    //this.navigator.push({name:'homePage'});
                }
            })
            .catch((error) => {
                this.setState({ isSubmit:false, });
                console.warn(error);
            });



    }


    render()
    {

        let btn = null;
        // 如果正在提交数据
        if (this.state.isSubmit) {
            btn = <View style={{backgroundColor: '#000000',borderRadius:5, padding:10, marginTop:20,marginLeft:20,marginRight:20,}}>
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>正在提交...</Text>
                    </View>;
        } else {
            btn = <View style={{backgroundColor: '#000000',borderRadius:5, padding:10, marginTop:20,marginLeft:20,marginRight:20,}}>
                    <TouchableOpacity onPress={() => this.onReg()} >
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>提交修改</Text>
                    </TouchableOpacity>
                  </View>;
        }


        return (
            <ScrollView scrollsToTop={false} style={styles.container}>
				<View style={styles.topnav}>
					<TouchableOpacity style={styles.navleft} onPress={() => this.navigator.pop()} ><Icon name="chevron-left" size={24} color="#fff" /></TouchableOpacity>
					<Text style={styles.navtit}>个人信息</Text>
				</View>

        <View style={styles.item}>
        <View style={styles.bdr}>
            <TextInput
                style={{height: 40,}}
                placeholder='邮箱地址'
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                autoCapitalize='none'
                keyboardType='email-address'
                maxLength={32}
        underlineColorAndroid = 'transparent'
        selectionColor= '#292C35'
            />
        </View>
        </View>

                <View style={styles.item}>
					<View style={styles.bdr}>
                    <TextInput
                        style={{height: 40,}}
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

                <View style={styles.item}>
					<View style={styles.bdr}>
                    <TextInput
                        style={{height: 40,}}
                        placeholder='重复密码'
                        onChangeText={(text) => this.setState({repasswd: text})}
                        value={this.state.repasswd}
                        autoCapitalize='none'
                        maxLength={32}
                        secureTextEntry={true}
						underlineColorAndroid = 'transparent'
						selectionColor= '#292C35'
                    />
					</View>
                </View>

                {btn}

            </ScrollView>
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
  }
});
