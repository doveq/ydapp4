/**
 * 统一处理 redux reducer 处理
 * Created by ql on 2016/6/16.
 */

'use strict';

import {combineReducers} from 'redux';
import * as TYPES from '../configs/types';

// 文章列表处理
function articleList(state = {}, action)
{
    switch (action.type) {
        case TYPES.ARTICLE_LIST_DOING:
            state[action.url] = {...state[action.url], loading: true};
            return Object.assign({}, state);
        case TYPES.ARTICLE_LIST_OK:
            state[action.url] = {...state[action.url], loading: false, loaded: true, data: action.data, isMore: action.isMore};
            return Object.assign({}, state);
        case TYPES.ARTICLE_LIST_ERROR:
            state[action.url] = {...state[action.url], loading: false, loaded: true,};
            return Object.assign({}, state);
        default:
            return state;
    }
}

// 分类列表处理
function category(state = {}, action)
{
    switch (action.type) {
        case TYPES.CATEGORY_LIST_DOING:
            state = {...state, loading: true};
            return Object.assign({}, state);
        case TYPES.CATEGORY_LIST_OK:
            state = {...state, loading: false, loaded: true, data: action.data};
            return Object.assign({}, state);
        case TYPES.CATEGORY_LIST_ERROR:
            state = {...state, loading: false, loaded: true,};
            return Object.assign({}, state);
        default:
            return state;
    }
}


// 获取文章详细内容
function article(state = {}, action)
{
	switch (action.type) {
        case TYPES.ARTICLE_CONTENT_DOING:
            return {data:[], loading: true};
        case TYPES.ARTICLE_CONTENT_OK:
            return {loading: false, loaded: true, data: action.data};
        case TYPES.ARTICLE_CONTENT_ERROR:
            return {data:[], loading: false, loaded: true,};
        default:
            return state;
    }
}

// 评论列表处理
function comments(state = {}, action)
{
    switch (action.type) {
        case TYPES.COMMENTS_LIST_DOING:
            return {loading: true};
        case TYPES.COMMENTS_LIST_OK:
            return {loading: false, loaded: true, data: action.data, isMore: action.isMore};
        case TYPES.COMMENTS_LIST_ERROR:
            return {loading: false, loaded: true,};
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    articleList,
	category,
	comments,
});

export default rootReducer;
