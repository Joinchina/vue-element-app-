import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
	//作业列表
	workList(data, success, fail){
		http.get(API.urls.workList, data, 'permission', success, fail)
	},
	// 提交作业
	postWork(data, fileArr, success, fail) {
		http.post(API.urls.workCommit, data, 'file', success, fileArr, fail)
	},
	// 作业详情，作业要求
	getWorkDetails(data, success, fail) {
		http.get(API.urls.workDetails, data, 'permission', success, fail)
	},
	// 暂存作业
	postWorkDraft(data, fileArr, success, fail) {
		http.post(API.urls.workDraft, data, 'file', success, fileArr, fail)
	},

	// 上传附件word ppt
	attachment(data, success, progress,fail) {
		http.post(API.urls.attachment, data, 'file', success,[], fail, progress)
	},

	// 获取阿里云上传权限
	// aliyunUpload(data, success, fail) {
	// 	http.get(API.urls.aliyunUpload, data, 'permission', success, fail)
	// },
	aliyunUpload(data, success, fail) {
		http.get(API.urls.aliyunossVideo, data, 'permission', success, fail)
	},
	// 上传阿里云附件信息
	aliyunAttachment(data, success, fail) {
		http.post(API.urls.aliyunAttachment, data, 'permission', success, [], fail)
	},
	//下载作业附件
	gethomework(data, success, fail){
		http.get(API.urls.gethomework, data, 'permission', success, fail)
	}
}