import request from '@/utils/request'
import de from 'element-ui/src/locale/lang/de'

export default {
  // 学科列表
  getAllOneTwoSubject() {
    return request({
      url: '/eduservice/subject/getSubject',
      method: 'get'
    })
  },
  getTwoSubjectById(twoSubjectId) {
    return request({
      url: `/eduservice/subject/getTwoSubjectById/${twoSubjectId}`,
      method: 'get'
    })
  }
}
