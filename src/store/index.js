import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

// 声明一个状态 state

const state = {
	count: 0,
	menuActive:"/index",
	/**
	*存储网络课程的信息
	*online{
		"taskStatus":"",  //当年网路课程的状态WAITING：未开始, INPROGRESS：进行中, END：已结束
		"learnedRequiredCourseime":"",  //选修学时
		"learnedOptionalCourseTime":"",  //必修学时		
	 }
    */
	 online:{},
	title:"", 
	liveAuth:{},//直播间主播信息
	passsigndata:{},//存储接收到的频道消息
	 /**
     * 存储设备检测结果
     */
	detection:{},

}

// 所有模块，注册才能使用
const store = new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})
export default store
