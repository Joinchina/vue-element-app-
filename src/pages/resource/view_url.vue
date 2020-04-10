<template>
	<div id="wViewResUrl">
		<el-dialog class="dialog-form" title="查看"
			:visible.sync="dialogViewUrl"
			:close-on-click-modal="false"
			:before-close="close"

			@open="getResource()"
			>
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth">
					<el-radio label="URL" v-model="type" >网页链接</el-radio>
				</el-form-item>
				
				<el-form-item label="链接地址：" prop="url" 
					:label-width="labelWidth"
					>
					<span class="text">{{ruleForm.url}}</span>
				</el-form-item>
				
				<el-form-item label="链接名称：" prop="name" 
					:label-width="labelWidth"
					>
					<span class="text">{{ruleForm.name}}</span>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				
				<el-button @click="close" class="btn-gray-line">关闭</el-button>
			</div>

		</el-dialog>
	</div>
</template>
<script>
	import resource from '@/model/resource/resource'

	export default {
		data () {
			return {
				type: "URL",
				ruleForm: {
					name: '',
					url: ''
				},
				labelWidth: '125px',
				details: {}

			}
		},
		props: ['dialogViewUrl', 'resId'],
		
		methods: {
			open() {
				this.getResource();
			},
			close() {
				this.$emit('update:dialogViewUrl', false);
				
			},
			
		    getResource() {
		    	let data = {
		    		id: this.resId
		    	}
		    	resource.getDetails(data, (res => {
		    		// console.log("资源详情",res);
		    		if(res.status == 200) {
		    			this.details = res.data;
		    			this.ruleForm.name = res.data.name;
		    			this.ruleForm.url = res.data.linkUrl;
		    		} else {
		    			this.$message.error(res.message);
		    		}
		    	}), (res => {
		    		this.$message.error("请求有误，请查看网络！");
		    	}));

		    }

		},
		
	}
</script>
<style scoped lang="less">
.text {
	position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    height: auto;
    overflow-y: auto;
    border:1px solid #e4e7ed;
    color: #333;
    border-radius: 6px;
    padding: 5px 8px;
    line-height: 1.5em;
}
</style>