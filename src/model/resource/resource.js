import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
    getList(data, success, fail) {
        http.get(API.urls.resourceList, data, 'permission', success, fail)
    },
    getDetails(data, success, fail) {
        http.get(API.urls.resourceId, data, 'permission', success, fail)
    },
    posttimelearn(data, success) {
        http.post(API.urls.resourceTimelearn, data, 'permission', success)
    }
}