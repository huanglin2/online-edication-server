<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类 -->
      <el-form-item label="所属分类">
        <el-select
          v-model=courseInfo.subjectId
          placeholder="请选择" @change="subjectChange">
          <!--        一级分类  -->
          <el-option
            v-for="oneSubject in oneSubjectList"
            :key="oneSubject.id"
            :label="oneSubject.title"
            :value="oneSubject.id"
          />
        </el-select>
        <el-select
          v-model=courseInfo.subjectParentId
          placeholder="请选择">
          <el-option
            v-for="twoSubject in twoSubjectList"
            :key="twoSubject.id"
            :label="twoSubject.title"
            :value="twoSubject.id"/>
        </el-select>
      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" width="300px" height="300px">
        </el-upload>
      </el-form-item>
      <!--      课程价格-->
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import course from '@/api/edu/course'
  import teacher from '@/api/edu/teacher'
  import subject from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce'

  export default {
    data() {
      return {
        oneSubjectList: [],
        twoSubjectList: {},
        teacherList: [],
        courseId: '',
        courseInfo: {
          cover: '../static/1533150812-tqhQfBFdYN.jpg',
          subjectParentId: ''
        },
        saveBtnDisabled: false,
        active: '0',
        BASE_API: process.env.BASE_API,
        params: this.$route.params.id
      }
    },
    created() {
      this.getTeacherInfo()
      this.getAllSubjectInfo()
      if (this.$route.params.id && this.$route.params.id !== ':id') {
        this.courseId = this.$route.params.id
        this.getCourseInfo()
      }
    },
    methods: {
      // 以下为回显操作  把二级分类也查出来
      getCourseInfo() {
        course.getCourseInfo(this.params).then((response) => {
          this.courseInfo = response.data.eduCourseInfo
          subject.getAllOneTwoSubject().then(response => {
            this.oneSubjectList = response.data.list
            for (let i = 0; i < this.oneSubjectList.length; i++) {
              const oneSubject = this.oneSubjectList[i]
              if (oneSubject.id === this.courseInfo.subjectParentId) {
                this.twoSubjectList = oneSubject.children
              }
            }
          })
        })
      },
      // 上传成功
      handleAvatarSuccess(res, file) {
        this.courseInfo.cover = res.data.url
      },
      // 上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或者PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      subjectChange(value) {
        for (let i = 0; i < this.oneSubjectList.length; i++) {
          if (this.oneSubjectList[i].id === value) {
            this.courseInfo.subjectParentId = ''
            this.twoSubjectList = this.oneSubjectList[i].children
          }
        }
      },
      // 获取老师信息
      getTeacherInfo() {
        teacher.getAllTeacher().then((response) => {
          this.teacherList = response.data.item
        })
      },
      // 获取所有学科信息
      getAllSubjectInfo() {
        subject.getAllOneTwoSubject().then(response => {
          this.oneSubjectList = response.data.list
        })
      },
      saveOrUpdate() {
        if (this.params !== ':id') {
          this.renewCourseInfo()
        } else {
          this.saveCourseInfo()
        }
      },
      // 保存
      saveCourseInfo() {
        course.addCourseInfo(this.courseInfo)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '添加课程信息成功!'
            })
            //跳转到第二步
            this.$router.push('/course/chapter/' + response.data.courseId)
          })
      },
      // 更新操作
      renewCourseInfo() {
        course.updateCourseInfo(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: '修改课程信息成功'
          })
          this.$router.push(`/course/chapter/${this.courseId}`)
        })
      }
    },
    components: {
      Tinymce
    }
  }
</script>
<!-- scoped代表只有当前项目有效-->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
