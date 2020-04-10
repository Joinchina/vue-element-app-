<template>
    <div class="z-content">
        
        <proGress></proGress>
        <mustLearn></mustLearn>
        <span v-if="online.minOptionalCourseLearnTime==0 && chooselearndata.length==0"></span>
        <chooseLearn v-else></chooseLearn>
    </div>
</template>
<script>
import proGress from './learninfo'  //学习进度组件
import mustLearn from './mustlearn' //必修课组件
import chooseLearn from './chooselearn' //选修组件
import storage from '@/utils/storage'
import learn from "@/model/learn/learn"
export default {
    data(){
        return {
            online:[],
            clazzId:'',
            chooselearndata:[],
        }
    },    
    created(){
         this.online=storage.session.get("onLine");
         this.clazzId = storage.get("clazzId")
         this.getchooselearn();
         console.log(this.online)
    },
    methods:{
        //获取当前的选课
        getchooselearn(){
            let data={
                clazzId :this.clazzId 
            };
            learn.onlinecourselist(data,(res=>{
               
                if(res.status==200){  
                   this.chooselearndata=res.data;
                }
            }))
        },
    },
    components:{
        proGress,
        mustLearn,
        chooseLearn,
    },
}
</script>
<style lang="less" scoped>

</style>


