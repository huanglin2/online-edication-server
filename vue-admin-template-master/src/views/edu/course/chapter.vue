<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <!-- Form -->
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" :value="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" controls-position="right" @change="handleChange" :min="1"
                           :max="255"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" controls-position="right" @change="handleChange" :min="1"
                           :max="255"></el-input-number>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAliyVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <!--    章节和小节显示-->

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="'第 '+chapterVideo.sort+' 章 : '+chapterVideo.title" :name="index"
                        v-for="(chapterVideo,index) in chapterVideoList"
                        :key="index">
        <span>
           <el-button type="text" @click="openAddVideo(chapterVideo.id)">添加小节</el-button>
          <el-button type="text" @click="editChapter(chapterVideo.id)">编辑章节</el-button>
          <el-button type="text" @click="deleteChapter(chapterVideo.id)">删除章节</el-button>
        </span>
        <div v-for="(video,index) in chapterVideo.children" :key="index">
          <el-button type="text" @click="editVideo(video.id)">编辑小节</el-button>
          <el-button type="text" @click="deleteVideo(video.id)">删除小节</el-button>
          <br/>
          &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;第 {{video.sort}} 节 : {{video.title}}
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import chapter from '@/api/edu/chapter'
  import video from '@/api/edu/video'

  export default {
    data() {
      return {
        BASE_API: process.env.BASE_API,
        fileList: [],
        dialogVideoFormVisible: false,
        saveVideoBtnDisabled: false,
        chapter: {
          sort: 1
        },
        video: {
          courseId: '',
          chapterId: '',
          sort: 1
        },
        dialogChapterFormVisible: false,
        activeNames: '',
        chapterVideoList: [],
        saveBtnDisabled: false,
        courseId: ''
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
      }
      this.getChapterVideo()
    },
    methods: {
      // 上传成功调用方法
      handleVodUploadSuccess(response, file, fileList) {
        // 视频id
        this.video.videoSourceId = response.data.videoId
        // 视频名称
        this.video.videoOriginalName = file.name
        this.fileList = fileList
      },
      handleUploadExceed() {
        this.$message.warning('想要重新上传视频，请先删除已上传视频')
      },
      // 删除之前
      beforeVodRemove(file) {
        return this.$confirm(`确定要移除 ${file.name} 吗?`)
      },
      // 删除确定
      handleVodRemove() {
        video.removeAliyunVideo(this.video.videoSourceId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          //  清空文件列表
          this.fileList = []
          // 清空视频id
          this.video.videoSourceId = ''
          // 清空视频名称
          this.video.videoOriginalName = ''
        })
      },
      /*=============================小节操作===========================*/
      saveOrUpdateVideo() {
        if (!this.video.id) {
          this.addVideo()
        } else {
          this.updateVideo()
        }
      },
      // 修改小节
      updateVideo() {
        video.updateVideo(this.video).then(response => {
          this.getChapterVideo()
          this.$message({
            type: 'success',
            message: '修改小节成功'
          })
          this.video.id = ''
          this.dialogVideoFormVisible = false
        })
      },
      // 添加小节
      addVideo() {
        video.saveVideo(this.video).then(response => {
          this.getChapterVideo()
          this.$message({
            type: 'success',
            message: '添加小节成功'
          })
          this.dialogVideoFormVisible = false
        })
      },
      // 打开添加框
      openAddVideo(chapterId) {
        this.fileList = []
        this.video.title = ''
        this.video.sort = ''
        this.dialogVideoFormVisible = true
        this.video.courseId = this.courseId
        this.video.chapterId = chapterId
      },
      // 编辑前的回显操作
      editVideo(videoId) {
        this.dialogVideoFormVisible = true
        this.video.id = videoId
        video.getVideoInfo(videoId).then(response => {
          this.video = response.data.videoInfo
        })
      },
      // 删除小节
      deleteVideo(videoId) {
        this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video.deleteVideo(videoId).then(response => {
            this.getChapterVideo()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      /*=================================以下为章节操作============================*/
      // 编辑章节
      editChapter(chapterId) {
        this.dialogChapterFormVisible = true
        this.chapter.id = chapterId
        chapter.getChapterInfo(chapterId).then(response => {
          this.chapter = response.data.eduChapter
        })
      }
      ,
      // 删除章节
      deleteChapter(chapterId) {
        this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter.deleteChapterIfNoVideo(chapterId).then(response => {
            this.getChapterVideo()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      ,
      saveOrUpdate() {
        if (this.chapter.id) {
          this.updateChapter(this.chapter.id)
        } else {
          this.addChapter()
        }
      },
      //修改章节
      updateChapter(chapterId) {
        this.chapter.id = chapterId
        chapter.updateChapterInfo(this.chapter).then(response => {
          this.dialogChapterFormVisible = false
          this.chapter.id = ''
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getChapterVideo()
        })
      }
      ,
      // 添加章节
      addChapter() {
        // 设置课程id到chapter
        this.chapter.courseId = this.courseId
        chapter.saveChapter(this.chapter).then(response => {
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getChapterVideo()
        })
      }
      ,
      handleChange(value) {
        console.log(value)
      }
      ,
      // 弹出添加框
      openChapterDialog() {
        // 清空
        this.chapter.title = null
        this.chapter.sort = 0
        this.dialogChapterFormVisible = true
      }
      ,
      // 获取章节和小节
      getChapterVideo() {
        chapter.getAllChapterVideo(this.courseId).then((response) => {
          this.chapterVideoList = response.data.allchapterVideo
        })
      }
      ,
      previous() {
        this.$router.push(`/course/info/${this.courseId}`)
      }
      ,
      next() {
        this.$router.push(`/course/publish/${this.courseId}`)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .el-collapse-item__header {
    display block;
    text-align left
    font-size 20px
  }

  .el-collapse-item__content {
    text-indent 50px
  }

  .chanpterList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .chanpterList li {
    position: relative;
  }

  .chanpterList p {
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList {
    padding-left: 50px;
  }

  .videoList p {
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
</style>
