import request from '@/utils/request'
import de from 'element-ui/src/locale/lang/de'

export default {
  // 查询所有学科列表
  getAllOneTwoSubject() {
    return request({
      url: '/eduservice/subject/getSubject',
      method: 'get'
    })
  }
}
