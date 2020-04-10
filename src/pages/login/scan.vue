<template>
	<div class="j-scan">
		<div v-show = "scanFlag">
			<div class="qrcode"  v-loading="loading"  :element-loading-text="text">

			 	<qrcode-vue :value="value" :size="size" level="H" v-show="qrcodeCode" ></qrcode-vue>

				 <!--连接错误失败提示-->
				 <section class="error" v-show="errorFlag">
				 	 <div class="text">网络连接失败</div>
				 	 <button class="fresh" @click="freshWeb">刷新</button>
				 </section>

			</div>
			<div class="words">
				<span class="icon-scan"></span>
				<span class="ml-10">
					打开
					<span class="orange">师训宝APP</span>
				</span>
				<span class="ml-12">扫一扫登录</span>

			</div>
		</div>

		<div v-show = "!scanFlag">
		  	<section class="no-websocket">
		  		<i class="icon-notice"></i>您的浏览器不支持扫码功能<br/>
		  		<p>请使用谷歌浏览器或其他方式登录</p>
		  	</section>
		</div>


		
	</div>

</template>

<script>
	import QrcodeVue from 'qrcode.vue';
	import storage from '@/utils/storage';
	import userObj from '@/utils/loginServer';
	import api from '@/fetch/api';
	export default {
		data(){
			return{
				scanFlag:true,
				value: '',
      			size: 150,
      			loginKey: "",
      			qrcodeCode:false,
      			ws:null,
      			text:"加载中...",
      			errorFlag:false,
      			loading:true
			}
		},
		created(){
			this.loginKey = new Date().getTime();
			this.value = 'http://res.shixunbao.cn/static/stu.html?type=login&clientId='+this.loginKey,
			console.log("时间戳" + this.value);

			this.initWebSocket();

		},
		methods:{
			 initWebSocket () {

			 	 // let webSocketUrl = '10.98.24.67:50019/qrcode/login/websocket';
			 	 let webSocketUrl = api.urls.webSocket;
			 	 console.log("webSocketurl---" + webSocketUrl);
    			 if('WebSocket' in window ||　window.WebSocket){
    			 	this.ws = new WebSocket("wss://"+webSocketUrl+"");
    			 }else{

    			 	this.scanFlag = false;
    			 	console.log("请使用谷歌浏览器、火狐浏览器、IE10及以上浏览器");
    			 }

			     //连接发生错误的回调方法
			     this.ws.onerror = () =>{

			     	 this.loading = false;
			     	 this.text = "";
			       	 this.errorFlag = true;
			         this.ws.send('#ERROR#' + this.loginKey);

			    }

			    // Web Socket 已连接上，使用 send() 方法发送数据
			    this.ws.onopen = () => {

			    	//数据连接上，二维码展现
			        this.loading = false;
			        this.text = "";
			    	this.qrcodeCode = true;


			        this.ws.send('#OPEN#' + this.loginKey);
			        console.log('websolet已连接...')

			        //每三秒给一个心跳
			       
			        this.heatBeat = setInterval(()=>{
			        	this.ws.send('#heartbeat#' + this.loginKey);
			        },10000*3)
			    }

			    //接收到消息的回调方法
			    this.ws.onmessage = (event) => {
			        //console.log(333 + event.data);

			        let data = JSON.parse(event.data);
			        let clazzId = data.clazzId;
			        let homeworkId = data.activityId;
			        let token_users = data.tokenInfo;
			        let userName = data.userName;

			        //存储用户token账号
					storage.set("token_users",token_users);

					//存储当前用户账号
					storage.set("cur_username",userName);

					//存储当前账号的token
					storage.set("auth",userObj.curGetToken());

					//存储当前用户id
					storage.set("userId",userObj.curId("userId"));

					//存储当前的clazzId
					storage.set("clazzId",clazzId);


			        //作业列表页面
			        if(data.location == "homework"){

			        	///work/dowork?workId=6416
			        	//连接不对
			        	this.$router.push({
			        		path:"/work/updatework",
			        		query:{
			        			workId:homeworkId,
			        			login:"scan"
			        		}
			        		
			        	})

			        //跳转作业首页
			        }else{

			        	this.$router.push({
			        		path:"/index"
			        	})
			        }
			    }

			    // 组件销毁时调用，中断websocket链接
			    this.ws.over = () => {
			    	
			        this.ws.close();
			        console.log("关闭websoket");
			       
			    }
    		},
    		freshWeb(){
    			location.reload();
    		}

		},
		beforeDestroy () {
			//console.log("实例销毁前");
    		this.ws.over();
    		clearInterval(this.heatBeat);
		},
		components:{
			QrcodeVue
		},

	}
</script>

<style lang="less" scoped="">
	@import "../../assets/css/icon.less";
	.j-scan{
		.qrcode{
			width: 160px;
			margin: 35px auto 0 auto;
			position: relative;
			z-index: 100;
		}
		.error{
			width: 150px;
		    //border: 1px solid red;
			position: absolute;
			z-index: 2000;
			background-color: rgba(255,255,255,.9);
			margin: 0;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			-webkit-transition: opacity .3s;
			transition: opacity .3s;
			text-align: center;

			.text{
				color: #000;
				font-size: 18px;
				margin-top: 44px;
				font-weight: 400;
			}
			.fresh{
				margin-top:27px;
				height: 27px;
				width: 91px;
				line-height: 27px;
				color: #fff;
				border-radius: 3px;
				background: #2f96ff;
			}

		}
		.words{
			text-align: center;
			margin-top: 32px;
			color: #333;
			.orange{
				color: #ffa12c;
			}
		}

		.no-websocket{
			width: 241px;
			margin:0 auto;
			margin-top: 77px;
			font-size: 16px;
			color: #333;
			p{
				padding-top: 14px;
			}
			i{
				vertical-align: middle;
				margin-right: 6px;
			}
		}

	}
	
</style>