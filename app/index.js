/**
 * redux 和 react-native 结合起来
 * Created by ql on 2016/6/17.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux'

import {
    AppRegistry,
	Navigator,
  	BackAndroid,
  	Platform,
  	ToastAndroid,
	StatusBar,
} from 'react-native';

import configureStore from './redux/store'

import CategoryPage from "./category";
import ArticlePage from "./article";
import HomePage from "./home";
import LoginPage from "./login";
import RegisterPage from "./register";
import SearchPage from "./search";

const store = configureStore();


class App extends Component
{
    constructor(props)
    {
        super(props);

        // 需要注意的是，不论是bind还是箭头函数，每次被执行都返回的是一个新的函数引用，因此如果你还需要函数的引用去做一些别的事情（譬如卸载监听器），那么你必须自己保存这个引用
        this._onBackAndroid = this.onBackAndroid.bind(this);
    }

    componentWillMount()
    {
        // 监听安卓的返回按键
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    componentWillUnmount()
    {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    onBackAndroid()
    {
        // 在Navigator里使用了ref属性，所以可以取到 this.navigator
        let nav = this.navigator;
        let routers = nav.getCurrentRoutes();

        //console.log( routers[routers.length - 1] );
        if (routers.length > 1 && routers[routers.length - 1].name != 'mainPage') {
            nav.pop();
            return true;
        }

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }

        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
        return true;
    }

    // 根据路由跳转到不同页面
    routeMap(route, navigator)
    {
		if (route.name == 'startPage') {
            return <HomePage {...route.params} {...this.props} navigator={navigator} />
        }

		if (route.name == 'homePage') {
            return <HomePage {...route.params} {...this.props} navigator={navigator} />
        }

		if (route.name == 'categoryPage') {
            return <CategoryPage {...route.params} {...this.props} navigator={navigator} />
        }

		if (route.name == 'articlePage') {
            return <ArticlePage {...route.params} {...this.props} navigator={navigator} />
        }

		if (route.name == 'registerPage') {
            return <RegisterPage {...route.params} navigator={navigator} />
        }

        if (route.name == 'loginPage') {
            return <LoginPage {...route.params} navigator={navigator} />
        }

		if (route.name == 'searchPage') {
            return <SearchPage {...route.params} navigator={navigator} />
        }

		/*
        // 启动图页
        if (route.name == 'startPage') {
            return <StartPage {...route.params} navigator={navigator} />
        }

        // 框架页
        if (route.name == 'mainPage') {
            return <MainPage {...route.params} navigator={navigator} />
        }

        // 内容详情页
        if (route.name == 'archivesPage') {
            return <ArchivesPage {...route.params} navigator={navigator} />
        }

        if (route.name == 'commentPage') {
            return <CommentPage {...route.params} navigator={navigator} />
        }
		*/
    }

    // 设置页面跳转动画
    routeConfigureScene(route)
    {
        // 可根据route传参数设置不同也的跳转效果
        return Navigator.SceneConfigs.FadeAndroid;
    }

    render()
    {
        return (
            <Navigator
                initialRoute={{name:'startPage'}}
                configureScene={this.routeConfigureScene}
                renderScene={this.routeMap.bind(this)}
                ref={nav => { this.navigator = nav; }}
            />
        );
    }

}//:~


export default class index extends Component
{
    render()
    {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

AppRegistry.registerComponent('ydapp4', () => index);
