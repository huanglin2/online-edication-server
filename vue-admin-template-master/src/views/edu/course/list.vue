<template>
  <div class="app-container">
    <!--查询表单-->
    课程表单
    <br>
    <br>
    <!--    TODO 待完成查询列表无数据不能直接 执行查询所有-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="CourseQuery.title" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="CourseQuery.lessonNum" placeholder="课时数"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="CourseQuery.minPrice" placeholder="最低价格"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="CourseQuery.maxPrice" placeholder="最高价格"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="CourseQuery.status" clearable placeholder="课程状态">
          <el-option value="Draft" label="未发布"/>
          <el-option value="Normal" label="已发布"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="searchCourse">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称"/>
      <el-table-column label="课程状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="90"/>
      <el-table-column prop="price" label="价格" width="90"/>
      <el-table-column prop="viewCount" label="浏览数量" width="90"/>
      <el-table-column prop="buyCount" label="购买数量" width="90"/>
      <el-table-column prop="gmtCreate" label="创建时间" width="160"/>
      <el-table-column prop="gmtModified" label="最后一次修改时间" width="160"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
  import course from '@/api/edu/course'
  import video from '../../../api/edu/video'

  export default {
    data() {
      return {
        list: null,
        page: 1,
        limit: 5,
        total: 0,
        CourseQuery: {}
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 不加条件的分页查询
      getList(page = 1) {
        this.page = page
        course.getCourseListByPage(this.page, this.limit)
          .then(response => { // 成功
            this.list = response.data.rows
            this.total = response.data.total
          })
      },
      // 条件查询课程分页
      searchCourse() {
        course.findCourseListByPage(this.page, this.limit, this.CourseQuery).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
      },
      // 删除一个课程
      removeDataById(courseId) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // TODO 有点问题 删除次数过多？
          course.deleteCourseById(courseId).then(response => {
            this.removeVideoBatch(courseId)
            this.getList()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 删除课程和删除其下所有视频
      removeVideoBatch(courseId) {
        video.removeAliyunVideoBatch(courseId)
      },
      // 清空
      resetData() {
        // 清空表单数据
        this.CourseQuery = {}
        // 查询
        this.getList()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
