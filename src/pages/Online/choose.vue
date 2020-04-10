<template>
    <div class="z-content">
        <v-head></v-head>
        <div class="choosebox">
            <span @click="$router.history.go(-1)" class="goback">
                <i class="fanhui"></i>
                当前：选课中心
            </span>
            <div class="tablebox">
                <div class="table_top">
                    <template>                        
                         <el-cascader
                            expand-trigger="hover"
                            :options="options"
                            v-model="selectedOptions"
                            @change="handleChange">
                        </el-cascader>
                        <span class="student">学段学科</span>
                    </template>
                </div>
                <div class="list"  id="table">
                        <el-table class=""
                        :data = "items"
                        :empty-text='textfont'
                         border
                        :header-cell-style="{'text-align':'center'}"
                        stripe
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            align="center"
                            width="100">			        
                        </el-table-column>
                        <el-table-column
                            prop="code"
                            label="课程编码"
                            align="center"
                            width="150">
                    
                        </el-table-column>
                        <el-table-column
                            prop=""
                            align="center"
                            :show-overflow-tooltip=true
                            label="课程名称"
                            width="">
                            <template slot-scope="scope">
                                <span @click="viewclazz(scope.row)" class="view">{{scope.row.name}}</span>
                            </template>                
                        </el-table-column>
                        <el-table-column
                            prop="recommendLearnTime"
                            align="center"
                            label="建议学时"
                            width="150">                            
                        </el-table-column>
                        <el-table-column
                            prop="sectionCount"
                            align="center"
                            label="微课数量"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="teacher"
                            align="center"
                            label="课程讲师"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="150">
                            <template slot-scope="scope" >
                                <template>
                                    <el-button  type="text" @click.native.prevent="handleView(scope.$index, scope.row)" v-show="scope.row.selectedInOptional!=1 && scope.row.selectedInRequired!=1">加入选修</el-button>
                                    <el-button  type="text" disabled v-show="scope.row.selectedInRequired==1">已设置必修</el-button>
                                    <el-button  type="text" disabled v-show="scope.row.selectedInOptional==1">已选</el-button>                                   
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 数据总数 -->
                    <div class="datanum">
                        <span>共{{totalElements}}条</span><span>每页20条</span>
                    </div>
                    <!-- 分页 -->
                    <div class="tabpage" v-show="tabpage">
                        <el-pagination
                            background
                            layout="prev,pager,next"
                            :page-size="20"
                            :total="totalElements"
                            @current-change="pagenumber">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>
<script>
import vHead from '@/pages/header/header';
import learn from "@/model/learn/learn"
import storage from '@/utils/storage'
export default {
    data () {
        return {
            items:[],
            placeholder:'',
            options: [],
            selectedOptions:[],
            clazzId:'',
            textfont:'加载中...',
            totalElements:0,
            number:0,
            tabpage:true,
        }
    },
    created(){
        //获取班级id
        this.clazzId = storage.get("clazzId")
        this. addchooselearn();
    },
    methods:{
        //筛选
        handleChange(val) {
            console.log(val);
            this.searchobject()
        },
        //获取学段，学科
        addchooselearn(){
            let data={
                clazzId:this.clazzId,
            }
            learn.onlinesubjectrange(data,(res=>{
                if(res.status==200){
                    
                    if(res.data.length==0){
                        this.textfont='暂无数据';
                        this.tabpage=false;
                    }else{
                        res.data.forEach((ele,index)=>{
                        let obj = {};
                        let childrens = [];
                        ele.subjectList.forEach((sub,sq)=>{
						let subject = {};
						subject["value"] = sub.subjectCode;
						subject["label"] = sub.subjectName;
						childrens.push(subject);
                        })

                        obj["value"] = ele.schoolStageCode;
                        obj["label"] = ele.schoolStageName;
                        obj["children"] = childrens;					
                        this.options.push(obj);
                        });
                        this.selectedOptions.push(this.options[0].value);
                        this.selectedOptions.push(this.options[0].children[0].value); 
                        //  console.log(this.options)
                        //  console.log(this.selectedOptions)
                        this.searchobject();
                    }                                                                              
                }
            }))
        },
        // 搜索选修课
        searchobject(){
            let data={
                clazzId:this.clazzId ,
                page:this.number,
                schoolStageCode :this.selectedOptions[0],
                size :20,
                subjectCode :this.selectedOptions[1],
            };
            learn.onlinecoursepage(data,(res=>{
                if(res.status==200){
                    console.log(res.data);
                    if(res.data.content.length>0){
                       this.textfont='暂无数据' 
                    }else{
                       this.textfont='当前学科下暂无课程'  
                    }
                    this.items=res.data.content;
                    this.totalElements=res.data.totalElements;
                }
            }))
        },
        // 翻页
        pagenumber(val){
           
           this.number=val-1;
           this.searchobject() 
        },
        //加入选修
        handleView(index,msg){
             this.$confirm('是否要将此课程加入选修？加入后不可取消。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let data={
                        clazzId:this.clazzId,
                        onlineCourseId :msg.id,
                    };
                    learn.onlinecourseselect(data,(res=>{
                        if(res.status==200){
                            this.searchobject()
                            this.$message({
                            message: '加入选修成功',
                            type: 'success'
                            });
                        }
                    }))
                }).catch(() => {
                             
                });                       
        },
        //点击课程标题跳转预览
        viewclazz(msg){
            window.open("#/Online/viewcourse?clazzId="+this.clazzId+"&courseId="+msg.id+"&view="+true+"")  
        },
    },
    components:{
        vHead,
    }    
}
</script>
<style lang="less">
@import "../../assets/css/icon.less";
.z-content{
    .el-cascader{
        float: right;
        margin-top:18px;       
    }
    width: 100%;
    overflow: hidden;
    .choosebox{
        width: 1216px;
        margin: 0 auto;
        overflow: hidden;
        .goback {
            display: inline-block;
            font-size: 16px;
            color: #333;
            line-height:18px;
            margin-top: 20px;
            padding-left: 16px;
            cursor: pointer;
            .fanhui{
                width: 20px;
                height: 20px;
                background-image: url('../../assets/images/online/18.png');
                display: block;
                float: left;
                margin-right: 16px;
                background-size:contain;
                background-repeat: no-repeat;
            }
        }
        .tablebox{
            width: 100%;
            background-color: #ffffff;
            border-radius: 10px;
            margin-top: 20px;
            overflow: hidden;
            .table_top{
                width: 1148px;
                height: 76px;
                margin: 0 auto;
                border-bottom: 1px solid  #f2f2f2;
                .student{
                    float: right;
                    font-size: 16px;
                    color: #333333;
                    line-height: 76px;
                    margin-right: 6px;
                }
                               
            }
            #table{
                padding: 0 34px;
                margin-top: 20px;
                overflow: hidden;
                .el-table{
                    td{
                        padding: 6px 0;
                    }
                }
                .view{
                    color: #409EFF;
                    cursor: pointer;
                }
                .datanum{
                    width: 100%;
                    text-align: right;
                    font-size: 14px;
                    color: #666666;
                    letter-spacing: 0;
                    text-align: right;
                    line-height: 14px;
                    margin: 20px 0 0 0;
                    padding-right: 20px;
                    span{
                        margin-left: 10px;
                    }
                }
                .tabpage{
                    width: 100%;
                    margin: 20px 0;
                    text-align: center;
                    .el-pagination{
                        padding: 0
                    }

                }
            }
        }
    }
}
</style>





