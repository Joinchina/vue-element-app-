<template>
	<div class="dowork">
		<span @click="goback" class="goback" v-if="origin !== 'live'">
			<i class="el-icon-d-arrow-left"></i>
			返回
		</span>
		<span class="goback" v-else></span>
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
					<dd class="work-img clearfix" v-if="!!workNote.pictureList">
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
			
			<!-- 详情 -->
			<template v-if="!modifyHomework">
				<div class="work-save content">
					<h2 class="clearfix">
						我的作业 
						<!-- <a class="btn-ora-line btn-modify" href="javascript:;" @click="modifyHomework = true">
							<i class="el-icon-edit"></i>
							修改
						</a> -->
					</h2>
					<ul class="modify-wrap">
						<li class="modify-title">
							<label class="sub-side">作业标题：</label>
							<p class="right text">{{workDetails.title}}</p>
						</li>
						<li class="modify-cont">
							<label class="sub-side">作业内容：</label>
							<div class="right" >
								<p class="text">{{workDetails.content}}</p>
								<div class="modify-img" v-if="workDetails.pictureList">
									<img v-for="item in workDetails.pictureList" :src="item.transUrl">
								</div>
							</div>
						</li>
						<li class="modify-file-wrap">
							<label class="sub-side file-side">我的附件：</label>
							<ul class="modify-file-list right attachment" v-if="workDetails.attachmentList">
								<li v-for="item in workDetails.attachmentList">
									<i v-if="item.type == 'WORD'" class="icon-word2"></i>
						    		<i v-if="item.type == 'PPT'" class="icon-ppt"></i>
						    		<i v-if="item.type == 'VIDEO'" class="icon-video"></i>
									{{item.type == 'VIDEO' ? item.name.split('/').pop() :item.name}}
								</li>
							</ul>
						</li>
					</ul>
				</div>
				
			</template>
			<!-- 修改 -->
			<div v-if="modifyHomework" class="work-save content">
				<h2>我的作业</h2>
				<section  class="form-wrap" id="form1">
					<el-form ref="form" :rules="rules" :model="form" label-width="120px">
						<el-form-item label="作业标题：" prop="title" >
						    <el-input v-model.trim="form.title" placeholder="20字以内（必填）"></el-input>
						</el-form-item>
						<el-form-item label="作业内容：" prop="content"  label-width="120px">
						    <el-input type="textarea" v-model.trim="form.content" placeholder="10000字以内（必填）" ></el-input>
						    
						    <span class="words-count">字数：<i class="curr-words">{{form.content.length}}</i>/10000</span>
						</el-form-item>
						<el-form-item label="" label-width="120px" class="clearfix">
							<ul class="img-wrap clearfix" >
								<!-- <li v-if="pictureList.length != 0" v-for="(item, index) in pictureList" :key="index">
									<img :src="item.transUrl" >
									<span class="icon-dis-error del" :data-id="item.id" @click="delPic(index, item.id $event)"></span>
								</li> -->
								<!-- 编辑作业 -->
								<li v-if="workDetails.pictureList" v-for="(item, index) in workDetails.pictureList" :key="item.id" :data-ind="index">
									<img :src="item.transUrl">
									<span class="icon-dis-error del" :data-id="item.id" @click="delPic(index, item.id, $event)"></span>
								</li>
								<li v-if="filesList" v-for="(item, index) in filesList" :key="item.transUrl" >
									<img :src="item.transUrl">
									<span class="icon-dis-error del"  @click="delPic2(index, $event)"></span>
								</li>
								
								<!-- 做作业 -->
								<!-- <li v-if="workDetails.pictureList" v-for="(item, index) in workDetails.pictureList" :key="item.id" :data-ind="index">
									<img :src="item.transUrl" >
									<span class="icon-dis-error del" :data-id="item.id" @click="delPic(index, item.id, $event)"></span>
								</li>
								<li v-if="filesList" v-for="(item, index) in filesList" :key="item.transUrl" >
									<img :src="item.transUrl">
									<span class="icon-dis-error del"  @click="delPic2(index, $event)"></span>
								</li> -->
								<li id="addImg">
									<label for="fileName" class="add-img">
										<i class="el-icon-plus"></i>
									</label>
									<input type="file" class="add-img0" multiple="true" id="fileName" name="form.files" accept="image/png,image/gif,image/jpeg" @change="selphoto($event)">
								</li>
							</ul>
							
						</el-form-item>
						<el-form-item label="上传附件：" label-width="120px">
						    <button type="button" class="btn-ora-line add" @click="attachmentUpload">
						    	<i class="el-icon-circle-plus"></i>
						    	点击上传
						    </button>
						    <p class="tip">附件支持Word、PPT、MP4格式 附件最多上传5份</p>
						    <ul class="attachment" v-if="attachmentList">
						    	<li v-for="(item,index) in attachmentList" :key="item.id" class="clearfix">
						    		<i v-if="item.type == 'WORD'" class="icon-word2"></i>
						    		<i v-if="item.type == 'PPT'" class="icon-ppt"></i>
						    		<i v-if="item.type == 'VIDEO'" class="icon-video"></i>
						    		<span class="text">{{item.type == 'VIDEO' ? item.name.split('/').pop() :item.name}}</span>
						    		
						    		<span class="el-icon-error" @click="attachmentDel(index, $event)"></span>
						    		<span class="el-icon-success"></span>
						    	</li>
						    	
						    	
						    </ul>
						</el-form-item>
						<el-form-item class="btn-wrap">
							<template v-if="!!id">
								<button type="button" class="btn-ora update" @click="!submiting && submitForm('form', 'update')">重新提交</button>
							    <!-- <el-button class="btn-gray-line" @click="getWork">取消</el-button> -->
							</template>
							<template v-else>
								<button type="button" class="btn-ora-line" @click="!submiting && staging('form')">暂存</button>
						    	<button type="button" class="btn-ora" @click="!submiting && submitForm('form')">提交</button>
							</template>
							    
						</el-form-item>
					</el-form>
				</section>
				
			</div>
		</section>
		<!-- 上传附件 -->
		<v-update
			:dialogUpdate.sync="showUpdate"
			:workId="workId"
			@uploadfile="uploadfile">
		</v-update>
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
	import vUpdate from '@/pages/work/update'
	import Modal from '@/components/modal/modal.vue'
	import API from '@/fetch/api'
	import { getToken } from '@/utils/common'
	export default {
		data() {
			return {
				modifyHomework: true,
				workDetails: {},	//作业详情
				workNote: {},  //作业要求
				//workimg:"",
				form: {
					title: '',
					content: '',
					type: 'commit',
					files: [],	//图片集合
					ids: [],   // 上传附件id数组
					ids2: [],	// 删除图片id数组
				},
				rules: {
					title: [
						{required: true, message: '您还未填写作业主题呢', trigger: 'blur'},
						{max: 20, message: '作业标题请输入20字以内', trigger: 'blur'}
						],
					content: [
						{required: true, message: '您还未输入作业内容', trigger: 'blur'},
						{ type: 'string', max:10000, message: '作业内容请输入10000字以内', trigger: 'blur' }
						]
				},
				num: 0,		// 上传图片数量，最多9张。
				pictureList: [],  // 已存在图片列表
				filesList: [],		// 本地图片列表
				showUpdate: false,	//上传附件
				attachmentList: [],		//附件列表
				id: '',					// 作业id 如果是编辑作业，有id
				saveFlag: false,		// 编辑内容是否已保存
				submiting: false,		// 请求中 为 true 时，不可再次请求
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
			scan() {
				// 扫码登录标识scan
				return this.$route.query.login;
			},
			origin(){
				return this.$route.query.origin
			}
		},
		mounted() {
			this.getWork();
		},
		methods: {
			
			goback() {
				if(this.scan == 'scan') {
					this.$router.push({path:"/index"})
				} else {
					this.$router.go(-1)
				}
			},
			getWork() {
				let data = {
					"activityId": this.workId
				}
				work.getWorkDetails(data, (res => {
					if(res.status == 200) {
						// console.log(res.data)
						this.workNote = res.data;
						this.workimg=this.workNote.publishhomeworkAttachmentList || [];
						//this.getworkid=res.data.publishhomeworkAttachmentList ? res.data.publishhomeworkAttachmentList[0].id : '';
						if(res.data.homework) {
							this.workDetails = res.data.homework;
							this.form.title = res.data.homework.title;
							this.form.content = res.data.homework.content;
							// this.form.content = res.data.homework.content.replace(/[\r]/g, '');
							this.attachmentList = res.data.homework.attachmentList || [];
							this.pictureList = res.data.homework.pictureList || [];
							this.num = res.data.homework.pictureList ? res.data.homework.pictureList.length : 0;
							this.id = res.data.homework.id;
							// 添加图片按钮
							if(this.num >= 9) {
								document.getElementById("addImg").style.display = "none";
							}
							// 判断是修改作业，还是做作业
							if(!!res.data.homework.id) {
								this.form.type = 'update';
							} 
							
						}
						if(this.workNote.publishhomeworkAttachmentList){
							this.fileList=this.workNote.publishhomeworkAttachmentList || [];
						}
						
					} else {
						this.$message.error(res.message);
					}
				}),(res => {
					console.log("详情 error " ,res);
					// this.$message.error("请求有误, 请检查网络");
				}));
			},
			gethomework(item) {
				window.open(API.urls.gethomework+"?id="+item.id+"&token="+getToken());
			},
			viewhonework(item){
            	this.filelog=true;
				this.bigfileUrl=item.linkUrl;
			},
			// 选择照片
			selphoto(event) {
				// console.log("num", this.num);
				if(this.num >= 9) {
					this.$message.error("最多只能添加9张图片");
					document.getElementById("addImg").style.display = "none";
					return;
				} 
				let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
				if(extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
					let objUrl = event.target.files[0];
					this.form.files.push(objUrl);
					let windowURL = window.URL || window.webkitURL;
					let imgUrl = windowURL.createObjectURL(objUrl);
					this.filesList.push({transUrl: imgUrl});
					this.num++;
					console.log("本地图片", this.filesList);
				} else {
					// 清空非图片文件
					document.getElementById("fileName").value = "";
				}
				
				if(this.num >= 9) {
					document.getElementById("addImg").style.display = "none";
					return;
				}
				console.log("选择本地图片 ",this.form.files);
			},
			// 删除照片
			delPic(index,id, event) {
				
				this.num--;
				if(this.num == 0) {
					this.num =0;
				}
				if(this.num < 9) {
					document.getElementById("addImg").style.display = "block";
				}
				
				// 兼容编辑返回图片和本地图片
				if(id) {
					this.form.ids2.push(id);
				} 
				this.workDetails.pictureList.splice(index,1);
				
			},
			delPic2(index,id, event) {
				
				this.num--;
				if(this.num == 0) {
					this.num =0;
				}
				if(this.num < 9) {
					document.getElementById("addImg").style.display = "block";
				}
				// 删除本地图片
				this.filesList.splice(index,1);
				this.form.files.splice(index,1);
				console.log("删除本地图片",this.form.files);
				
				document.getElementById("fileName").value = "";
			},
			submitForm(formName, type) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.postWork();
						
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			// 暂存
			staging(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.postWorkDraft();
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			resetForm(formName) {
		        this.$refs[formName].resetFields();
		    },
			postWork() {
				this.form.ids = [];
				this.attachmentList.map((item) => {
					this.form.ids.push(item.id);
				})
				
				let data = {
					"activityId": this.workId,
					"title": this.form.title,
					"content": this.form.content,
					"type": this.form.type,
					"ids": this.form.ids,
					"ids2": this.form.ids2
				}
				// console.log("提交=", this.form.content.length);
				// console.log("files ==== ", this.form.files);
				this.submiting = true;
				work.postWork(data,this.form.files, (res => {
					console.log("post res",res)
					if(res.status == 200) {
						this.saveFlag = true;
						console.log('提交成功');
						this.$message.success('提交成功');
						this.form.type = 'update';
						
						// 更新数据
						this.getWork();
						// 成功后清除数组
						this.form.ids2 = [];
						this.form.files=[];
						this.filesList = [];
						// 返回我的列表
						this.$router.push({
							path:"/index"
						})
						this.submiting = false;
					}  else if (res.status == 205){
						if(res.message!="作业已过期"){
							if(data.type == 'update') {
								this.$message.error(res.message);
							} 
							if(data.type == 'commit') {
								this.confirmTip();
							}
						}else{
							this.$message.error(res.message);
						}
						// 更新数据
						this.getWork();
						// 成功后清除数组
						this.form.ids2 = [];
						this.form.files=[];
						this.filesList = [];
						this.submiting = false;
						
					} else {
						this.$message.error(res.message);
						// 成功后清除数组
						this.form.ids2 = [];
						this.form.files=[];
						this.filesList = [];
						this.submiting = false;
					}
				}), (res => {
					// 失败后清除数组
					this.form.ids2 = [];
					this.form.files=[];
					this.filesList = [];
					this.$message.error("页面访问出错，请刷新");
					this.submiting = false;
				}));
			},
			confirmTip() {
				this.$confirm('作业已提交，是否直接替换', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.resetPostWork();
				}).catch(() => {
					// this.$message({
					// 	type: 'info',
					// 	message: '已取消'
					// });
				});
			},
			resetPostWork() {
				this.form.ids = [];
				this.attachmentList.map((item) => {
					this.form.ids.push(item.id);
				})
				let data = {
					"activityId": this.workId,
					"title": this.form.title,
					"content": this.form.content,
					"type": 'update',
					"ids": this.form.ids,
					"ids2": this.form.ids2
				}
				// console.log("data 提交 ",data);
				work.postWork(data,this.form.files, (res => {
					// console.log("post res",res)
					if(res.status == 200) {
						this.saveFlag = true;
						console.log('提交成功');
						this.$message.success('提交成功');
						// 更新数据
						this.getWork();
						// 成功后清除数组
						this.form.ids2 = [];
						this.form.files=[];
						// 返回我的列表
						setTimeout(()=>{
							this.$router.push({
								path:"/index"
							})
						}, 3000)
					} else if(res.status == 205){
						if(res.message=="作业已过期"){
							this.$message.error(res.message);
						}else{
							this.confirmTip();
						}
					} else {
						this.$message.error(res.message);
					}
				}), (res => {
					console.log("error", res);
					this.$message.error("页面访问出错，请刷新");
				}));
			},
			postWorkDraft() {
				this.form.ids = [];
				this.attachmentList.map((item) => {
					this.form.ids.push(item.id);
				})
				let data = {
					"activityId": this.workId,
					"title": this.form.title,
					"content": this.form.content,
					"ids": this.form.ids,
					"ids2": this.form.ids2
				}
				this.submiting = true; //请求中
				work.postWorkDraft(data, this.form.files, (res => {
					// console.log("暂存 ",res)
					if(res.status == 200) {
						this.saveFlag = true;
						this.$message.success('暂存成功');
						// 更新数据
						this.getWork();
						// 成功后清除数组
						this.form.ids2 = [];
						this.form.files=[];
						this.filesList = [];
						document.getElementById("fileName").value = "";
						this.submiting = false;
					} else {
						this.$message.error(res);
						this.submiting = false;
						// 更新数据
						this.getWork();
						// 成功后清除数组
						this.form.ids2 = [];
						this.form.files=[];
						this.filesList = [];
						document.getElementById("fileName").value = "";
					}
				}), (res => {
					console.log("error", res);
					this.submiting = false;
					// 更新数据
					this.getWork();
					// 成功后清除数组
					this.form.ids2 = [];
					this.form.files=[];
					this.filesList = [];
					document.getElementById("fileName").value = "";
					this.$message.error("页面访问出错，请刷新");
				}))
			},
			attachmentUpload() {
				if(this.attachmentList.length == 5) {
					this.$message.error("附件最多上传5份");
					return;
				}
				this.showUpdate = true;
			},
			// 添加附件
			uploadfile(data) {
				this.attachmentList.push(data);
			},
			attachmentDel(index, event){
				this.attachmentList.splice(index, 1);
			}
		},
		// beforeRouteLeave(to, from, next) {
		// 	if(this.saveFlag == false) {
		// 		next(false)
		// 		this.$confirm('作业未保存，确定离开吗？', '提示', {
		// 			confirmButtonText: '确定',
		// 	        cancelButtonText: '取消',
		// 	        type: 'warning'
		// 		}).then(() => {
		// 			next()
		// 		}).catch(() => {
		// 			console.log('留在当前页面');
		// 		});
		// 	}
		// },
		components: {
			vUpdate,
			Modal
		}
	}
</script>
<style scoped>
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
.dowork h2 {
	font-size: 18px;
	color: #ff6c00;
	margin: 0 10px;
	padding-left: 12px;
	line-height: 50px;
	border-bottom: 1px solid #ededed;
}
.work-details {
	padding: 17px 22px 16px;
	
}
.work-details .dis{
	padding: 0 0 10px 0;
}
.work-details h3 {
	color: #333;
	font-size: 16px;
	line-height: 1em;
	margin-bottom: 20px;
}
.work-details dd {
	font-size: 14px;
	color: #666;
	line-height: 1.6em;
	margin-bottom: 10px;
	position: relative;
}
.work-details i {
	position: absolute;
	left: 0;
	top: 4px;
}
.work-details .text {
	display: block;
	margin-left: 20px;
}
.work-details .work-img {
	padding-left: 20px;
	
}
.work-details .work-img img {
	float: left;
	width: 90px;
	height: 90px;
	margin-right: 10px;
	border-radius: 5px;
}
.work-save {
	margin-top: 20px;
}
.work-save .form-wrap {
	padding: 32px 30px 0px 0;
}
.el-form >>> .el-form-item__label {
	font-size: 16px;
}
.el-form >>> .el-textarea__inner {
	height: 218px;
	box-sizing: border-box;
}
.words-count {
	font-size: 14px;
	color: #aab7c9;
	position: absolute;
    right: 20px;
    top: 210px;
}
.curr-words {
	color: #ff8d00;
}
.img-wrap li{
	position: relative;
	float: left;
	margin-right: 10px;
	
}
.img-wrap li img {
	width: 80px;
	height: 80px;
	border-radius: 5px;
}
.img-wrap .del {
	position: absolute;
	top: -8px;
	right: -8px;
	display: block;
	width: 17px;
	height: 16px;
	background: url("../../assets/images/icon/icon-dis-error.png") 0 0 no-repeat;
	background-size: 100% 100%;
	cursor: pointer;
}
#addImg {
	float: left;
}
#addImg .add-img {
	box-sizing: border-box;
	display: block;
	width: 80px;
	height: 80px;
	border-radius: 5px;
	border: 1px dashed #dee5ed;
	color: #8f96a0;
	text-align: center;
	font-size: 20px;
	line-height: 80px;
	cursor: pointer; 
}
#addImg  .add-img0 {
	display: none;
}
.btn-wrap {
	text-align: right;
	padding-bottom: 30px;
}
.btn-ora-line {
	padding: 8px 50px;
	margin-right: 20px;
}
.btn-gray-line {
	padding: 9px 45px;
}
.btn-ora-line.add {
	padding: 9px 12px;
}
.btn-ora {
	display: inline-block;
    font-size: 16px;
    background-color: #ff8d00;
    color: #fff;
    padding: 10px 50px;
    border-radius: 4px;
    line-height: 1em;
    transition: all .5s;
    margin-right: 10px;
}
.btn-ora.update {
	padding: 10px 30px;
	margin-right: 0;
}
.btn-ora:hover {
    background-color: #e86801;
}
.attachment {
}
.attachment li {
	position: relative;
	height: 40px;
}
.attachment li .text {
	margin-left: 40px;
	width: 790px;
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.attachment li i {
	position: absolute;
	vertical-align: middle;
	top: 5px;
}
.attachment .el-icon-success {
	color: #66c23a;
	float: right;
    line-height: 40px;
}
.attachment .el-icon-error {
	display: none;
	color: #e31529;
	float: right;
    line-height: 40px;
    cursor: pointer;
}
.attachment li:hover .el-icon-success {
	display: none;
}
.attachment li:hover .el-icon-error {
	display: block;
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
	padding-left: 24px;
	padding-right: 24px;
	margin-top: 8px;
}
.modify-wrap {
	padding: 25px;
	line-height: 1.5em;
	clear: both;
	overflow: hidden;
}
.modify-wrap>li {
	margin-bottom: 25px;
	position: relative;
}
.modify-wrap>li:last-child {
	margin-bottom: 0;
}
.modify-wrap>li .sub-side {
	width: 100px;
	font-size: 18px;
	color: #333;
	position: absolute;
}
.modify-wrap>li .file-side {
	position: static;
}
.modify-wrap>li .right {
	float: none;
	padding-left: 100px;
	font-size: 16px;
}
.modify-img {
	margin-top: 10px;
}
.modify-img img {
	
	width: 80px;
	height: 80px;
	margin-right: 10px;
	border-radius: 5px;
}
.modify-file-list li{
	margin-bottom: 10px;
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