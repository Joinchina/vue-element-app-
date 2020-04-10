import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
	// 查询班级“必修课”
    onlineclazzlist(data, success, fail) {
        http.get(API.urls.onlineclazzlist, data, 'permission', success, fail)
    },
    
    // 获取课程详细信息
    onlinecoursedetail(data, success, fail) {
    	http.get(API.urls.onlinecoursedetail, data, 'permission', success, fail)
    },
    // 上报学时
    onlinetimereport(data, success, fail) {
    	http.post(API.urls.onlinetimereport, data, 'permission', success, fail)
    },
    // 学员的网络课程完成情况
    onlinelearnstatus(data, success, fail) {
    	http.get(API.urls.onlinelearnstatus, data, 'permission', success, fail)
    },
    // 获取选课范围的学段学科
    onlinesubjectrange(data, success, fail) {
    	http.get(API.urls.onlinesubjectrange, data, 'permission', success, fail)
    },
    // 搜索选修课
    onlinecoursepage(data, success, fail) {
    	http.get(API.urls.onlinecoursepage, data, 'permission', success, fail)
    },
    // 学员选课
    onlinecourseselect(data, success, fail) {
    	http.post(API.urls.onlinecourseselect, data, 'permission', success, fail)
    },
    // 查询学员的“选修课
    onlinecourselist(data, success, fail) {
    	http.get(API.urls.onlinecourselist, data, 'permission', success, fail)
    }
}