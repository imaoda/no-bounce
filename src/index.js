  // 获取所有纵向滚动的 dom
  let isHealthyTouch = 1 // 0 健康 1 都触顶  2 都触底   都触定且触底说明 scroll dom 无法滚动，也是健康

  const conf = { passive: false }

  let startY // 记录触摸起点坐标
  let oldY

  /**
   * 获取祖先列表
   */
  function getParentList(dom) {
    let target = dom
    const list = []
    while (target) {
      list.push(target)
      target = target.parentElement
    }
    return list
  }

  function reachTop(dom) {
    return dom.scrollTop <= 1
  }

  function reachBottom(dom) {
    return dom.scrollTop + dom.clientHeight >= dom.scrollHeight
  }

  function init() {
    if(window.$$_no_bounce_inited) return
    window.$$_no_bounce_inited = 1
    const body = document.body
    body.addEventListener(
      'touchstart',
      e => {
        startY = e.touches[0].pageY
        oldY = startY
        if (e.touches[1]) {
          // 如果是多指控制则放行
          isHealthyTouch = 0
          return
        }
        const scollDoms = getParentList(e.target)
        if (!scollDoms.length) {
          // 如果不涉及滚动元素，随你橡皮筋吧
          isHealthyTouch = 0
          return
        }

        let topCnt = 0
        let bottomCnt = 0
        scollDoms.forEach(dom => {
          if (reachTop(dom)) topCnt++
          if (reachBottom(dom)) bottomCnt++
        })

        const len = scollDoms.length

        if (topCnt === len && bottomCnt === len) {
          // 所有 box 都不存在滚动，此时是否阻止橡皮筋效果并不重要
          isHealthyTouch = 3
          return
        }
        if (topCnt < len && bottomCnt === len) {
          // 只存在向上滚动
          isHealthyTouch = 2
          return
        }
        if (topCnt == len && bottomCnt < len) {
          // 只存在向下滚动
          isHealthyTouch = 1
          return
        } else if (isHealthyTouch == 3) {
          // 对于不存在滚动条的，直接阻止所有
          e.preventDefault()
        }
        isHealthyTouch = 0 // 既有上滚动，又有下滚动
        return
      },
      conf,
    )

    body.addEventListener(
      'touchmove',
      e => {
        let endY = e.touches[0].pageY
        if (isHealthyTouch == 1) {
          // 都在顶部，要阻止下拉行为
          if (endY > startY) {
            e.preventDefault()
          }
        } else if (isHealthyTouch == 2) {
          // 都在顶部，要阻止上拉行为
          if (endY < startY) {
            e.preventDefault()
          }
        } else if (isHealthyTouch == 3) {
          // 对于不存在滚动条的，直接阻止所有
          e.preventDefault()
        }
        oldY = endY
        //健康touch 不用处理
      },
      conf,
    )

    body.addEventListener(
      'touchend',
      e => {
        isHealthyTouch = 0 // 重置，默认是健康的
      },
      conf,
    )
  }

  export default init