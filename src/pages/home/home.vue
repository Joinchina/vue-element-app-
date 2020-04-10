<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="wrap clearfix">
            <v-sidebar class="sidebar-wrap"></v-sidebar>
            <div class="container">
                <transition name="move" mode="out-in"><router-view></router-view></transition>
            </div>
        </div>
        
    </div>
</template>

<script>
    import vHead from '@/pages/header/header';
    import vSidebar from '@/pages/sidebar/sidebar';
    import storage from '@/utils/storage'

    export default {
        data(){
            return{
            }
        },
        created(){
            //判断是否为登录状态 
            let token_users = storage.get("token_users");
            let auth = storage.get("auth");
            let userId = storage.get("userId");
            if(!token_users && !auth && !userId){
                this.$router.push("/login");
            }
        },
        components:{
            vHead,
            vSidebar
        }
    }
</script>
<style scoped lang="less">
.sidebar-wrap {
    display: block;
    float: left;
    width: 192px;
    min-height: 3000px;
    background-color: #fff;
    margin-right: 20px;
    // box-shadow: -5px 0 14px #edf1f7, 5px 0 14px #edf1f7, 0 5px 14px #edf1f7;
    box-shadow: -5px 0 14px #edf1f7, 5px 0 14px #edf1f7, 0 5px 14px #edf1f7;
    border-top: none;
    // margin-top: 36px;
   // border: 1px solid red;
    
    &:after {
        content: " ";
        width: 192px;
        height: 10px;
        background-color: #fff;
        position: absolute;
        z-index: 11;
        left: 0;
    }    

}
.container {
    box-sizing: border-box;
    width: 1004px;
    float: left;
}
</style>