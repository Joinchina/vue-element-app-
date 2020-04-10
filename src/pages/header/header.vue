<template>
    <div class="header-wrap">
        <div class="header clearfix">
            <span class="logo">
                <img src="../../assets/images/common/logo.png" alt="师训宝">
            </span>
            
            <div class="class-info" v-if = "chooseFlag">
                <h1>{{clazzName}}</h1>
                <a href="javascript:void(0)" class="btn-ora-line" @click="switchClazz" v-if = "onlyClassFlag">切换班级</a>
            </div>
     
            <div class="user-info">
                <a href="###" @click="helpopen"><img src="../../assets/images/icon-circle-ques.png" alt="">帮助中心</a>
                <span>{{username}}</span>
                <i class="icon-vertical-line"></i>
                <span class="logout" @click="handleCommand('loginout')">退出</span>
            </div>


        </div>
    </div>
</template>
<script>
    import storage from '@/utils/storage'
    import userObj from '@/utils/loginServer'
    import model from '@/model/choose/choose'
    export default {
        data() {
            return {
                name: '',
                clazzName:"",
                onlyClassFlag:true,
                chooseFlag:true,
                show: true,
            }
        },
        created() {
            this.clazzIdList();
            if(userObj.onlyOneClass() != 0 && userObj.onlyOneClass() == 1){
                this.onlyClassFlag = false;
            }
            //choose页面 头部信息隐藏
            if(!!this.$route.query.type && this.$route.query.type == "switch"){
                this.chooseFlag = false;
            }
        },
        mounted() {
            
        },
        computed:{
            
            username(){
                return userObj.curname() ? userObj.curname() : this.name;
            },
            
        },
        methods:{
            clazzIdList(){
                if(!!storage.get("clazzId")){
                    let data = {
                        id:storage.get("clazzId")
                    };
                    model.clazzId(data, (res => {
                        if(res.status == 200){
                            this.clazzName = res.data.name;
                        }else{
                            this.$message.error(res.message);
                        }
                        
                    }))
                }
            },

            switchClazz(){

               this.$router.push({
                    path:"/choose",
                    query:{
                        type:"switch"
                    }
               })
               return this.$store.dispatch("routeActive","/index");
            },
            
            handleCommand(command) {
                if(command == 'loginout'){

                    //清除缓存
                    storage.remove('token_users');
                    storage.remove('cur_username');
                    storage.remove('userId');
                    storage.remove("clazzId");
                    storage.remove('auth');
                    storage.remove('status');
                   // this.$store.state.menuActive = "/index";

                    this.$router.push('/login');
                    return this.$store.dispatch("routeActive","/index");
                }
            },
            helpopen(){
                //console.log(window.location)
               if(window.location.host.indexOf('stu.shixunbao.cn') !== -1){
                   window.open("https://www.shixunbao.cn/help/index.html#/help/details?type=STUDENT")                  
               }else{
                   window.open("https://10.98.24.67:8003/help/index.html#/help/details?type=STUDENT") 
               }
            }
        }
    }
</script>
<style scoped lang="less">
    .header-wrap {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 64px;
        font-size: 18px;
        line-height: 64px;
        color: #333;
        overflow: hidden;
        clear: both;
        background: #fff;
        box-shadow: 0 2px 3px #f0f0f0;
    }
    .header {
        width: 1216px;
        margin: 0 auto;
        .logo,
        .class-info {
            float: left;
        }
        
    }
    .logo{
        width:108px;
        margin-left: 33px;
        margin-right: 72px;
        img {
            display: block;
            margin-top: 14px;
        }
    }
    .class-info {
        width: 610px;
        
        h1 {
            display: inline-block;
            margin-right: 20px;
            line-height: 64px;
            min-width: 0;
            max-width: 80%;
            float: left;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .btn-ora-line {
            display: inline-block;
            vertical-align: top;
            margin-top: 16px;
            color: #ff6c00;
            background-color: #fef9f3;
            border: 1px solid #ff6c00;
            border-radius: 5px;
            padding: 6px 10px;
            line-height: 1em;
            display: inline-block;
            float: left;
        }
    }
   
    .user-info {
        width: 350px;
        float: right;
        text-align: right;
        font-size: 16px;
        padding-right: 20px;
        a{
         color: #333;
            display: inline-block;
            margin-right: 40px;
            img{
                margin: -1px 6px 0 0
            }   
        }
        .logout {
            color: #ff6c00;
            cursor: pointer;
        }
        .icon-vertical-line {
            display: inline-block;
            width: 1px;
            height: 63px;
            margin: 0 10px;
            background: url("../../assets/images/common/icon-vertical-line.png") 0 0 no-repeat;
            vertical-align: top;
        }
    }
    
    
</style>