<template>
	<div class="j-tel">
		 <el-form :model="phoneForm" :rules="rules" ref="phoneForm" label-width="0px">
	        <el-form-item prop="phone">
	          <el-input v-model.trim="phoneForm.phone" class="el-input-t" placeholder="手机号"></el-input>

	        </el-form-item>
	        <el-form-item prop="code">
	          <el-input type="text" placeholder="验证码" v-model.trim="phoneForm.code"
	                    @keyup.enter.native="submitForm('phoneForm')" class="code-width"></el-input>
	           <el-button id="autoCodeBtn" class="btn-green" type="primary"
                        @click="getCode($event)">获取验证码</el-button>
	        </el-form-item>
	        <div class="login-btn">
	          <el-button type="primary" class = "btn-login" @click="submitForm('phoneForm')">登录</el-button>
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
			 let checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入手机号'));
                }
                setTimeout(() => {
                    if(!(/^1[0345789]\d{9}$/.test(value))) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        callback();
                    }
                }, 1000)
            };
			return {
				countTime: '60',
				phoneForm: {
                    phone: '',
                    code: ''
                },
                rules: {
                    phone: [
                    	{ validator: checkPhone, trigger: 'blur'}
                    ],
                    code: [
                    	{ required: true, message: '请输入验证码', trigger:'blur'}
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
                  let data = {
                        phone: this.phoneForm.phone,
                        code: this.phoneForm.code
                  }
                  this.doLoginPhone(data)
  					} else {
  						console.log('error submit');
  						return false;
  					}
  				});
  			},
		    doLoginPhone(data) {
            model.loginPhone(data, (res => {
                this.loginSucc(res)
            }))

        },
        loginSucc(res) {
                 // console.log("res",res);
              if(res.status === 205){
                      this.$message.error(res.message);
              } else if (res.status === 505){
                      this.$message.error(res.message);
              } else if (res.status === 200) {
                  //存储用户token账号
                  storage.set("token_users",res.data);
                 
                  //console.log(userObj.curTelUername());
                  storage.set("auth",userObj.curLastToken());
                    //头像信息存储
						// storage.set("userimgurl",userObj.userimgurl());
                  //存储当前用户账号
                  storage.set("cur_username",userObj.curTelUername());

                  //获取当前班级id
                  this.routerPage();
              }
        },
        routerPage(){
          let detokens = userObj.detoken();
          let num = 0;
          for(var i in detokens){
            num++;
          }
          //console.log(num);
          //多个账号跳转至班级选择页面
          if(num > 1){

             storage.remove("userId");
             //this.$router.push('/choose');
             this.$router.push({
                path:"/choose",
                query:{
                  type:"switch"
                }
             })

          //一个账号跳转至班级首页
          }else{

             //存储当前用户id
             storage.set("userId",userObj.curTelId('userId'));

             //存储当前的clazzId
            storage.set("clazzId",userObj.curTelId('clazzId'));

            this.$router.push('/index');
          }
        },
			getCode($event){
				 let self = $event.currentTarget;
				 console.log(this.phoneForm.phone);
				 if(!this.phoneForm.phone) {
                      this.$message.error("请输入手机号");
                      return false;
                  } else if (!(/^1[03457869]\d{9}$/.test(this.phoneForm.phone))){
                      this.$message.error("请输入正确的手机号");
                      return false;
                  } else {
                      let data = {
                          'phone' : this.phoneForm.phone,
                          'type' : 4
                      }
                      this.getSms(data);
                  }
			},
			getSms(data){
				//console.log("短信");
				model.getSms(data, (res => {
                      // console.log("获取验证码",res);
                      if(res.status == 200) {
                          this.countDown();
                      } else {
                          this.$message.error(res.message);
                      }
                  }));
			},
			 countDown() {
                  let o = document.getElementById('autoCodeBtn');
                  // console.log("o",o);
                  if (this.countTime == 0) {
                      o.removeAttribute("disabled");
                      o.innerHTML="获取验证码";
                      o.style.backgroundColor="#f8f8f8";
                      o.style.color="#b8b8b8";
                      o.style.cursor="pointer";
                  } else {
                      o.setAttribute("disabled", true);
                      o.innerHTML = this.countTime+"秒后重新获取";
                      o.style.backgroundColor="#fd9726";
                      o.style.color="#fff";
                      o.style.cursor="default";
                      this.countTime--;
                      setTimeout(() => {
                          this.countDown(o)
                      }, 1000)
                  }
              }	

		}
	}

</script>
<style lang="less" scoped>
  .j-tel{
      margin-top: 30px;
      .btn-green{
        position: absolute;
        right: 0;
        top: 0;
        background: #f8f8f8;
        color: #b8b8b8;
        border-radius:80px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border: 0;
        height: 44px;
        :hover{
          color:#ff6c00;
        }
      }

      .login-btn{
        margin-top: 63px;
      }
  }



</style>