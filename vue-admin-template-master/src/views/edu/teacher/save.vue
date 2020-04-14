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
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate(teacher)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/edu/teacher'

  export default {
    data() {
      return {
        teacher: {
          min: 0
        },
        saveBtnDisabled: false
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
