// 注册事件处理函数，当这个函数被触发时，将状态提交到mutaions中处理
// export const increment = ({ commit }) => commit('increment')
// export const decrement = ({ commit }) => commit('decrement')

// 传参时的配置
export const increment = ({ commit }, m) => commit('increment', m)
export const decrement = ({ commit }, n) => commit('decrement', n)

//菜单参数传递配置
export const routeActive = (context,payload) =>{
		context.commit("routeActive",payload)
}
