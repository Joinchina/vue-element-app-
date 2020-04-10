import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
    // 获取班级各类活动数量
    getmyActivity(data, success, fail) {
        http.get(API.urls.getmyActivity, data, 'permission', success, fail)
    },
    //获取活动
    getquestionpaper(data,success,fail){
        http.get(API.urls.getquestionpaper, data, 'permission', success, fail)
    },
    //获取详情
    getpaperdetail(data, success, fail) {
        http.get(API.urls.getpaperdetail, data, 'permission', success, fail)
    },
    //发布答案
    submitquestins(data,success,fail){
        http.post(API.urls.addquestionanswer, data, 'permission' ,success, fail)
    },
}