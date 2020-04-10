<template>
	<div class="dowork">
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
				</dl>
			</div>

			<div class="work-save content">
				<h2>做作业</h2>
				<section  class="form-wrap" id="form1">
					<el-form ref="form" :rules="rules" :model="form" label-width="120px">
						<el-form-item label="作业标题：" prop="title" >
						    <el-input v-model="form.title" placeholder="20字以内（必填）"></el-input>
						</el-form-item>
						<el-form-item label="作业内容：" prop="content"  label-width="120px">
						    <el-input type="textarea" v-model="form.content" placeholder="10000字以内（必填）"></el-input>
						    <span class="words-count">字数：<i class="curr-words">{{form.content.length}}</i>/10000</span>
						</el-form-item>
						<el-form-item label="" label-width="120px" class="clearfix">
							<ul class="img-wrap clearfix" >
								<li v-if="imgUrls.length != 0" v-for="(item, index) in imgUrls" :key="index">
									<img :src="item" >
									<span class="icon-dis-error del" @click="delPic(index, $event)"></span>
								</li>
								<!-- <li>
									<img src="http://i3.sinaimg.cn/travel/2013/1203/U8159P704DT20131203151734.jpg" alt="">
									<span class="icon-dis-error del" @click=""></span>
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
						    <p>附件支持Word、PPT、MP4格式 附件最多上传5份</p>
						    <ul class="attachment" v-if="attachmentList">
						    	<li v-for="(item,index) in attachmentList" :key="item.id" class="clearfix">
						    		<i v-if="item.type == 'WORD'" class="icon-word2"></i>
						    		<i v-if="item.type == 'PPT'" class="icon-ppt"></i>
						    		<i v-if="item.type == 'VIDEO'" class="icon-video"></i>
						    		{{item.name}}

						    		<span class="el-icon-error" @click="attachmentDel(index, $event)"></span>
						    		<span class="el-icon-success"></span>
						    	</li>
						    	
						    	
						    </ul>
						</el-form-item>

						<el-form-item class="btn-wrap">
						    <button type="button" class="btn-ora-line" @click="staging('form')">暂存</button>
						    <button type="button" class="btn-ora" @click="submitForm('form')">提交</button>
						</el-form-item>
					</el-form>
				</section>
				
			</div>
		</section>

		<!-- 上传附件 -->
		<v-update
			:dialogUpdate.sync="showUpdate"
			:workId="workId"
			@uploadfile="uploadfile"></v-update>
	</div>
</template>
<script>
	import work from '@/model/work/work'
	import vUpdate from '@/pages/work/update'
	export default {
		data() {
			return {
				workNote: {},  //作业要求
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
						{max: 30, message: '作业标题请输入30字以内', trigger: 'blur'}
						],
					content: [
						{required: true, message: '您还未输入作业内容', trigger: 'blur'},
						{ max:10000, message: '作业内容请输入10000字以内', trigger: 'blur' }
						]
				},
				num: 0,		// 上传图片数量，最多9张。
				imgUrls: [],  // 本地上传图片地址
				showUpdate: false,	//上传附件
				attachmentList: [],		//附件列表
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
					} else {
						this.$message.error(res.message);
					}
				}),(res => {
					this.$message.error("请求有误，请检查网络");
				}));

			},
			
			// 选择照片
			selphoto(event) {
				if(this.num == 9) {
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
					this.imgUrls.push(imgUrl);
				}
				this.num++;
				if(this.num == 9) {
					document.getElementById("addImg").style.display = "none";
					return;
				}
			},
			// 删除照片
			delPic(index, event) {
				this.num--;
				if(this.num == 0) {
					this.num =0;
				}
				if(this.num < 9) {
					document.getElementById("addImg").style.display = "block";
				}
				this.imgUrls.splice(index,1);
				this.form.files.splice(index,1);
				document.getElementById("fileName").value = "";
			},
			submitForm(formName) {
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
				// console.log("data 首次提交 ", data);
				work.postWork(data,this.form.files, (res => {
					// console.log("post res",res)
					if(res.status == 200) {
						console.log('提交成功');
						this.$message.success('提交成功');
					} else if(res.status == 205){
						this.confirmTip();
					} else {
						this.$message.error(res.message);
					}
				}), (res => {
					this.$message.error("请求有误，请检查网络");
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
						console.log('提交成功');
						this.$message.success('提交成功');
					} else if(res.status == 205){
						this.confirmTip();
					} else {
						this.$message.error(res.message);
					}
				}), (res => {
					this.$message.error("请求有误，请检查网络");
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
				work.postWorkDraft(data, this.form.files, (res => {
					// console.log("暂存 ",res)
					if(res.status == 200) {
						// console.log('暂存成功')
						this.$message.success('暂存成功');
						// this.resetForm('form');
					} else {
						this.$message.error(res);
					}

				}), (res => {
					console.log("error", res);
					this.$message.error("请求有误，请检查网络");
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
				// console.log("添加附件内容 ",data)
				
				
				this.attachmentList.push(data);
			},
			attachmentDel(index, event){
				this.attachmentList.splice(index, 1);
			}
		},
		
		components: {
			vUpdate
		}
	}
</script>
<style scoped >
.goback {
	display: inline-block;
	font-size: 18px;
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
.work-details h3 {
	color: #333;
	font-size: 18px;
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
	font-size: 18px;
}
.el-form >>> .el-textarea__inner {
	height: 218px;
	box-sizing: border-box;
	padding-bottom: 34px;
}
.words-count {
	font-size: 14px;
	color: #aab7c9;
	position: absolute;
    right: 20px;
    margin-top: -34px;
}
.curr-words {
	color: #ff8d00;
}
.img-wrap li{
	position: relative;
	float: left;
	margin-right: 12px;
	
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
}
.btn-ora:hover {
    background-color: #e86801;
}
.attachment {
	padding-right: 50%;
}
.attachment i {
	margin-right: 10px;
	vertical-align: middle;
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
.attachment:hover .el-icon-success {
	display: none;
}
.attachment:hover .el-icon-error {
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
</style>