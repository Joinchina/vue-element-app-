<template>
	<div class="viewwork">
		<span @click="$router.history.go(-1)" class="goback" v-if="origin != 'live'">
			<i class="el-icon-d-arrow-left"></i>
			返回
		</span>
		<section class="work-details">
			<div class="work-desc content">
				<h2>作业要求</h2>
				<dl class="work-details">
					<dt>
						<h3>{{workNote.title}}</h3>
					</dt>
					<dd>
						<i class="el-icon-time"></i>
						<span class="text">截止时间： {{workNote.endTime ? workNote.endTime : '永久'}}</span>
					</dd>
					<dd>
						<i class="el-icon-tickets"></i>
						<span class="text">作业要求：{{workNote.content}}</span>
					</dd>
					<dd class="work-img clearfix" v-if="workNote.pictureList">
						<img v-for="item in workNote.pictureList"  :src="item.transUrl" >
					</dd>
					<!-- 添加作业预览 -->
					<dd  v-if="fileList.length > 0">
 
						<div v-for="(item,index) in fileList" class="dis">
							<span><img src="../../assets/images/icon/icon-fujian.png" alt=""></span>
							<img src="../../assets/images/icon/icon-ppt.png" alt="" v-if="item.type == 'PPT'">
							<img src="../../assets/images/icon/icon-word2.png" alt="" v-else>
							<!--转码中-->
							<span v-if="item.transStatus == 'INPROCESS'" class="zm" >转码中...</span>
							<span v-if="item.transStatus == 'FAILURE'" class="zm" >转码失败</span>
							<span  class="viewhomework" @click="viewhonework(item)">		
								{{item.name}}
							</span>
							<span class="uploaddown"><a @click="gethomework(item)"><img src="../../assets/images/icon/icon-load.png" alt=""></a></span>
						</div>
					</dd>
				</dl>
			</div>
			
			<!-- 详情 -->
			<div class="work-save content">
				<h2 class="title clearfix">
					我的作业
		
					<template v-if="!!workDetails.scoreLevel">
						<img v-if="workDetails.scoreLevel == 'A'" src="../../assets/images/work/work-excellent.png" >
						<img v-if="workDetails.scoreLevel == 'B'" src="../../assets/images/work/work-good.png" >
						<img v-if="workDetails.scoreLevel == 'C'" src="../../assets/images/work/work-qualified.png" >
						<img v-if="workDetails.scoreLevel == 'D'" src="../../assets/images/work/work-unqualify.png" >
					</template>
					<router-link class="btn-ora-line btn-modify" v-if="!workDetails.scoreLevel && activityStatus !== 'END'" :to="{path: '/work/updatework', query: {workId: workId}}">
						<i class="el-icon-edit"></i>
						修改
					</router-link>
				</h2>
				<ul class="modify-wrap" v-if="workDetails">
					<li class="modify-title clearfix">
						<label class="sub-side">作业标题：</label>
						<p class="right">{{workDetails.title}}</p>
					</li>
					<li class="modify-cont clearfix">
						<label class="sub-side">作业内容：</label>
						<div class="right" >
							<p class="">{{workDetails.content}}</p>
							<div class="modify-img" v-if="workDetails.pictureList">
								<img v-for="item in workDetails.pictureList" :src="item.transUrl">
							</div>
						</div>
					</li>
					<li class="modify-file-wrap clearfix" >
						<label class="sub-side file-side">我的附件：</label>
						<ul class="modify-file-list right attachment" >
							<li 
								v-for="item in workDetails.attachmentList" 
								:class="item.transStatus == 'SUCCESS' ? 'clearfix' : 'disabled clearfix'" 
								@click="item.transStatus == 'SUCCESS' && viewAttachment(item)"
								>
								<i v-if="item.type == 'WORD'" class="icon-word2"></i>
					    		<i v-if="item.type == 'PPT'" class="icon-ppt"></i>
					    		<i v-if="item.type == 'VIDEO'" class="icon-video"></i>
								{{item.type == 'VIDEO' ? item.name.split('/').pop() :item.name}}
								<span class="status">{{transName[item.transStatus]}}</span>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<!-- 评论 -->
			<div class="comment content" v-if="comment.length != 0">
				<h2>评论</h2>
				<ul class="comment-list">
					<li class="clearfix" v-for="item,index in comment" :key="index">
						<div class="avatar">
							<img v-if="!!item.miniAvatar" :src="item.miniAvatar" alt="">
							<img v-else src="../../assets/images/common/default-avatar.png" >
						</div>
						<div class="cont">
							<h3 class="">
								{{item.userName}}
								<span class="time">{{item.createDate}}</span> 
								<img v-if="item.role == 'CLAZZMANAGER'" src="../../assets/images/work/teacher.png" alt="">
								<img v-if="item.role == 'PROJECTADMIN'" src="../../assets/images/work/project-man.png" alt="">
								<img v-if="item.role == 'PROFESSOR'"  src="../../assets/images/work/professor.png" alt="">
							</h3>
							<p class="desc">{{item.content}}</p>
						</div>
					</li>
				</ul>
			</div>
		</section>
	<!-- 查看pdf -->
	<modal :show.sync = "showPdf" contWidth = "80%" bgColor="#53575a" >
		<div slot="body" class="w-transparent" style="height: 100%">
			<iframe v-if="currType==='WORD' || currType==='PPT' " :src="linkUrl" id="showPdf" frameborder="0" width="100%" height="100%"></iframe>
		</div>
	</modal>
	<!-- 查看视频 -->
	<modal :show.sync = "showVideo" contWidth = '80%' bgColor="#53575a" :before-close="videoClose">
		<div slot="body" style="height:100%">
			<video :src="linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
			您的浏览器不支持video标签
			</video>
		</div>
	</modal>
	<!-- 查看作业附件 -->
		<modal :show.sync = "filelog" contWidth = '80%' bgColor="transparent">
			<div slot="body" class="w-transparent" style="height:100%;height:100%">        
				<iframe :src="bigfileUrl" id="iframepdf" frameborder="0" width="100%" height="100%"></iframe>			
             </div>
		</modal>
	</div>
</template>
<script>
	import work from '@/model/work/work'
	import modal from '@/components/modal/modal'
	import { getToken } from '@/utils/common'
	import API from '@/fetch/api'
	export default {
		data() {
			return {
				workDetails: {},	//作业详情
				workNote: {},  //作业要求
				workimg:"",
				comment: [],
				transName: {
					'WAITING': '等待转码',
					'INPROCESS': '转码进行中',
					'SUCCESS': '转码成功',
					'FAILURE': '转码失败'
				},
				showPdf: false,		// 查看pdf
				showVideo: false,	// 查看视频
				currType: '',		// 当前点击文件类型
				linkUrl: '',		// 附件链接
				activityStatus: '',		// 作业状态end 是过期
				//uploadname:"我是文件名",
				//uploadformat:".doc",
				//filename:"",
				//fileUrl:"",
				bigfileUrl:"",
				//uploadimg:"",
				//uploaddown:"",
				filelog:false,
				//getworkid:"",
				fileList:[]
			}
		},
		computed: {
			workId() {
				return this.$route.query.workId;
			},
			origin(){
				return this.$route.query.origin
			}
		},
		mounted() {
			this.getWork();
		},
		methods: {
			getWork() {
				let data = {
					"activityId": this.workId
				}
				work.getWorkDetails(data, (res => {
					console.log("work-details ",res);
					if(res.status == 200) {
						this.workNote = res.data;
						this.workDetails = res.data.homework;
						this.comment = res.data.homeworkComment || [];  //评论
						this.activityStatus = res.data.activityStatus; // 作业状态
						if(this.workNote.publishhomeworkAttachmentList){
							this.fileList=this.workNote.publishhomeworkAttachmentList || [];
						}

					
					} else {
						this.$message.error(res.message);
					}
				}),(res => {
					console.log("error", res);
					// this.$message.error("请求有误，请检查网络");
				}));
			},
			viewAttachment(item) {
				console.log("item==== ", item);
				if(item.type == 'WORD' || item.type == 'PPT') {
					this.currType = item.type;

					this.linkUrl = item.linkUrl;

					this.showPdf = true;
				}
				if(item.type == 'VIDEO') {
					this.linkUrl = item.linkUrl;
					this.showVideo = true;
				}
			},
			videoClose() {
				document.getElementById("myVideo").pause();
		    	this.showVideo = false;
			},
						//更改显示附件名
			getuploadname(data){
				// console.log(data)
				// this.filename=data.publishhomeworkAttachmentList ? data.publishhomeworkAttachmentList[0].name : '';
				// this.fileUrl=data.publishhomeworkAttachmentList ? data.publishhomeworkAttachmentList[0].linkUrl : '';
				// this.uploaddown=data.publishhomeworkAttachmentList ? data.publishhomeworkAttachmentList[0].originalUrl : '';
				// 	let num=this.filename.lastIndexOf(".");
				// 	let suffix=this.filename.substring(num);
				// 	let filename=this.filename.substr(0,num);
				// 	this.uploadimg=suffix;
				// 	if(filename.length<0){
				// 		this.uploadname=filename
				// 	}else{
				// 		this.uploadname=filename.substr(0,10)+".."
				// 	};
				// 	this.uploadformat=suffix;
			},
			gethomework(item) {
				window.open(API.urls.gethomework+"?id="+item.id+"&token="+getToken());
			},
			viewhonework(item){
            	this.filelog=true;
				this.bigfileUrl=item.linkUrl;
			},
			
		},
		components: {
			modal
		}
	}
</script>
<style scoped lang="less">
.comment {
	margin-top: 20px;
}
.comment-list {
	padding-top: 20px;
	padding-left: 16px;
	li {
		padding-left: 30px;
    	padding-bottom: 14px;
    	.avatar {
    		float: left;
    		margin-top: 15px;
    		img {
    			border-radius: 50%;
			    width: 40px;
			    height: 40px;
    		}
    	}
       .dis{
    		padding-bottom: 10px;
    	}
       .zm {
          color: #717171;
          padding-left: 15px;
        }
    	.cont {
    		float: left;
		    padding-top: 6px;
		    padding-left: 16px;
		   	padding-bottom: 6px;
		    color: #333;
		    width: 70%;
		    border-left: 2px solid #9dcece;
		    margin-left: 12px;
		    img {
		    	display: inline-block;
		    	vertical-align: middle;
		    }
		    h3 {
		    	font-size: 18px;
    			color: #333;
    			padding-bottom: 18px;
    			margin-bottom: 0;
		    }
		    .time {
				font-size: 14px;
    			padding-top: 8px;
				display: inline-block;
				color: #999;
				margin-left: 10px;
		    }
		    .desc {
		    	line-height: 25px;
			    width: 85%;
			    font-size: 16px;
			    color: #333;
		    }
    	}
	}
}
.goback {
	display: inline-block;
	font-size: 16px;
	color: #333;
	line-height: 1em;
	margin-top: 25px;
	margin-bottom: 13px;
	padding-left: 16px;
	cursor: pointer;
	
}
.content {
	padding: 0;
}
.viewwork h2 {
	font-size: 18px;
	color: #ff6c00;
	margin: 0 10px;
	padding-left: 12px;
	line-height: 50px;
	border-bottom: 1px solid #ededed;
}
.work-details {
	padding: 17px 22px 16px;
	h3 {
		color: #333;
		font-size: 16px;
		line-height: 1em;
		margin-bottom: 20px;
	}
	dd {
		font-size: 14px;
		color: #666;
		line-height: 1.6em;
		margin-bottom: 10px;
		position: relative;
		i {
			position: absolute;
			left: 0;
			top: 4px;
		}
	}
	.text {
		display: block;
		margin-left: 20px;
	}
	.work-img {
		padding-left: 20px;
		img {
			float: left;
			width: 90px;
			height: 90px;
			margin-right: 10px;
			border-radius: 5px;
		}
	}
}
.work-save {
	margin-top: 20px;
	.title {
		img {
			float: right;
			width: 57px;
			height: auto;
			margin-top: 5px;
		}
	}
}
.icon-word2 {
    display: inline-block;
    width: 29px;
    height: 29px;
    background: url("../../assets/images/icon/icon-word2.png") center center no-repeat;
    background-size: 100% 100%;
}
.icon-video {
    display: inline-block;
    width: 29px;
    height: 29px;
    background: url("../../assets/images/icon/icon-video.png") center center no-repeat;
    background-size: 100% 100%;
}
.icon-ppt {
    display: inline-block;
    width: 29px;
    height: 29px;
    background: url("../../assets/images/icon/icon-ppt.png") center center no-repeat;
    background-size: 100% 100%;
}
/*修改样式*/
.btn-modify {
	float: right;
	padding: 7px 24px 7px 20px;
	margin-top: 10px;
}
.modify-wrap {
	padding: 25px;
	line-height: 1.5em;
	clear: both;
	overflow: hidden;
	position: relative;
	>li {
		margin-bottom: 25px;
		position: relative;
		&:last-child {
			margin-bottom: 0;
		}
		.sub-side {
			width: 100px;
			font-size: 16px;
			color: #333;
			position: absolute;
		}
		.file-side {
			position: static;
		}
		.right {
			float: none;
			padding-left: 100px;
			font-size: 16px;
		}
	}
	.modify-img {
		margin-top: 20px;
		img {
	
			width: 80px;
			height: 80px;
			margin-right: 10px;
			border-radius: 5px;
		}
	}
	.modify-file-list {
		li{
			position: relative;
			margin-bottom: 10px;
			cursor: pointer;
			&.disabled {
				color: #999;
				&:hover {
					color: #999;
				}
			}
			&:hover {
				color: #0077ff;
			}
		}
		i {
			vertical-align: middle;
			margin-right: 10px;
		}
		.status {
			float: right;
			color: #0077ff;
			font-size: 14px;
		}
	}
}
.tip {
	font-size: 14px;
	color: #666;
}
.viewhomework{
  cursor: pointer;
}
.uploaddown{
  margin-left:10px; 
}
</style>