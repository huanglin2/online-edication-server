import request from '@/utils/request'
import de from 'element-ui/src/locale/lang/de'

export default {
  // 1讲师列表   cur 当前页 limit 每页多少数据 t 条件
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      // url: '/table/list',
      url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      // 条件对象 data 把对象转json传递
      data: teacherQuery
    })
  },
  deleteTeacherById(id) {
    return request({
      url: `/eduservice/teacher/remove/${id}`,
      method: 'delete'
    })
  },
  getTeacherById(id) {
    return request({
      url: `/eduservice/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  saveTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/addTeacher/`,
      method: 'post',
      data: teacher
    })
  },
  updateTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/updateTeacher/`,
      method: 'post',
      data: teacher
    })
  },
  getAllTeacher() {
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get'
    })
  }
}
