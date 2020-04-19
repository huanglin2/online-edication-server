import request from '@/utils/request'
import de from 'element-ui/src/locale/lang/de'

export default {
  // 获取所有章节和小节
  getAllChapterVideo(courseId) {
    return request({
      url: `/eduservice/chapter/getChapterVideo/${courseId}`,
      method: 'get',
      data: courseId
    })
  },
  // 添加章节
  saveChapter(chapter) {
    return request({
      url: '/eduservice/chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },
//  根据章节id查询
  getChapterInfo(chapterId) {
    return request({
      url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },
//  修改章节
  updateChapterInfo(chapter) {
    return request({
      url: '/eduservice/chapter/updateChapterInfo',
      method: 'post',
      data: chapter
    })
  },
  // 根据id进行删除 没有小节才删除
  deleteChapterIfNoVideo(chapterId) {
    return request({
      url: `/eduservice/chapter/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  }
}
