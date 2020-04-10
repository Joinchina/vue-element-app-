<template>
	<div id="wViewResText">
		<el-dialog custom-class="dialog-form" title="查看"
			:visible.sync="dialogViewText"
			:close-on-click-modal="false"
			:before-close="close"
			@open="getResource()">
			
			<el-form :model="ruleForm"  ref="ruleForm">
				<el-form-item label="资源类型："  :label-width="labelWidth">
					<el-radio label="TEXT" v-model="type" >文本</el-radio>
				</el-form-item>
				
				<el-form-item label="资源名称：" prop="name" 
					:label-width="labelWidth"
					
					>
					<div class="text title">{{ruleForm.name}}</div>
				</el-form-item>

				<el-form-item label="内容：" prop="content" 
					:label-width="labelWidth"
					
					>
					<div class="text cont">
						{{ruleForm.content}}
					</div>
					
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
				type: "TEXT",
				ruleForm: {
					name: '',
					content: ''
				},
				labelWidth: '125px',
				details: {}

			}
		},
		props: ['dialogViewText', 'resId'],
		
		methods: {
			close() {
				this.$emit('update:dialogViewText', false);
				
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
		    			this.ruleForm.content = res.data.content;
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
    
    overflow-y: auto;
    border:1px solid #e4e7ed;
    color: #333;
    border-radius: 6px;
    padding: 5px 8px;
    line-height: 1.5em;
    &.cont {
    	height: 300px;
    }
}
</style>