// 状态值改变方法，操作状态值
// 提交mutations 是更改Vuex状态的唯一方法
// export const increment = state => {
// 	state.count = state.count + 5
// }

// export const decrement = state => {
// 	state.count = state.count - 5
// }
import storage from '@/utils/storage';
export const increment = (state, m) => {
	state.count = state.count + m
}

export const decrement = (state, n) => {
	state.count = state.count - n
}

//设置左侧菜单选中状态
export const routeActive = (state,payload) =>{
		//console.log("最后" + payload);		
		state.menuActive = payload;

		// console.log("切换状态"  + state.menuActive);
		storage.set("status",state.menuActive);

}