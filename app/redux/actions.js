/**
 * 统一处理 redux 动作处理
 * Created by ql on 2016/6/15.
 */

'use strict';

import {
    Alert,
} from 'react-native';

import * as TYPES from '../configs/types';
import * as CONFIGS from '../configs/configs';

/**
 *  根据接口地址获取文章列表数据
 *  var int page 显示页数
 */
export function getArticleList(url, page = 1)
{
    return (dispatch, getState) => {
        dispatch({'type': TYPES.ARTICLE_LIST_DOING, 'url': url});

        let furl = url + '&page=' + page;
		console.log(furl);
        fetch(furl)
            .then((response) => response.json())
            .then((data) => {
                let state = getState();
                //console.log(state);

                let isMore = false;
                if (data.pages > page) {
                    isMore = true;
                }

                let posts = data.posts;
                // 如果以前有数据则合并数据，加载更多时用到
                //if (typeof(state.articleList[url].data) != 'undefined') {
				if (page > 1) {
                   	posts = state.articleList[url].data.concat(posts);
                }

                dispatch({'type': TYPES.ARTICLE_LIST_OK, 'data': posts, 'isMore': isMore, 'url': url});
            })
            .catch((error) => {
				Alert.alert('', error.message);
                dispatch({'type': TYPES.ARTICLE_LIST_ERROR, 'url': url});
            });
    }
}


/**
  获取分类列表
*/
export function getCategory()
{
    return (dispatch, getState) => {
		dispatch({'type': TYPES.CATEGORY_LIST_DOING});

    	fetch(CONFIGS.CATEGORY_LIST_API)
          	.then((response) => response.json())
          	.then((data) => {
				//console.log(data);
              	dispatch({'type': TYPES.CATEGORY_LIST_OK, 'data': data.categories});
          })
          .catch((error) => {
			  	Alert.alert('', error.message);
          		dispatch({'type': TYPES.CATEGORY_LIST_ERROR});
          });
  	}
}


/**
  获取文章内容
*/
export function getArticle(id)
{
	return (dispatch, getState) => {
		dispatch({'type': TYPES.ARTICLE_CONTENT_DOING});

    	fetch(CONFIGS.ARTICLE_CONTENT_API + id)
          	.then((response) => response.json())
          	.then((data) => {
				//console.log(data);
              	dispatch({'type': TYPES.ARTICLE_CONTENT_OK, 'data': data.post});
          })
          .catch((error) => {
              	Alert.alert('', error.message);
				dispatch({'type': TYPES.ARTICLE_CONTENT_ERROR});
          });
  	}
}


/**
	获取文章评论
*/
export function getComments(id, page = 1)
{
	return (dispatch, getState) => {
		dispatch({'type': TYPES.COMMENTS_LIST_DOING});

		let furl = CONFIGS.COMMENTS_LIST_API + id + '&page=' + page;
    	fetch(furl)
          	.then((response) => response.json())
          	.then((data) => {
				console.log(data);

				let isMore = false;
				if (data.headers['X-WP-TotalPages'] > page) {
                    isMore = false;
                }

              	dispatch({'type': TYPES.COMMENTS_LIST_OK, 'data': data.body, 'isMore': isMore});
          })
          .catch((error) => {
              	Alert.alert('', error.message);
				dispatch({'type': TYPES.COMMENTS_LIST_ERROR});
          });
  	}
}
