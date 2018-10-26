<template>
  <div style="padding:10px">
    <!-- 头部筛选条件 -->
    <div>
      <!-- 第一行的筛选 -->
      <div>
        <div class="cont-header cont-uninput">
          <div class="block">
            <el-cascader
              :options="options"
              v-model="condition.status"
              @change="handleChange">
            </el-cascader>
          </div>
        </div>
        <a style="color:#3a8ee6;text-decoration:none;" :href='"https://dfapi.dimuen.com/order/exportExcel?name="+condition.name+"&account="+condition.account+"&status="+condition.status+"&start="+condition.start+"&end="+condition.end'>
            <!-- <a href="https://dfapi.dimuen.com/order/exportExcel"> -->
            导出excel
            </a>
      </div>
    </div>

    <!-- 主体部分，表格 -->
    <div class="cont-cont">
      <el-table
        :data="tableData"
        height="calc(100vh - 195px)"
        style="width: 100%;" 
        :header-cell-style="{'text-align':'center'}">
        <el-table-column label="年票编号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="激活日期">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.bankname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="景区使用情况" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡密">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.status == 1 ?"成功":"审核中" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" >
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.createtime| formatDate  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="210">
          <template slot-scope="scope">
            <el-button
              width="200"
              @click="open2()">禁用</el-button>
            <el-button
              width="200"
              @click="makeMoney(scope.row)">备注</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="10"
          :page-count="totalPage"
          style="position:fixed;bottom:10px;">
        </el-pagination>

    </div>

    <!-- 录入代付额度弹窗 -->
    <div>
      <el-dialog :title="title" :visible.sync="dialogTableVisible" >
        <el-form :label-position="labelPosition" label-width="80px"  :model="pay">
            <el-form-item label="备注" >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="textarea3"></el-input>
            </el-form-item>
        </el-form>

        <div class="btn-sub">
          <el-button type="primary" size="mini" @click="enteringData">确定</el-button>
          <el-button size="mini" @click="openAlert(1,'取消成功')">取消</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
  
</template>

<script>
import Vue from 'vue';
import bus from './bus.js';
import {formatDate} from './formatDate.js';
import domain from '../domain.js';

export default {
  name: 'nianpiaoguanli',
  data () {
    return {
      totalPage:1, // 分页
      tableData: [], // table数据
      dialogTableVisible: false,
      title:"备注",
      condition:{// 过滤参数
        page:1,
        limit:domain.limit,
        account:'',
        name:'',
        username:'',
        status:'',
        start:'',
        end:'',
      },
      pay:{ // 打款弹窗参数
        orderno:"",
        pwd:"",
      },
      options:[{//下拉框参数
        value:'',
        label:"全部状态"
      },{
        value:0,
        label:"有效"
      },{
        value:1,
        label:"未激活"
      },{
        value:2,
        label:"禁用"
      },{
        value:3,
        label:"过期"
      }],
      labelPosition: 'right', // 弹窗的lable
      textarea3: ''
    }
  },
  created:function(){
    // 默认获取数据
    this.getData();
  },
  methods:{
    // 请求数据
    getData(){
      let that = this;
      let url = domain.url+"order/list";
      let formData = new FormData();
      formData.append("page",that.condition.page);
      formData.append("limit",domain.limit);
      if(that.condition.account){
        formData.append("account",that.condition.account);
      }if(that.condition.name){
        formData.append("phone",that.condition.name);
      }if(that.condition.status == "0"||
      that.condition.status == "1"){
        formData.append("status",that.condition.status);
      }if(that.condition.start){
        formData.append("start",that.condition.start);
      }if(that.condition.end){
        formData.append("end",that.condition.end);
      }if(that.condition.username){
        formData.append("username",that.condition.username);
      }
      that.$http.post(url,formData,{
        headers:{'Content-Type':'multipart/form-data'}
      })
      .then(function(response){
        if(response.body.result == "1"){
          //成功的
          that.openAlert(1,response.body.msg);
          that.tableData = response.body.obj;
          that.totalPage = response.body.totalPage;
        }
        else{
          that.openAlert(2,response.body.msg);
        }
      },function(err){})
    },
    // 分页
    handleCurrentChange(e){
      this.condition.page = e;
      this.getData();
    },
    // 确认打款的弹窗启动
    makeMoney(e){
      this.dialogTableVisible = true;
      this.pay.orderno = e.orderno;
    },
    // 确认打款数据提交
    enteringData(){
      let that = this;
      let url = domain.url+"order/pay";
      if(that.pay.orderno && that.pay.pwd ){
        let data = "orderno="+that.pay.orderno+
          "&pwd="+that.pay.pwd;
        that.$http.get(url+"?"+data,{
          headers:{'Content-Type':'multipart/form-data'}
        })
        .then(function(response){
          if(response.body.result != 1)
            that.openAlert(2,response.body.msg);
          else{//成功的
            that.openAlert(1,response.body.msg);
            that.getData();
          }
        },function(err){})
      }else{
        that.openAlert(2,"请将录入信息填写完整！");
      }
    },
    open2() {
        this.$confirm('此操作将更改状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    // 提示信息调用
    openAlert(i,msg) {
        let that = this;
        // 成功了才能关闭弹窗(无弹窗不影响)
        if(i == "2" && msg){
            that.$message.error(msg);
        }else{
            that.$message({
                type: 'success',
                message:msg
            });
            that.dialogTableVisible = false;
            that.pay.orderno = '';
            that.pay.pwd = '';
            that.dialogTableVisible = false;
        }
    },
    // 下拉框筛选
    handleChange(e){
      let that = this;
      that.condition.status = e;
      that.getData();
    },
    // 搜索日期
    searchStaDate(e){
      this.condition.start = new Date(e).getTime();
      this.getData();
    },
    // 搜索日期
    searchEndDate(e){
      this.condition.end = new Date(e).getTime();
      this.getData();
    },
  },
  filters:{
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cont-header{
  display: inline-block;
  margin-right:15px;
  width: 233px;
}
.cont-header>.el-input{
  width: 150px;
}
.cont-cont{
  margin-top: 20px;
}
.btn-sub{
  padding-top: 20px;
  padding-left: 80px;
}
.addSh{
  float: right;
  width: 100px;
}
.cont-uninput,
.cont-uninput>.block>.el-date-editor{
  width: 140px;
}
</style>