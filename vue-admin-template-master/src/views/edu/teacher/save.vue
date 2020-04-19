<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像： -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <PanThumb :image="teacher.avatar"></PanThumb>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate(teacher)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/edu/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    data() {
      return {
        teacher: {
          min: 0,
          avatar: process.env.OSS_PATH + '/avatar/2020/04/1492834f3a7773497e9080c6e27605a57bfile.png'
        },
        imagecropperKey: '',
        saveBtnDisabled: false,
        imagecropperShow: false,
        BASE_API: process.env.BASE_API // 获取dev.env.js中的BaseAPi
      }
    },
    created() {
      this.init()
    },
    watch: {
      //路由变化方式，路由发生变化，方法就会执行
      $route(to, from) {
        this.init()
      }
    },
    methods: {
      // 关闭上传弹框的方法
      close() {
        this.imagecropperShow = false
        this.imagecropperKey++
      },
      // 上传成功后回调
      cropSuccess(data) {
        // 上传后返回图片地址
        this.teacher.avatar = data.url
        this.imagecropperShow = false
        this.imagecropperKey++
      },
      init() {
        //判断路径有id值,做修改
        if (this.$route.params && this.$route.params.id) {
          //从路径获取id值
          const id = this.$route.params.id
          //调用根据id查询的方法
          this.getInfo(id)
        } else { //路径没有id值，做添加
          //清空表单
          this.teacher = {}
        }
      },
      getInfo(id) {
        teacher.getTeacherById(id).then(response => {
          this.teacher = response.data.teacher
        })
      },
      saveOrUpdate(teachers) {
        if (!this.teacher.id) {
          this.saveTeachers(teachers)
        } else {
          this.updateTeachers()
        }
      },
      saveTeachers(teachers) {
        teacher.saveTeacher(teachers).then(() => {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.$router.push({ path: '/teacher/table' })
        })
      },
      updateTeachers() {
        teacher.updateTeacher(this.teacher).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
        this.$router.push({ path: '/teacher/table' })
      }
    },
    components: {
      ImageCropper,
      PanThumb
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
