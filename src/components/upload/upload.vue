<template>
	<div>
		<div class="oss_file">
			<input type="file" :id="id" :multiple="multiple" @change="doUpload" />
		</div>
	</div>
</template>
<script>
	export default{
		props:{
			multiple:{
				type: Boolean,
				twoWay:false
			},
			id:{
				type: String,
				twoWay:false
			},
			url:{
				type: Array,
				twoWay:true
			}
		},
		data(){
			return{
				region:'oss-cn-beijing',
				bucket:'testopenbj',
			};
		},
		methods:{
			doUpload(){

				const _this = this;
				this.$axios.get('http://10.98.24.67:11112/aliyunoss/getUploadToken').then((result) => {
					console.log("result === ", result);
					const client = new OSS.Wrapper({

						region:_this.region,
						accessKeyId: result.credentials.accessKeyId,
						accessKeySecret: result.credentials.accessKeySecret,
						stsToken: result.credentials.securityToken,
						bucket:_this.bucket
					})

					console.log("阿里云 ", client);

					const files = document.getElementById(_this.id);
					if(files.files){
						const fileLen = document.getElementById(_this.id).files
						const resultUpload = [];		
						for (let i = 0; i < fileLen.length; i++) {
							const file = fileLen[i];
							const storeAs = file.name;
							client.multipartUpload(storeAs, file, {

							}).then((results) => {
								if(results.url){
									resultUpload.push(results.url);
								}
							}).catch((err) => {
								console.log(err);
							});
						}
						_this.url = resultUpload;
					}   
				});
			}
		}
	};
</script>
<style scoped lang="less">
	.oss_file {
		height: 100px;
		width: 100%;

	}
	.oss_file  input {
		right: 0;
		top: 0;
		opacity: 0;
		filter: alpha(opacity=0);
		cursor: pointer;
		width: 100%;
		height: 100%;
	}
</style>