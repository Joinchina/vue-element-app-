<template>
	<div class="choose">
		<v-header></v-header>
		<div class="title">
			班级选择
			<p>Class selection</p>
			
		</div>
		<ul class="content">
			<li v-for = "(item,index) in orgList" :key="item.userId" @click="pageJump(item.identification,item.userId)">
				<div class="box">
					<p>
						{{item.name}}
					</p>
					<h3 class="orgname">
						{{item.orgName}}
					</h3>
					<div class="logo" v-if = "!!item.logo && item.log != ''">
						<img :src="item.logo">
					</div>
					<div class="logo" v-else>
						<img src="../../assets/images/index/default-orglogo.png">
					</div>
				</div>
			</li>



		</ul>
	</div>
</template>
<script>
    import vHeader from '@/pages/header/header'
    import userObj from '@/utils/loginServer'
    import model from '@/model/choose/choose'
    import storage from '@/utils/storage'
	export default{
		data(){
			return{
				orgList:[]
			}
		},
		mounted(){
			this.clazzList();
		},
		created(){
			//console.log(this.$store.state.menuActive);
			
		},
		methods:{


			clazzList(){
				var data = userObj.userIds();
				model.clazzList(data, (res => {
                	if(res.status == 200){
                		this.orgList = res.data;
                	}else{
                		this.$message.error(res.message);
                	}
                	
            	}))
			},
			pageJump(clazzId,userId){
				//console.log(userId);

				//存储当前token
				this.setStorageAuth(userId);

				//存储当前用户Id
				storage.set("userId",userId);

				//存储当前班级Id
				storage.set("clazzId",clazzId);


				this.$router.push({
					path:"/index"
				})
			},
			setStorageAuth(userId){
				let token_json = storage.get("token_users");
				let curToken = token_json[userId];
				storage.set("auth",curToken);
			}
		},
		components:{
			vHeader
		}
	}
</script>
<style lang="less" scoped>
	.choose{
		.title{
			height: 124px;
			padding-top: 32px;
			color: #fff;
			background: #a58c92;
			background: -webkit-linear-gradient(left bottom,#91848f,#bd928d);  
        	background: -o-linear-gradient(left bottom,#91848f,#bd928d);  
        	background: -mos-linear-gradient(left bottom,#91848f,#bd928d);  
        	background: -moz-linear-gradient(left bottom,#91848f,#bd928d);  
        	background: linear-gradient(left bottom,#91848f,#bd928d);  
			text-align: center;
			width: 100%;
			font-size: 30px;
			font-family: "黑体";
			letter-spacing:8px;
			font-weight: 400;
			p{
				padding-top: 10px;
				font-size: 14px;
				letter-spacing:3px;
			}

		}
		.content{
			max-width: 1280px;
			margin: 80px auto 0 auto;
			background: #f5f7fb;
			padding:0 70px;
			li{
				float: left;
				height: 260px;
				width: 23%;
				margin-right: 20px;
				cursor: pointer;
				.box{
					border: 1px solid #edf1f7;
		            box-shadow: -5px 0 14px #edf1f7, 5px 0 14px #edf1f7, 0 5px 14px #edf1f7;
					border-radius: 5px;
					padding:30px 20px 14px 20px;
					background: #fff;
					position: relative;
					//transition:all .5s linear;
					//-moz-transition: all .5s linear; /* Firefox 4 */
					//-webkit-transition: all .5s linear; /* Safari 和 Chrome */
					//-o-transition: all .5s linear; /* Opera */
					//min-height: 230px;
				}
				
				p{
					height: 116px;
					overflow: hidden;
					line-height: 30px;
					font-size: 16px;
					color: #333;
					//padding-bottom: 12px;
					border-bottom: 1px solid #efefef;
				}
				h3{
					font-size: 14px;
					color: #666;
					padding-top: 13px;
				}
				.orgname{
					
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #999;
				}
				.logo{
					position: absolute;
					left: 39%;
					top: -35px;
					img{
						width: 54px;
						height: 54px;
						border-radius: 50%;
					}
				}

			}
			li:hover .box{
				border:1px solid #f8c39e;
				.orgname{	
					overflow: visible!important;
					text-overflow: clip!important;
					white-space: normal!important;
				}
			}
		}
	}
</style>