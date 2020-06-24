import request from '@/utils/request'
import de from 'element-ui/src/locale/lang/de'

export default {
  // 1讲师列表   cur 当前页 limit 每页多少数据 t 条件
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/addCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  // 根据课程id查询课程
  getCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getCourseInfo/${courseId}`,
      method: 'get',
      data: courseId
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  // 发布页面的信息
  getPublishInfo(courseId) {
    return request({
      url: `/eduservice/course//getPublishInfo/${courseId}`,
      method: 'get'
    })
  },
  // 发布课程
  publicCourse(courseId) {
    return request({
      url: `/eduservice/course/publicCourse/${courseId}`,
      method: 'post'
    })
  },
  // 查询所有
  getAllCourseList() {
    return request({
      url: '/eduservice/course/getCourseList',
      method: 'get'
    })
  },
  // 查询所有并分页
  getCourseListByPage(current, limit) {
    return request({
      url: `/eduservice/course//getCoursePage/${current}/${limit}`,
      method: 'get'
    })
  },
  // 根据条件查询并分页
  findCourseListByPage(current, limit, courseQuery) {
    return request({
      url: `/eduservice/course/getCourseListPage/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  // 根据课程id删除课程 和连带的小节，章节，。。。。
  deleteCourseById(courseId) {
    return request({
      url: `/eduservice/course/deleteCourseById/${courseId}`,
      method: 'delete'
    })
  }
}
