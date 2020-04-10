<template>
	
	<div class="j-login-wrap">
	     <l-header></l-header>

	     <section class="login">
		     <header class="user">用户登录</header>

		     <el-tabs v-model="activeName" @tab-click="handleClick" class="j-login-tabs scan">

			    <el-tab-pane label="扫码登录" name="scan">
			    	<s-can></s-can>
			    </el-tab-pane>

			    <el-tab-pane label="手机登录" name="tel">
			    	<tel-phone></tel-phone>
			    </el-tab-pane>

			    <el-tab-pane label="账号登录" name="acc">
			    	<ac-count></ac-count>
			    </el-tab-pane>
	  		</el-tabs>

  		 </section>


	</div>
</template>
<script>
	import model from '@/model/login/login'
	import lHeader from '@/pages/header/header_login' 
	import sCan from '@/pages/login/scan'
	import telPhone from '@/pages/login/telphone'
	import acCount from '@/pages/login/account'
	import storage from '@/utils/storage'


	export default {
		created(){
			this.$store.dispatch("routeActive","/index");
		},
		data(){
			return{
				activeName: 'scan'
			}
		},
		methods:{
			 handleClick(tab, event) {
        		// if(tab.name == "tel"){
        		// 	storage.set("loginType","tel");
        		// }else{
        		// 	storage.set("loginType","acc");
        		// }
      		}
		},
		components:{
			sCan,
			telPhone,
			acCount,
			lHeader
		}

	}
</script>
<style lang="less" scoped="">

.j-login-wrap{
	.login{
		width: 422px;
		height: 455px;
		margin:10% auto 0 auto;
		background: #fff;
		border-radius: 20px;
		box-shadow: 0 0 3px #f0f2f6;
		.user{
			padding-top:44px;
			font-size: 22px;
			color: #666;
			text-align: center;
		}
		.scan{
			color: #999;
			font-size: 16px!important;
			width: 287px;
			margin:30px auto 0 auto;
		}
		.code{
			margin-top: 50px;
			width: 160px;
			height: 160px;
			margin: 0 auto;
		}
		.explain{
			color: #333;
		}
		.orange{
			margin-top: 32px;
			color: #ff6c00;
		}
	}

}

</style>