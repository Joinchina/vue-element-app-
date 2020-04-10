<style scoped="" lang="less">
	.color{
		border: 1px solid red;
		width: 300px;
		margin: 30px auto;
		height: 300px;

		li{
			height: 30px;
			line-height: 30px;
			border-bottom: 1px solid #ccc;
		}
	}
</style>
<template>
	<div>
		<div class="color">
			<ul>
				<li v-for="(item,index) in array" :key="index" @click="routeJump(item.identification,item.role,item.name)">
					{{item.name}}
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				array:[]
			}
		},
		created () {
			
			this.initData();

		},
		methods:{
			routeJump(id,role,name){
				this.$router.push({
					path:"/live/show",
					query:{
						id:id,
						role:role,
						name:name
					}
				})

				//暂时存储账号id
            	localStorage.setItem("account",name);
			},
			initData(){
				this.array = [
				    // {
				    //     "identification":105282,
				    //     "role":"PROFESSOR",
				    //     "phone":"18960606360",
				    //     "name":"王家平",
				    //     "sex":"男",
				    //     "organizationId":32,
				    //     "appStatus":1,
				    //     "createDate":"2017-04-06 11:15:04"
				    // },
				    // {
				    //     "identification":108641,
				    //     "role":"CLAZZMANAGER",
				    //     "name":"芮玉净",
				    //     "sex":"男",
				    //     "organizationId":32,
				    //     "appStatus":0,
				    //     "createDate":"2017-05-03 10:41:19"
				    // },
				    // {
				    //     "identification":105280,
				    //     "role":"CLAZZMANAGER",
				    //     "phone":"",
				    //     "name":"刘宇飞",
				    //     "sex":"女",
				    //     "organizationId":32,
				    //     "appStatus":0,
				    //     "createDate":"2017-04-06 11:10:51"
				    // },
				    // {
				    //     "identification":105281,
				    //     "role":"CLAZZMANAGER",
				    //     "name":"A",
				    //     "sex":"女",
				    //     "organizationId":32,
				    //     "appStatus":0,
				    //     "createDate":"2017-04-06 11:11:43"
				    // },
				    {
				        "identification":105287,
				        "role":"CLAZZMANAGER",
				        "phone":"13693200621",
				        "name":"主播",
				        "sex":"",
				        "organizationId":32,
				        "appStatus":1,
				        "createDate":"2017-04-06 15:42:25"
					},
					{
				        "identification":105267,
				        "role":"STUDENT",
				        "phone":"13693154979",
				        "name":"学员",
				        "sex":"",
				        "organizationId":32,
				        "appStatus":1,
				        "createDate":"2017-04-06 15:42:26"
				    }
 
				]

			}
		}
	}
</script>
