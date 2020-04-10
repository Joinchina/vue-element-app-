import API from '@/fetch/api'
import http from '@/fetch/request'

export default{
	
	//获取直播课程的直播间授权token信息
	liveRoomAuth(data,success, fail){
		http.get(API.urls.liveRoomAuth, data, 'permission',success,fail)
	},

	//获取班级学员列表 onlineMember
	liveRoomMember(data,success, fail){
		http.get(API.urls.liveRoomMember, data,  'permission',success,fail)
	},

	//获取班级在线学员列表 
	onlineMember(data,success, fail){
		http.get(API.urls.onlineMember, data,  'permission',success,fail)
	},

	liveRoomRecordPage(data,success, fail){
		http.get(API.urls.liveRoomRecordPage, data,  'permission',success,fail)
	},

	// 获取课程活动列表
	liveCourseActList(data, success, fail) {
		http.get(API.urls.liveCourseActList, data, 'permission', success, fail)
	},
	//直播可签到
	livepostsign(data,success,fail){
		http.post(API.urls.livesign, data, 'permission', success, fail)
	},
	//获取当前班级下是否有签到
	getlivesign(data,success,fail){
		http.get(API.urls.livegetsign, data, 'permission', success, fail)
	},

	// 获取活动提醒状态，小红点
	liveCourseRedPoint(data, success, fail) {
		http.get(API.urls.liveCourseRedPoint, data, 'permission', success, fail)
	},

	// 直播课程学员答题
	liveCourseAnswer(data, success, fail) {
		http.post(API.urls.liveCourseAnswer, data, 'permission', success, fail)
	},
	//查询直播间是否存在正在进行的签到
	liveforsign(data, success, fail) {
		http.get(API.urls.liveforsign, data, 'permission', success, fail)
	},
	liveLoginOsType(data, success, fail) {
		http.get(API.urls.liveLoginOsType, data, 'permission', success, fail)
	},
	//获取直播间学员数据
    getstudentdata(data,success,fail){
        http.get(API.urls.getstudentdata, data, 'permission', success, fail)
	},
    // 学员连麦成功
    liveRoomSuccConnect(data, success, fail) {
        http.post(API.urls.liveRoomSuccConnect, data, 'permission', success, fail)
    },
    //获取巡课列表信息
    liveroomPlayUrl(data,success,fail){
        http.get(API.urls.liveroomPlayUrl, data, 'permission',  success, fail);
	},
	
	//上报学员回看时长
    recordingLearn(data,success,fail){
        http.post(API.urls.recordingLearn, data, 'permission',  success, fail);
	},
	//统计回放视频查看次数
    recordingCount(data,success,fail){
        http.post(API.urls.recordingCount, data, 'permission',  success, fail);
    },
}