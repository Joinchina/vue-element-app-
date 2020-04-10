'use strict'

import API from '@/fetch/api'
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { getToken } from '@/utils/common'
import router from '@/router'

// axios 配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = '';


function setArg(headers) {
	const BOUNDARY = "----WXF"+new Date().getTime();
	
	if(headers === 'permission') {  // 权限
		headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json;charset=UTF-8',
			'Authorization': getToken()
		}
	
	} else if(headers === 'file') {  // 文件
		headers = {
			'Content-Type': 'multipart/form-data;boundary='+BOUNDARY,
			'Authorization': getToken()
		}
	} else {
		headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json;charset=UTF-8'
		}
	}
	// 返回设置的headers 头部
	return headers;
}

function errorMsg(error) {
	console.log(error)
	if(error.response){
	    //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
	    // console.log(error.response.data);
	    // console.log(error.response.header);
	    console.log(error.response.status);  // 500 404
	    if (error.response.status == 500) {
	    	console.log("服务器错误");
	    }

	    if (error.response.status == 404) {
	    	console.log("找不到页面");
	    }


	}else {
	    //一些错误是在设置请求的时候触发
	    // console.log('Error',error.message);
	}
	// console.log(error.config);
}



export default {
	/**
	url  data  successCallBack 必填
	data 无 可用 {} 代替
	*/
	get: function (url='', params, headers, success, fail, timeout) {
		// 设置请求参数
		let setHeaders = setArg(headers);
		// console.log("setHeaders",setHeaders);
		// params 可传空
		// 返回请求数据
		axios({
			url,
			method: 'get',
			params: params,
			headers:  setHeaders,
			timeout: timeout || API.intServiceReqTimeout,
		}).then(res => {
			if(res.data.status == 900) {
				router.push({
					path: "/login"
				})
				Message.error(res.data.message);
				localStorage.clear();
				return false;
			}
			success && success(res.data);
			
		}).catch( error => {
			errorMsg(error);
			console.log("请求错误，请检查网络！",error);
			//Message.error("请求错误，请检查网络！");
			fail && fail(error);
        })
	},

	post: function(url='', data={}, headers, success, fileArray, fail, progress, timeout) {
		let param;
		let setHeaders = setArg(headers);
		// 上传文件类型
		if(headers === 'file') {
			param = new FormData();
			if(!!fileArray) {
				for(var i=0; i<fileArray.length; i++) {
					param.append('files', fileArray[i]);
				}
			}
			for(var j in data) {
				param.append(j, data[j]);
			}

			axios({
				url,
				method: 'post',
				data: param,
				headers: setHeaders,
				timeout: timeout || API.intServiceReqTimeout,
				onUploadProgress: function(progressEvent) {
					if(progressEvent.lengthComputable) {
						progress && progress(progressEvent);
					} 
				},
			}).then(res => {
				if(res.data.status == 900) {
					router.push({
						path: "/login"
					})
					Message.error(res.data.message);
					localStorage.clear();
					return false;
				}
				success && success(res.data);
			}).catch( error => {
				errorMsg(error);
				console.log("请求错误，请检查网络！",error);
				//Message.error("请求错误，请检查网络！");
				fail && fail(error);
			})

		} else {

			axios({
				url,
				method: 'post',
				data: qs.stringify(data),
				headers: setHeaders,
				timeout: timeout || API.intServiceReqTimeout,
			}).then(res => {
				if(res.data.status == 900) {
					router.push({
						path: "/login"
					})
					Message.error(res.data.message);
					localStorage.clear();
					return false;
				}
				success && success(res.data);
			}).catch( error => {
				errorMsg(error);
				console.log("请求错误，请检查网络！",error);
				//Message.error("请求错误，请检查网络！");
				fail && fail(error);
			})
		}

	}
}

