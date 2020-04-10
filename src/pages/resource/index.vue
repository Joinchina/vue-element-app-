<template>
	<div class="resource">
		<section class="content">
			<div class="search">
				<input type="text" placeholder="资源名称搜索"  v-model="searchQuery" @keyup.13="getList()"/><i class="el-icon-search" @click.stop="getList()"></i>
			</div>

			<section class="list" id="table">
				<el-table class=""
					:data = "items"
					stripe

					>
					<el-table-column
						prop="name"
				        label="文件"
				        width="180">
				        <template slot-scope="scope">
							<span v-if="scope.row.type !=='FOLDER'">
								<i v-if="scope.row.type==='PDF'" class="icon-pdf2"></i>
								<i v-if="scope.row.type==='URL'" class="icon-link"></i>
								<i v-if="scope.row.type==='PPT'" class="icon-ppt"></i>
								<i v-if="scope.row.type==='TEXT'" class="icon-text"></i>
								<i v-if="scope.row.type==='VIDEO'" class="icon-video"></i>
								<i v-if="scope.row.type==='WORD'" class="icon-word2"></i>
								<a href="javascript:;" class="name" @click="handleView(scope.$index, scope.row)">{{scope.row.name}}</a>
							</span>
							<template v-if="scope.row.type==='FOLDER'">
								<i class="icon-folder"></i>
								<router-link :to="{path: 'resource/list', query: { folderId: scope.row.id}}" class="name">{{scope.row.name}}</router-link>
							</template>
							
				        </template>
				    </el-table-column>
				    <el-table-column
				        label="个数/大小"
				        width="">
				        <template slot-scope="scope">
							<span v-if="scope.row.type !=='FOLDER'">

								{{scope.row.fileSizes ? scope.row.fileSizes+'M' : ''}}
							</span>
							<span v-if="scope.row.type ==='FOLDER'">
								{{scope.row.fileCount}}
							</span>
						</template>
				    </el-table-column>
				    <el-table-column
				        prop=""
				        label="允许下载"
				        width="110">
				        <template slot-scope="scope">
				        	{{download[scope.row.downloadFlag]}}
				        </template>
				    </el-table-column>
					<el-table-column
				        prop="learnTime"
				        label="学习时长"
				        width="">
						<template slot-scope="scope">
			        		{{scope.row.learnTime | filtertime}}
			        	</template>
				    </el-table-column>
				    <el-table-column
				        prop="viewCount"
				        label="查看次数"
				        width="">
				    </el-table-column>
				    <el-table-column
				        prop="downloadCount"
				        label="下载次数"
				        width="">
				    </el-table-column>
				    <el-table-column
					    label="操作"
					    width="150">
					    <template slot-scope="scope" >
					    	<template v-if="scope.row.type !== 'FOLDER'">
					    		<el-button  type="text" @click.native.prevent="handleView(scope.$index, scope.row)">查看</el-button>
					    		<el-button type="text" v-if="scope.row.downloadFlag" @click.native.prevent="handleDownload(scope.$index, scope.row)">下载</el-button>
					    	</template>
					    	<template v-if="scope.row.type == 'FOLDER'" >
					    		<router-link :to="{path: 'resource/list', query: { folderId: scope.row.id}}" class="link">查看</router-link>
					    	</template>
					    	
					    </template>
				    </el-table-column>
				</el-table>
			</section>
		</section>
		
		<!-- 查看资源 url-->
		<view-url
			:dialogViewUrl.sync="viewUrlShow"
			:resId = "resId"
			></view-url>

		<!-- 查看资源 Text-->
		<view-text
			:dialogViewText.sync="viewTextShow"
			:resId = "resId"></view-text>

		<!-- 查看pdf -->
		<modal :show.sync = "viewPdfShow" contWidth = '80%' bgColor="#53575a" v-on:cleartimer="cleartimer">
			<div slot="body" class="w-transparent" style="height:100%">
				<iframe v-if="details.type==='WORD' || details.type==='PPT' || details.type==='PDF'" :src="details.linkUrl" id="showIframe" frameborder="0" width="100%" height="100%"></iframe>
				
			</div>
		</modal>

		<!-- 查看视频 -->
		<modal :show.sync = "viewVideoShow" contWidth = '80%' bgColor="#53575a" :before-close="videoClose">
			<div slot="body" style="height:100%">
				<video :src="details.linkUrl" controls="controls"  width="100%" height="100%" id="myVideo">
				您的浏览器不支持video标签
				</video>
			</div>
		</modal>

	</div>
</template>
<script>
import resource from "@/model/resource/resource";
import Modal from "@/components/modal/modal";
import viewUrl from "@/pages/resource/view_url";
import viewText from "@/pages/resource/view_text";
import API from "@/fetch/api";
import storage from "@/utils/storage";
import { getToken } from "@/utils/common";

export default {
  data() {
    return {
      items: [],
      searchQuery: "",
      download: {
        true: "是",
        false: "否"
      },
      viewUrlShow: false,
      viewTextShow: false,
      viewPdfShow: false,
      viewVideoShow: false,
      resId: "", //资源 id
      details: {},
      settimer: null, //定义定时器
      timedata: 0 //定义观看时长
    };
  },
  filters: {
    filtertime: function(value) {
	  if (!value) return " ";
	  if(value==0) return 0;
      let secondTime = parseInt(value); //秒
      let minuteTime = 0; // 分
      let hourTime = 0; // 小时
      //如果秒数大于60，将秒数转换成整数
      if (secondTime > 60) {
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
	  };
	//最总结果
	if(hourTime>0 && hourTime<10){
		hourTime="0"+hourTime;
	};
	if(minuteTime>0 && minuteTime<10){
		minuteTime="0"+minuteTime
	};
	if(secondTime>0 && secondTime<10){
		secondTime="0"+secondTime
	}else if(secondTime==0){
		secondTime="0"+secondTime
	}
	let resulttime=hourTime+"时"+minuteTime+"分"+secondTime+"秒";
	//小时为0时直接去掉小时
	if(hourTime==0){
		resulttime=minuteTime+"分"+secondTime+"秒";
	};
	//分钟为0时，小时不为0、小时为0
	if(minuteTime==0 && hourTime!=0){
		resulttime=hourTime+"时"+minuteTime+"分"+secondTime+"秒";
	}else if(minuteTime==0 && hourTime==0){
		resulttime=secondTime+"秒";
	};
	//特殊判断
	if(resulttime=="60分00秒"){
		resulttime="01时"
	}
	if(resulttime=="60秒"){
		resulttime="01分"
	}	
    return resulttime;
    }
  },
  computed: {
    clazzId() {
      return storage.get("clazzId");
    },
    folderId() {
      return this.$route.query.folderId;
    }
  },

  created() {},
  mounted() {
    this.getList();
    this.getvideo();
    this.getHiddenProp();
  },

  methods: {
    getList() {
      let data = {
        clazzId: this.clazzId,
        id: this.folderId,
        name: this.searchQuery
      };
      resource.getList(
        data,
        res => {
          //   console.log("资源list ",res);
          if (res.status == 200) {
            this.items = res.data;
          } else {
            this.$message.error(res.message);
            this.items = [];
          }
        },
        res => {
          this.$message.error("请求错误，请检查网络！");
          // console.log("请求错误",res)
        }
      );
    },
    getDetails(resId) {
      let data = {
        id: resId
      };
      resource.getDetails(
        data,
        res => {
          if (res.status == 200) {
            this.details = res.data;
          } else {
            this.$message.error(res.message);
          }
        },
        res => {
          this.$message.error("请求错误，请检查网络！");
          console.log("请求错误", res);
        }
      );
    },
    handleView(index, row) {
      clearInterval(this.settimer);
      this.settimer=null;
      this.resId = row.id;
      if (row.type === "URL") {
        this.viewUrlShow = true;
      }

      if (row.type === "TEXT") {
        this.viewTextShow = true;
      }
      if (row.type === "WORD" || row.type === "PPT" || row.type === "PDF") {
        let viewPdfId = row.id;
        this.viewPdfShow = true;
        this.getDetails(viewPdfId);
        this.timelearn();
      }

      if (row.type === "VIDEO") {
        let viewVideoId = row.id;
        this.viewVideoShow = true;
        this.getDetails(viewVideoId);
      }
    },
    videoClose() {
      document.getElementById("myVideo").pause();
      this.viewVideoShow = false;
    },
    handleDownload(index, row) {
      window.open(
        API.urls.resourceDownLoad + "?id=" + row.id + "&token=" + getToken()
      );
    },
    timelearn() {
      let time = 0;
      //要用定时器先清清时期，避免出现多个定时器的情况
      clearInterval(this.settimer);
      this.settimer=null;
      this.settimer = setInterval(() => {
        time++;
        if (time >= 180) {
          //时间三分钟，传数据
          this.timedata = 180;
          //重置time为0
          time = 0;
          //执行学习时间上传
          this.posttimelearn();
        } else {
          this.timedata = time;
        }
        console.log(time);
      }, 1000);
    },
    posttimelearn() {
      let data = {
        clazzId: this.clazzId,
        resourceId: this.resId,
        time: this.timedata
      };
      resource.posttimelearn(
        data,
        res => {
          console.log(data);
          if (res.status == 200) {
            //发送成功后this.timedata清零
            this.timedata = 0;
          }
        },
        res => {
          this.$message.error("请求错误，请检查网络！");
        }
      );
    },
    //通过子组件操作用来清除定时器
    cleartimer(b) {  
        clearInterval(this.settimer);
        //  关闭时上传一次学习时长
        this.posttimelearn(); 
    },
    //根据视频的播放上传学习时间
    getvideo() {
      let myVideo = document.getElementById("myVideo");
      myVideo.addEventListener("play", () => {
        clearInterval(this.settimer);
        this.timelearn();
      });
      myVideo.addEventListener("pause", () => {
        clearInterval(this.settimer);
        this.posttimelearn();
      });
    },
    //判断窗口是否被浏览，在最小化时也是不被浏览
    getHiddenProp() {
      // 各种浏览器兼容
      var hidden, state, visibilityChange;
      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
      } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
      }
      document.addEventListener(
        visibilityChange,
        () => {
           clearInterval(this.settimer)
          //  console.log(document[state]);
          if (document[state] == "visible") {
            //  再当前页面
            if (this.viewPdfShow == true) {
               this.timelearn();
            }
            if (this.viewVideoShow == true) {
              document.getElementById("myVideo").play();
            }
          } else {
            //  不在当前页面           
            if (this.viewPdfShow == true) {
              this.posttimelearn();
            }
            document.getElementById("myVideo").pause();
          }
        },
        false
      );
    }
  },
  components: {
    Modal,
    viewUrl,
    viewText
  },
  destroyed(){
    clearInterval(this.settimer)
  }
};
</script>
<style scoped lang="less">
@import "../../assets/css/icon.less";
.resource {
  padding-top: 24px;
}
.search {
  float: right;
  width: 320px;
  height: 40px;
  border: #d7d8df 1px solid;
  border-radius: 6px;
  margin-bottom: 20px;

  > input {
    width: 275px;
    height: 38px;
    border: 0 none;
    background-color: transparent;
    padding: 0 8px;
    font-size: 14px;
  }
  > i {
    width: 43px;
    height: 38px;
    line-height: 38px;
    background-color: #f5f8fc;
    text-align: center;
    vertical-align: middle;
    border-radius: 0 6px 6px 0;
    border-left: 1px solid #d7d8df;
    color: #666;
    cursor: pointer;
  }
}
.list {
  i {
    vertical-align: middle;
    margin-right: 10px;
  }
  .link {
    color: #409eff;
    font-size: 14px;
  }
  .name {
    color: #606266;
    &:hover {
      color: #0077ff;
      text-decoration: underline;
    }
  }
}
</style>