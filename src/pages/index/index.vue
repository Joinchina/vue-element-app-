<template>
	<div class="j-homework">
		<section class="item"
		v-if="workData.length > 0" 
		v-for="(item,index) in workData"
		:key="item.id">

			<!--未完成-->
			<section v-if = "item.status == 'WAITING'" @click='itemRouteTo(item)'>
				<h2 class="title title-active">
					<div class="words">{{item.title}}</div>
				</h2>
				<p :alt="item.courseName" :title="item.courseName">
					{{item.courseName}}
				</p>
				<div class="bottom">
					<a href="javascript:void(0)" @click.stop="doPage(item)" class="btn-homework">做作业</a>
					<!-- <router-link :to="{path:'/work/dowork',query:{workId:item.id}}" >做作业</router-link> -->
				</div>
				<div class="corner uncomplete">
					<span>未完成</span>
				</div>
			</section>
			

			<!--已完成并且可以评分-->
			<section v-else-if = "item.status == 'FINISHED'" @click='itemRouteTo(item)'>
				<h2 class="title title-active">
					<div class="words">{{item.title}}</div>
				</h2>
				<p :alt="item.courseName" :title="item.courseName">
					{{item.courseName}}
				</p>
				<div class="bottom">

					<a href="javascript:void(0)" @click.stop="viewPage(item)" class="btn-modify" style="margin-right:8px;">查看</a>
					<span  v-if="!item.scoreLevel">
						<span v-if="!!item.activityStatus && item.activityStatus != 'END'">
							<a href="javascript:void(0)" @click.stop="modifyPage(item)" class="btn-modify">修改</a>
						</span>
						
					</span>
					



					<!--优秀-->
					<div class="bottom-mark" v-if="!!item.scoreLevel">

						<section v-if="item.scoreLevel == 'A'">
							<span class="icon-goodest"></span>
							<div class="txt">优秀</div>
						</section>

						<section v-else-if="item.scoreLevel == 'B'">
							<span class="icon-verygood"></span>
							<div class="txt">较好</div>
						</section>

						<section v-else-if="item.scoreLevel == 'C'">
							<span class="icon-qualify"></span>
							<div class="txt">合格</div>
						</section>

						<section v-else>
							<span class="icon-unquailify"></span>
							<div class="txt">不合格</div>
						</section>
					</div>


				</div>
				<div class="corner corner-active">
					<span>已完成</span>
					
				</div>
			</section>

			<!--已过期-->
			<section v-else-if = "item.status == 'OVERDUE'" @click='itemRouteTo(item)'>
				<h2 class="title title-active">
					<div class="words">{{item.title}}</div>
				</h2>
				<p :alt="item.courseName" :title="item.courseName">
					{{item.courseName}}
				</p>
				<div class="bottom">
					<router-link :to="{path:'/work/overwork',query:{workId:item.id}}" class="btn-modify">查看</router-link>
				</div>
				<div class="corner corner-active">
					<span>已过期</span>
				</div>
			</section>


		</section>

		<!--空页面-->
		<empty v-if='this.emptyFlag && this.workData.length == 0' :notext="notext">
			
		</empty>


	</div>

</template>

<script>
import work from '@/model/work/work'
import empty from '@/pages/empty/empty'
import userObj from '@/utils/loginServer'
import storage from '@/utils/storage'


export default{
	data(){
		return{
			activeFlag:false,
			clazzId:"",
			emptyFlag:false,
			notext:"暂无作业",
			workData:[]
		}
	},
	created(){
		
		//获取班级id
		this.clazzId = storage.get("clazzId");

		this.workList();
		
	},
	methods:{

		itemActiveOver(item){
			item.activeFlag = true;
		},

		itemActiveOut(item){
			item.activeFlag = false;
		},

		viewPage(item){
			this.$router.push({
				path:"/work/viewwork",
				query:{
					workId:item.id
				}
			})
		},

		modifyPage(item){
			this.$router.push({
				path:"/work/updatework",
				query:{
					workId:item.id
				}
			})
		},

		doPage(item){
			this.$router.push({
				path:"/work/updatework",
				query:{
					workId:item.id
				}
			})
		},

		itemRouteTo(item){
			let status = item.status;
			switch(status){
				case "WAITING":
				this.$router.push({
					path:"/work/updatework",
					query:{
						workId:item.id,		
					}
				})
				break;

				case "FINISHED":
				this.$router.push({
					path:"/work/viewwork",
					query:{
						workId:item.id,
						
					}
				})
				break;

				case "OVERDUE":
				this.$router.push({
					path:"/work/overwork",
					query:{
						workId:item.id
					}
				})
				break;

			}

		},

		workList(){
			//console.log("liebiao");
			let data = {
				clazzId:this.clazzId
			}
			work.workList(data, (res => {
				// console.log("作业", res);
				 if(res.status == 200){

				 	this.workData = res.data;
				 	this.workData.forEach((item) =>{
				 		this.$set(item,"activeFlag",false);
				 	})

				 	//空页面展现
				 	this.emptyFlag = true;
				 	

				 }else {

					this.$message.error(res.message);

				 }
			}),(res => {
					console.log("请求有误，请检查网络");
					//this.$message.error("请求有误，请检查网络");

			}))
		}		
	},
	components:{
		empty
	}
}
</script>
<style lang="less" scopped>
@import "../../assets/css/icon.less";
.j-homework{
	max-width: 1004px;
	margin-top: 35px;
	
	.item{
		float: left;
		margin-right: 14px;
		width: 31%;
		border-radius: 8px;
		border: 1px solid #edf1f7;
		//box-shadow: -5px 0 14px #edf1f7, 5px 0 14px #edf1f7, 0 -5px 14px #edf1f7, 0 5px 14px #edf1f7;
		box-shadow: -5px 0 14px #edf1f7, 5px 0 14px #edf1f7, 0 5px 14px #edf1f7;
		height: 198px; 
		background: #fff;
		margin-bottom: 14px;
		position: relative;
		cursor:pointer;
		transition:all .1s linear;
		&:hover{
			border: 1px solid #fbc8a6;
			border-radius: 8px;
			transform: translate(0, -3px);
			.title{
				background: #f6f6f6;
				border-radius: 8px;
			}
		}
		.title{
			padding-top: 22px;
			margin-bottom: 18px;
			border-bottom: 1px solid #efefef;
			line-height: 22px;
			font-size: 16px;
			color: #333;
			padding-left: 20px;
			padding-bottom: 20px;
			//transition:all .3s linear;
			.words{
				height: 46px;
				width: 80%;
				overflow : hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		p{
			margin-top: 20px;
			height: 20px;
			color: #999;
			font-size: 14px;
			padding-left: 20px;
			width: 100%;
			text-overflow:ellipsis;
			overflow:hidden;
			white-space:nowrap;

		}
		.bottom{
			margin-top: 30px;
			margin-left: 20px;
		}
		.btn-modify{
			border: 1px solid #e2e2e5;
			border-radius: 3px;
			padding: 3px 20px;
			color: #999; 
			background: #fff;
			font-size: 14px;
		}
		.btn-modify:hover{
			background: #f6f6f6;
			color: #666;
			border: 1px solid #e2e2e5;

		}
		.bottom-mark{
			float: right;
			padding-right: 23px;
			margin-top: -15px;
			.txt{
				color: #999;
				font-size: 12px;
				margin-top: -2px;
				margin-left: 1px;
			}
		}
		a.btn-homework{
			background: #fea02b;
			border-radius: 3px;
			padding: 4px 15px;
			color: #fff;
			font-size: 14px;
			display: inline-block;
		}
		a.btn-homework:hover{
			background: #ff9109;
		}
		.corner{
			position: absolute;
			right: 0;
			top:0;
			width: 0;
		    height: 0!important;
		    border-top: 48px solid #fff;
		    border-left: 48px solid transparent;
		    span{
		    	position: absolute;
		    	left: -36px;
		    	top: -77px;
		    	line-height: 90px;
		    	text-align: center;
		    	transform:rotate(40deg);
				-ms-transform:rotate(40deg);
				-webkit-transform:rotate(40deg);
		    	color: #afaeae;
		    	font-size: 12px;
		    }
		}
		.uncomplete{
			border-top: 48px solid #fff;
			
			span{
				color: #afaeae;
			}
		}
	}

	
}
</style>