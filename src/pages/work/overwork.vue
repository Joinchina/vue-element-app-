<template>
	<div class="overwork">
		<span @click="$router.history.go(-1)" class="goback">
			<i class="el-icon-d-arrow-left"></i>
			返回
		</span>
		<section class="">
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
					<dd v-if="fileList.length > 0">
 
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
			<div class="over-tip">
				<img src="../../assets/images/index/empty.png" alt="">
				<p>作业已过期！</p>
			</div>
        
		</section>
        <!-- 查看作业附件 -->
		<Modal :show.sync = "filelog" contWidth = '80%' bgColor="transparent">
			<div slot="body" class="w-transparent" style="height:100%;height:100%">        
				<iframe :src="bigfileUrl" id="iframepdf" frameborder="0" width="100%" height="100%"></iframe>			
             </div>
		</Modal>
	</div>
</template>
<script>
	import work from '@/model/work/work'
	import Modal from '@/components/modal/modal.vue'
	import API from '@/fetch/api'
	import { getToken } from '@/utils/common'
	export default {
		data() {
			return {
				workNote: {},  //作业要求
				//workimg:"",
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
                        //this.workimg=this.workNote.publishhomeworkAttachmentList;
						//this.getworkid=res.data.publishhomeworkAttachmentList[0].id;						
						// 将获取到的信息显示到页面上
						// if(this.workimg){
						// 	this.getuploadname(res.data)
						// }
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
			//更改显示附件名
			// getuploadname(data){
			// 	// console.log(data)
			// 	this.filename=data.publishhomeworkAttachmentList[0].name;
			// 	this.fileUrl=data.publishhomeworkAttachmentList[0].linkUrl;
			// 	this.uploaddown=data.publishhomeworkAttachmentList[0].originalUrl;
			// 		let num=this.filename.lastIndexOf(".");
			// 		let suffix=this.filename.substring(num);
			// 		let filename=this.filename.substr(0,num);
			// 		this.uploadimg=suffix;
			// 		if(filename.length<0){
			// 			this.uploadname=filename
			// 		}else{
			// 			this.uploadname=filename.substr(0,10)+".."
			// 		};
			// 		this.uploadformat=suffix;
			// },
			gethomework(item) {
				window.open(API.urls.gethomework+"?id="+item.id+"&token="+getToken());
			},
			viewhonework(item){
	            this.filelog=true;
				this.bigfileUrl=item.linkUrl;
			},
		},
		components: {
			Modal
		}
	}
</script>
<style scoped lang="less">
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
.overwork h2 {
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
	}
	i {
		position: absolute;
		left: 0;
		top: 4px;
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
.over-tip {
	padding-top: 50px;
	>img {
		width: 162px;
		height: 182px;
		display: block;
		margin: 0 auto;
	}
	p {
		text-align: center;
		color: #333;
		line-height: 1.6em;
	}
}
.viewhomework{
	cursor: pointer;
}
</style>