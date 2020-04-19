<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH + '/excel%E6%A8%A1%E6%9D%BF.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/addSubject'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            ref="isFile"
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        fileUploadBtnText: '上传到服务器',
        importBtnDisabled: false,
        OSS_PATH: process.env.OSS_PATH,
        BASE_API: process.env.BASE_API
      }
    },
    methods: {
      submitUpload() {
        this.importBtnDisabled = true
        this.loading = true
        this.fileUploadBtnText = '正在上传'
        this.$refs.upload.submit()
      },
      fileUploadSuccess(response) {
        this.loading = false
        this.$message({
          type: 'success',
          message: response.message
        })
        this.fileUploadBtnText = '上传到服务器'
        // 跳至课程分类
        this.$router.push('/subject/list')
      },
      fileUploadError(response) {
        this.loading = false
        this.$message({
          type: 'error',
          message: response.message
        })
        this.fileUploadBtnText = '上传到服务器'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
