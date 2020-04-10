import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
	clazzList (data, success, fail) {
		http.get(API.urls.clazzList+"?"+data, null, 'permission', success, fail)
	},
	clazzId (data, success, fail) {
		http.get(API.urls.clazzId,data, 'permission', success, fail)
	}
}