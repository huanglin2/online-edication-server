import request from '@/utils/request'
import de from 'element-ui/src/locale/lang/de'

export default {
  saveVideo(eduVideo) {
    return request({
      url: '/eduservice/video/addVideo',
      method: 'post',
      data: eduVideo
    })
  },
  deleteVideo(videoId) {
    return request({
      url: `/eduservice/video//deleteVideo/${videoId}`,
      method: 'delete',
      data: videoId
    })
  },
  updateVideo(eduVideo) {
    return request({
      url: '/eduservice/video/updateVideo',
      method: 'post',
      data: eduVideo
    })
  },
  getVideoInfo(videoId) {
    return request({
      url: `/eduservice/video/getVideoById/${videoId}`,
      method: 'get'
    })
  }
}
