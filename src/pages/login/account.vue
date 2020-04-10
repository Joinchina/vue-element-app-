<template>
	<div class="j-acc">
		 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
	        <el-form-item prop="username">
	          <el-input v-model.trim="ruleForm.username" class="el-input-t" placeholder="账号" ></el-input>
	        </el-form-item>
	        <el-form-item prop="password">
	          <el-input type="password" v-model.trim="ruleForm.password"
	                    @keyup.enter.native="submitForm('ruleForm')" placeholder="密码"></el-input>
	        </el-form-item>
	        <div class="login-btn">
	          <el-button type="primary" class = "btn-login" @click="submitForm('ruleForm')">登录</el-button>
	        </div>
	        
	      </el-form>
	</div>
</template>
<script>
	import model from '@/model/login/login'
	import storage from '@/utils/storage'
	import userObj from '@/utils/loginServer'
	export default {
		data() {
			return {
				ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                    	{ required: true, message: '请输入用户名', trigger:'blur' }
                    ],
                    password: [
                    	{ required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
			}
		},
		created() {

		},
		computed: {
			
		},
		methods: {
			
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						console.log("submit");
						this.login();
					} else {
						console.log('error submit');
						return false;
					}
				});
			},
			login() {
				let data = {
					'username': this.ruleForm.username,
                    'password': this.ruleForm.password
				}

				model.login(data, (res => {
					if(res.status === 200){
						 console.log("登录账户相关信息",res)
						//存储用户token账号
						storage.set("token_users",res.data);

						//存储当前用户账号
						storage.set("cur_username",this.ruleForm.username);

						// console.log(222222);

						//存储当前账号的token
						storage.set("auth",userObj.curGetToken());

						//存储当前用户id
						storage.set("userId",userObj.curId("userId"));

						//存储当前的clazzId
						storage.set("clazzId",userObj.curId("clazzId"));
						
						//获取当前班级id
						this.routerPage();
	                	
	                } else {
	                	this.$message.error(res.message);
	                }
				}))
			},
			routerPage(){

				//判断token里面的跳转页面


				// let type = storage.get("loginType");


				//账号登录
				// if(type == "acc"){
					console.log("pushyemian");
					this.$router.push('/index');
				// }
				
				//this.$router.push('/choose'); 班级选择页面
			}


		}
	}

</script>
<style lang="less" scoped>
.j-acc{
    margin-top: 30px;
    .login-btn{
    	margin-top: 63px;
  	}
 }

</style>