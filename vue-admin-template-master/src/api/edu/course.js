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
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  getPublishInfo(courseId) {
    return request({
      url: `/eduservice/course//getPublishInfo/${courseId}`,
      method: 'get'
    })
  },
  publicCourse(courseId) {
    return request({
      url: `/eduservice/course/publicCourse/${courseId}`,
      method: 'post'
    })
  },
  getAllCourseList() {
    return request({
      url: '/eduservice/course/getCourseList',
      method: 'get'
    })
  },
  getCourseListByPage(current, limit) {
    return request({
      url: `/eduservice/course//getCoursePage/${current}/${limit}`,
      method: 'get'
    })
  },
  findCourseListByPage(current, limit, courseQuery) {
    return request({
      url: `/eduservice/course/getCourseListPage/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  deleteCourseById(courseId) {
    return request({
      url: `/eduservice/course/deleteCourseById/${courseId}`,
      method: 'delete'
    })
  }
}
