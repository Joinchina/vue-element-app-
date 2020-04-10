<template>
	<div class="j-homework">
		<section class="item" v-for="(items,index) in item" :key="index">

			<!--未完成-->
			<section v-show="items.status=='ATTEND'">
				<h2 class="title title-active">
					<div class="words">{{items.title}}</div>
				</h2>
				<p >
					{{items.courseName}}
				</p>
				<div class="bottom">
					<router-link :to="{path:'/Evaluation/evaluationedit',query:{activityId:items.id,status:items.status}}" class="btn-homework" >去参与</router-link> 
				</div>
				<div class="corner uncomplete">
					<span>未完成</span>
				</div>
			</section>
			

			<!--未开始-->
			<section v-show="items.status=='NOTSTARTE'">
				<h2 class="title title-active">
					<div class="words">{{items.title}}</div>
				</h2>
				<p>
					{{items.courseName}}
				</p>
				<div class="bottom">
					<router-link :to="{path:'/Evaluation/evaluationdetail',query:{activityId:items.id,status:items.status}}" class="btn-modify" >查看</router-link>
				</div>
				<div class="corner corner-active">
					<span>未开始</span>					
				</div>
			</section>

			<!--已完成-->
			<section v-show="items.status=='FINISH'">
				<h2 class="title title-active">
					<div class="words">{{items.title}}</div>
				</h2>
				<p>
					{{items.courseName}}
				</p>
				<div class="bottom">
					<router-link :to="{path:'/Evaluation/evaluationdetail',query:{activityId:items.id,status:items.status}}" class="btn-modify" >查看</router-link>
				</div>
				<div class="corner corner-active">
					<span>已完成</span>
				</div>
			</section>
			<!--已过期-->
			<section v-show="items.status=='OVERDUE'">
				<h2 class="title title-active">
					<div class="words">{{items.title}}</div>
				</h2>
				<p>
					{{items.courseName}}
				</p>
				<div class="bottom">
					<router-link :to="{path:'/Evaluation/evaluationdetail',query:{activityId:items.id,status:items.status}}" class="btn-modify" >查看</router-link>
				</div>
				<div class="corner corner-active">
					<span>已过期</span>
				</div>
			</section>

		</section>

	</div>

</template>
<script>


import activity from "@/model/activity/activity";
export default {
	data () {
		return {
			item:[], //投票集合
			status:'',//试卷状态
		}
	},
	created () {
		this.getvote();
	},
	methods: {
		getvote(){
			let data={
				type:'EVALUATION'
			};
			activity.getquestionpaper(data,(res=>{
				if(res.status==200){
					if(!!res.data){
						this.item=res.data
					}
				}
			}))
		},
	},
    components:{
		
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