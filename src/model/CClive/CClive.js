import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
	// 获取直播间列表
    getliveList(data, success, fail) {
        http.get(API.urls.ccliveList, data, 'permission', success, fail)
    },
    
    // 获取直播间回放列表
    getliveRecordList(data, success, fail) {
    	http.get(API.urls.ccliveRecordList, data, 'permission', success, fail)
    },
    //获取直播间列表
    getlive(data, success, fail) {
    	http.get(API.urls.liveRecordList, data, 'permission', success, fail)
    },
    //获取直播间回放列表
    getgolive(data, success, fail) {
    	http.get(API.urls.gettolivelist, data, 'permission', success, fail)
    },
    
}