<template>
	<div id="update">
		<el-dialog 
			class="dialog-form" 
			title="添加附件"
			:visible.sync="dialogUpdate"
			:close-on-click-modal="false"
			:before-close="close"
			@open="open"
			>
			<div  v-loading="loading" :element-loading-text="loadingText">
			
			<el-form :model="ruleForm0"  ref="ruleForm0">
				<el-form-item label="选择文件：" prop="type" 
					:label-width="labelWidth"
					:rules="[
								{ required: true, message: '请选择文件类型', trigger: 'change'}
							]"
					>
					
					<el-radio-group v-model="type" @change="toggleTabs">
					    <el-radio 
					    	v-for="item,index in tabnav" 
					    	
					    	:key="index" 
					    	:label="index"
					    	>{{item}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			
			<el-form :model="ruleForm" ref="ruleForm">
				<!-- word -->
				<template v-if="nowIndex === 'WORD'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'blur'}
							]"
						>
						<label for="file" class="sel-btn btn-ora-line">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=" application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"  @change="selFiles($event)">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<div class="tip">
							<p>注意：Word / PPT / 大小在5M以内</p>
						</div>
					</el-form-item>
				</template>
					
				<!-- ppt -->
				<template v-if="nowIndex === 'PPT'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'blur'}
							]"
						>	
						<label for="file" class="sel-btn btn-ora-line">选择文件</label>
						<input type="file" class="sel-file" id="file" name="ruleForm.file" accept=".ppt,.pptx"  @change="selFiles($event)">
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						
						<div class="tip">
							<p>注意：Word / PPT / 大小在5M以内</p>
							
						</div>
					</el-form-item>
				</template>
				<!-- 视频 -->
				<template v-if="nowIndex === 'VIDEO'">
					<el-form-item label="选择文件：" prop="filename" class="update-file"
						:label-width="labelWidth"
						:rules="[
								{ required: true, message: '请选择文件', trigger: 'blur'}
							]"
						>
						<!-- 视频 -->
						<label for="file" class="sel-btn btn-ora-line">选择文件</label>
						<input type="file" class="sel-file" id="file" @change="selFiles($event)" accept=".mp4"/>
						<span v-if="ruleForm.filename" class="file-name">{{ruleForm.filename}}</span>
						<!-- <span>上传进度：{{percentage}} {{percentage===1?"success!":(percentage===0?'waiting...':'uploading')}}</span> -->

						<!-- 视频 -->
						<div class="tip">
							<p>注意：视频大小在50M 以内</p>
						</div>
					</el-form-item>
				</template>
				<div class="help">
					<p class="clearfix">
						<span>帮助：</span>
						<span>
							<a target="_blank" href="http://www.jianshu.com/p/65b779451777">查看PPT压缩教程</a>
							<a target="_blank" href="https://baijiahao.baidu.com/s?id=1567371015161559&wfr=spider&for=pc">查看视频压缩教程</a>
						</span>
					</p>
				</div>
			</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn-gray-line" @click="close">关闭</el-button>
				<button type="button" class="btn-ora" @click="!loading && submitForm('ruleForm')">上传文件</button>
				
			</div>
		</el-dialog>
	</div>
</template>
<script>
import work from '@/model/work/work'
import storage from '@/utils/storage'
export default {
	data() {
		return {
			tabnav: {
				'WORD': 'Word',
				'PPT': 'PPT',
				'VIDEO': '视频'
			},
			ruleForm0: {
				type: 'WORD'
			},
			type: 'WORD',
			nowIndex: 'WORD',
			ruleForm: {
				filename: '',
				file: ''
			},
			labelWidth: '125px',
			loading: false,
			loadingText: '',

			// 阿里云上传
	        percentage: 0,
	        aliyunName: '',
	        originalUrl: '',

		}
	},
	props: ['dialogUpdate', 'workId'],
	computed: {
		userId() {
			return storage.get('userId');
		}
	},
	methods: {
		open() {
			this.loading = false;
		},
		close() {
			this.$emit('update:dialogUpdate', false);
			this.resetForm('ruleForm');
			if(document.getElementById("file")) {
				document.getElementById("file").value = "";
			}
		},
		toggleTabs(index) {
			this.nowIndex = index;
			this.resetForm('ruleForm');
			if(document.getElementById("file")) {
				document.getElementById("file").value = "";
			}
		},
		selFiles(event) {
			let name = event.target.value;
			let type = name.split(".").pop();
			if(this.nowIndex == 'WORD' && !(type == 'doc' || type == 'docx')) {
				this.$message.error('此文件不是word文件');
				document.getElementById("file").value = "";
				return;
			} 
			if(this.nowIndex == 'PPT' && !(type == 'ppt' || type == 'pptx')) {
				this.$message.error('此文件不是PPT文件');
				document.getElementById("file").value = "";
				return;
			} 
			if(this.nowIndex == 'VIDEO' && !(type == 'mp4' || type == 'MP4')) {
				this.$message.error('此文件不是MP4类型');
				document.getElementById("file").value = "";
				return;
			} 
			this.ruleForm.filename = name.split("\\").pop();
			this.ruleForm.file = event.target.files[0];

			console.log("selFiles", type);
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
					// 限制文件大小
					if(this.nowIndex == 'WORD' || this.nowIndex == 'PPT') {
	    				let size = this.ruleForm.file.size;
	    				if(size < 5242880) {
	    					this.attachmentAdd();
	    					// this.doUpload();
	    				} else {
	    					this.$message.error("您上传文件不能超过5M！");
	    				}
	    			}
	    			if(this.nowIndex == 'VIDEO') {
	    				let size = this.ruleForm.file.size;
	    				if(size < 52428800) {
	    					this.doUpload();
	    				} else {
	    					this.$message.error("您上传文件不能超过50M！");
	    				}
	    			}

				}
			});
		},
		resetForm(formName) {
	        this.$refs[formName].resetFields();
	    },
		attachmentAdd() {
			let data = {
				activityId: this.workId,
				files: this.ruleForm.file,
			};
			this.loading = true;
			work.attachment(data, (res => {
				console.log("word ppt == ", res);
				if(res.status == 200) {
					
					this.close();
					this.$emit("uploadfile", {id: res.data.id, name: res.data.name, type: res.data.type});
					this.loading = false;
				} else {
					this.$message.error(res.message);
		    		this.loading = false;
				}
			}), (res => {
				// 加进度条
	    		let progress = Math.round(parseFloat(res.loaded/res.total)*100);
	    		this.loadingText = "文件上传中" + progress + '%';
			}), (res => {
				// this.$message.error("请求有误，请检查网络！");
				this.loading = false;
				console.log("error", res)
			}));

		},

		// 阿里云上传
		doUpload () {
	        const _this = this
	        this.loading = true;
	        let data = {
	        	activityId: this.workId
	        }
	        work.aliyunUpload(data, (result => {
	        	//console.log("result-aliyun ",result);

	        	if(result.status == 200) {
	        		const client = new OSS.Wrapper({
			            region: result.data.region,
			            accessKeyId: result.data.accessKeyId,
			            accessKeySecret: result.data.accessKeySecret,
			            stsToken: result.data.securityToken,
			            bucket: result.data.bucket
			        })
			        const dir = result.data.objectDir;	//上传路径
			        //console.log("client-事件", client);
			        _this.percentage = 0;
			        const files = document.getElementById("file")
			        if (files.files) {
			            const fileLen = document.getElementById("file").files

			            let resultUpload = ''
			            for (let i = 0; i < fileLen.length; i++) {
			              	const file = fileLen[i]
							  // 上传地址
							  let mathdata=Date.parse(new Date());
							  //获取视频的格式
							  let fileob=file.name;
							  let MP4=fileob.substr(fileob.lastIndexOf('.'))
							  let file_name = dir+mathdata+MP4;

			              	// console.log("上传地址 ", file_name);
			              	// 上传
			              	client.multipartUpload(file_name, file, {
		                		progress: function* (percentage, cpt) {
		                  			// 上传进度
		                  			_this.percentage = Math.round(percentage*100);
		                  			_this.loadingText = "文件上传中" + _this.percentage + '%';

		                		}
			              	}).then((results) => {
			                	// 上传完成
								// _this.aliyunName = results.name.split("/").pop();
								_this.aliyunName =fileob;
			                	_this.originalUrl = results.res.requestUrls[0];
			                	_this.aliyunAttachment(_this.aliyunName, _this.originalUrl);
			                	// console.log("上传成功返回结果  ", results, _this.originalUrl);
			              	}).catch((err) => {
			                	console.log("上传错误 ", err)
								
			                	this.loading = false;
			              	})
			            }
			        }
	        	} else {
	        		this.$message.error(result.message);
	        		this.loading = false;
	        	}

	        	
	        }))
      	},
      	// 阿里云上传服务器
      	aliyunAttachment(name, originalUrl) {
      		let data = {
      			name: name,
      			originalUrl: originalUrl
      		}
      		work.aliyunAttachment(data, (res => {
      			// console.log("VIDEO == ", res);
      			if(res.status == 200) {
      				const name = res.data.name.split("/").pop();
      				this.close();
					this.$emit("uploadfile", {id: res.data.id, name: name, type: res.data.type});
					this.loading = false;
      			} else {
      				this.$message.error(res.message);
		    		this.loading = false;
      			}
      		}), (res => {
      			// this.$message.error("请求有误，请检查网络！");
				this.loading = false;
				console.log("error", res);
      		}));
      	}

    },
}
</script>
<style scoped lang="less">
	#update {
		.update-file {
			
			.sel-btn {
				display: inline-block;
				font-size: 14px;
				border-radius: 3px;
				cursor: pointer;
			}
			.sel-file {
				position: absolute;
				left: 0;
				opacity: 0;
				height: 35px;
    			cursor: pointer;
			}
			.file-name {
				display: inline-block;
				margin-left: 15px;
				font-size: 16px;
				line-height: 1em;
				color: #333;
				padding: 7px 20px;
				background-color: #ededed;
			}
		}
		.tip,
		.help {
			font-size: 14px;
			line-height: 1.6em;
			color: #999;
			span {
				float: left;
			}
			a {
				display: block;
				text-decoration: underline;
				color: #3182d9;
			}
		}
		.help {
			padding-left: 40px;
		}
		.btn-ora {
			display: inline-block;
		    font-size: 16px;
		    background-color: #ff8d00;
		    color: #fff;
		    padding: 10px 24px;
		    border-radius: 4px;
		    line-height: 1em;
		    transition: all .5s;
		    cursor: pointer;
		    &:hover {
		    	background-color: #e86801;
		    }
		}
		.btn-gray-line {
			padding: 9px 24px;
			margin-right: 10px;
		}
	}
</style>