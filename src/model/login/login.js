import API from '@/fetch/api'
import http from '@/fetch/request'

export default {
	login (data, success, fail) {
		http.post(API.urls.login, data, 'permission',success, fail)
	},
	loginPhone (data, success, fail) {
		http.post(API.urls.loginPhone, data, 'permission',success, fail)
	},
	getSms (data, success, fail) {
		http.get(API.urls.getSms, data, 'permission', success, fail)
	}
}