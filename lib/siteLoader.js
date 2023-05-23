
/**
 * 构造函数传入的参数数组  对象 对象中包含stageName sourceType  selectors
 * 
 *  多stage的数据结构
 * [{
 *  stageName:'stage1',
 *  sources:[{
 *    sourceType:'image',
 *    selectors:['.selected']
 *  }]
 * }]
 * 
 * 全部一起加载的数据结构
 * 
 * [
 *  {
 *    sourceType:'image',
 *    selectors:['.selected','.test']
 *  },
 *  {
 *    sourceType:'media',
 *    selectors:['#video','.#audio']
 *  },
 * {
 *    sourceType:'font',
 *    selectors:['#font1','.#font2']
 *  }
 * ]
 * 
 * 三大类型 文字 图片 媒体（音频和视频）
 * 
 * 通过图片元素的class名 video元素的id名 audio元素的id名  获取相应的元素dom
 * 通过图片元素得到图片的地址，利用Image实例重新请求
 * 给video和audio元素设置canplay事件 
 * 
 * 进度的算法
 * 0-20 模拟进度
 * 21-80 真实进度
 * 81-100 虚拟进度
 * 
 * 已经加载的数量 / 需要加载的资源的数量
 * img.onload media.canplay  两个事件 会触发加载百分比的统计
 * 
 * updateProgress方法 用来更新进度
 * 
 * 
 * 
 * 原型方法 addEventListener 用来设置每个阶段的加载完成后执行的回调 通过特定事件名称来执行
 * 事件名称 除了 stageName是自定义之外  
 * 还有指定的几个  beforeStart  complete  error
 * 
 * 要有加载进度数据的事件 onProgress 加载进度数据要有
 * 
 * 原型方法 start 开始加载处理
 * 
 * 一个自动处理的方法 selfClean方法 把加载用生成的img实例清理掉
 * 
 * 考虑有的资源长时间无法加载的情况  超时处理
 * 
 * 
 * 先把整体的逻辑走通
 * 然后再做分阶段处理
 * 
 * 分阶段加载的逻辑
 * 一定是前面一个阶段加载完之后后面一个阶段才开始加载
 * 
 * 错误加载的处理
 * 
 *  ---- 待处理的逻辑 ----
 * 可能要检查是否是video audio用的source标签的src属性
 * 或者img元素用的是pictrue元素
 * picture 可以有source元素
 * video audio 可以有source元素
 * img 元素 srcset属性的处理
 * 
 * 
 * 老的浏览器可能不一定支持currentSrc属性 导致图片加载不出来
 * picture元素的话 要标记的是其中的img元素
 * 
 * 
 * React版本
 * 可以添加在定义加载东西 比如加载三维
 * 一键加载所有的资源（不想设置了）
 * 
*/



export default class SiteLoader {

  /**
    * @typedef {Object} StageObj - 特别的
    * @property {String} [stageName] - 如果不分阶段加载的话就不需要这个属性
    */

  /**
   * 
   * @param {StageObj[]} stageArr - 特别的 {@link StageObj}
   */
  constructor(stageArr) {

    this._allResorceData = stageArr
    this._allRourceCount = 0
    this._allDoms = {
      imgsDoms: [],
      mediaDoms: [],
    }

    this._isStageLoad = stageArr.length > 1

    this._stageDoms = [

    ]

    this._stageResourceCount = {

    }
    this._stageResourceLoadedCount = {

    }




    this._targetTextDom = null

    // 设置一个当前进度的目标 有一个持续间隔执行的方法通过检查这个数据来判断是否要 修改持续变化的progress的定时器
    this._targetProgress = 20
    this._preProgress = 0

    // 这个数据用来和真正的加载进度（比例）进行比较
    this._queneCompareNum = 0

    this._loadedCount = 0
    this._progress = 0
    this._progressDetectTimer = null
    this._progressChangeTimer = null
    this._events = {
      beforeStart: null,
      countComplete: null,
      trueLoadFinish: null,
      // error: null,
      progress: null
    }


    this.progressSpeed = 20

    this.needSpeedUp = false

    // 设置一下各个stage的StageName到events中属性
    if (this._isStageLoad) {
      this._allResorceData.forEach((stage) => {
        this._events[stage.stageName] = null
      })
    }


    this._errorCheck()
  }


  _errorCheck() {
    if (this._allResorceData.length === 0) {
      throw new Error('no resource data | 没有资源数据')
    }
    if (this._allResorceData instanceof Array === false) {
      throw new Error('传入的必须是一个数组 | resource data must be array')
    }

    if (this._isStageLoad) {
      this._allResorceData.forEach((stage) => {
        if (!stage.stageName) {
          throw new Error('没有设置stageName | no stageName')
        }
        if (stage.sources?.length === 0 || !stage.sources) {
          throw new Error('没有设置资源数据 sources data | no sources')
        }

        if (stage.sources instanceof Array === false) {
          throw new Error('资源数据sources必须是数组 | sources must be array')
        }

        // 检查每一个阶段中的sourceType是否正确
        if (stage.sources) {
          stage.sources.forEach((source) => {
            if (!['image', 'font', 'media'].includes(source.sourceType)) {
              throw new Error('sourceType is not correct | sourceType 名称不对，只能是image font或者media（视频或者音频）')
            }
          })
        }
      })

      // 检查stageName是否重复
      const stageNameArr = this._allResorceData.map((stage) => {
        return stage.stageName
      })

      const stageNameSet = new Set(stageNameArr)

      if (stageNameSet.size !== this._allResorceData.length) {
        throw new Error('stageName 重复 | stageName is repeat')
      }


    } else {

      if (!this._allResorceData[0].sources) {
        throw new Error('没有设置资源数据 sources data | no sources')
      }
      if (this._allResorceData[0].sources instanceof Array === false) {
        throw new Error('资源数据sources必须是数组 | sources must be array')
      }

      // 检查不分阶段加载时的sourceType的正确性
      this._allResorceData[0].sources.forEach((source) => {
        if (!['image', 'font', 'media'].includes(source.sourceType)) {
          throw new Error('sourceType is not correct | sourceType 名称不对，只能是image font或者media（视频或者音频）')
        }
      })
    }
  }

  setTargetTextDom(selector) {
    const selectedDom = document.querySelector(selector)
    this._targetTextDom = selectedDom
    // console.log(111111)
  }

  startLoad() {
    if (this._events.beforeStart) {
      this._events.beforeStart()
    }
    this._loaderInit()
    this._progressDetect()
  }

  _errorLoad(type, url) {

    this._loadedCount++
    this._trueLoadControl()
    console.warn(`加载${type}资源${url}失败`)

  }

  _loaderInit() {
    // init里面先统计 统计完成之后 再开始执行
    this._allResorceData.forEach((stage) => {

      if (this._isStageLoad) {
        this._stageResourceInit(stage)

      } else {


        this._allResourceInit(stage)

      }
    })


    // 这里已经全部统计完所有图片资源数量了
    // 分整体加载和分阶段加载
    if (this._allResorceData.length > 1) {
      this._mutileStageStartLoad(this._allResorceData[0].stageName)
    } else {
      this._allLoad()
    }

  }

  // 分阶段加载的资源初始化
  _stageResourceInit(stage) {
    // this._events[stage.stageName] = null
    /**
     * 
     *  *  多stage的数据结构
    * [{
    *  stageName:'stage1',
    *  sources:[{
    *    sourceType:'image',
    *    selectors:['.selected']
    *  }]
    * }]
     * 
     * 
     */
    // 用来统计每一个stage自己有多少数量资源
    this._stageResourceCount[stage.stageName] = 0
    this._stageResourceLoadedCount[stage.stageName] = 0


    stage.sources.forEach((source) => {

      this._stageDoms[stage.stageName] = this._stageDoms[stage.stageName] || {}
      this._stageDoms[stage.stageName][source.sourceType] = this._stageDoms[stage.stageName][source.sourceType] || []

      if (source.sourceType === 'image') {

        source.selectors.forEach((selector) => {
          const imgs = document.querySelectorAll(selector)
          // 保存所有的图片dom
          this._stageDoms[stage.stageName][source.sourceType] = [...this._stageDoms[stage.stageName][source.sourceType], ...imgs]
          // 把数量添加到总数量里面
          this._allRourceCount += imgs.length
          this._stageResourceCount[stage.stageName] += imgs.length
        })

      } else if (source.sourceType === 'media') {

        source.selectors.forEach((selector) => {
          const medias = document.querySelectorAll(selector)
          this._stageDoms[stage.stageName][source.sourceType] = [...this._stageDoms[stage.stageName][source.sourceType], ...medias]
          this._allRourceCount += medias.length
          this._stageResourceCount[stage.stageName] += medias.length
        })


      } else {

      }
    })



  }

  // 整体加载的资源初始化
  _allResourceInit(stage) {

    stage.sources.forEach((source) => {


      if (source.sourceType === 'image') {

        source.selectors.forEach((selector) => {
          const imgs = document.querySelectorAll(selector)
          // 保存所有的图片dom
          this._allDoms.imgsDoms = [...this._allDoms.imgsDoms, ...imgs]
          // 把数量添加到总数量里面
          this._allRourceCount += imgs.length

        })

      } else if (source.sourceType === 'media') {

        source.selectors.forEach((selector) => {

          const medias = document.querySelectorAll(selector)
          this._allDoms.mediaDoms = [...this._allDoms.mediaDoms, ...medias]
          this._allRourceCount += medias.length

        })


      } else {


      }

    })


  }



  // 整体加载调用的方法
  _allLoad() {
    if (this._allDoms.imgsDoms.length > 0) {
      this._loadAllImg()
    }
    if (this._allDoms.mediaDoms.length > 0) {
      this._loadAllMedia()
    }

  }

  // 分阶段加载调用的方法
  _mutileStageStartLoad(stageName) {
    // 分阶段加载
    // 这里传入第一个阶段的阶段名就可以 后续阶段的执行会在_loadStageImg和_loadStageMedia里面通过_stageLoadCheck执行
    const _stageDoms = this._stageDoms[stageName]
    for (let sourceType in _stageDoms) {
      if (sourceType === 'image') {
        this._loadStageImg(_stageDoms[sourceType], stageName)
      } else if (sourceType === 'media') {
        this._loadStageMedia(_stageDoms[sourceType], stageName)
      }
    }



  }

  // 分阶段加载用的图片加载    传入的是img元素DOM的数组
  _loadStageImg(imgsDoms, stageName) {
    imgsDoms.forEach((img) => {

      // const image = new Image()
      img.onload = () => {
        this._stageResourceLoadedCount[stageName]++
        this._loadedCount++
        this._stageLoadCheck(stageName)
        this._trueLoadControl()
      }

      img.onerror = () => {
        this._errorLoad('图片', img.currentSrc || img.src)
      }

      img.src = img.currentSrc || img.src;
    })
  }

  // 分阶段加载用的媒体加载   传入的是媒体元素DOM的数组
  _loadStageMedia(mediaDoms, stageName) {
    mediaDoms.forEach((media) => {

      media.addEventListener('canplaythrough', () => {
        this._stageResourceLoadedCount[stageName]++
        this._loadedCount++

        this._stageLoadCheck(stageName)
        this._trueLoadControl()
      })

      media.addEventListener('error', () => {
        this._errorLoad('音频/视频', media.currentSrc || media.src)
      })

      media.src = media.currentSrc || media.src
    })
  }

  // 每次分阶段加载每加载完一个资源 都要在资源完成的会调用使用的方法 用来检测分阶段的加载进度
  _stageLoadCheck(stageName) {
    if (this._stageResourceLoadedCount[stageName] === this._stageResourceCount[stageName]) {
      // 这样表示该stage已经加载完了 如果有这个阶段注册的回调 可以执行了
      // console.log(stageName, this._events)
      if (this._events[stageName]) {
        this._events[stageName]()
      }
      this._allResorceData.forEach((stageData, index) => {
        if (stageData.stageName === stageName) {
          if (index === this._allResorceData.length - 1) {
            // 说明是最后一个嘞
            // 但是结束最后的处理 还是要在_trueLoadControl里面处理 通过调用loadFinish
            return
          } else {
            // 说明不是最后一个
            // 然后那就是让下一个阶段开始加载
            this._mutileStageStartLoad(this._allResorceData[index + 1].stageName)
          }
        }
      })

      // 如果有下一个阶段 那么就加载下一个阶段
      // 如果没有下一个阶段 说明已经全部加载完了 那么可以完结 然后执行相应的回调

      //this._events[stageName]()
    }
  }

  // 整体加载的图片加载方法
  _loadAllImg() {
    this._allDoms.imgsDoms.forEach((img) => {

      img.onload = () => {
        this._loadedCount++
        this._trueLoadControl()
      }

      img.onerror = () => {
        this._errorLoad('图片', img.currentSrc || img.src)
      }
      // console.log(img.currentSrc)

      img.src = img.currentSrc || img.src;
    })

  }


  // 整体加载的媒体加载方法
  _loadAllMedia() {

    this._allDoms.mediaDoms.forEach((media) => {

      media.addEventListener('canplaythrough', () => {
        this._loadedCount++
        this._trueLoadControl()
      })

      media.addEventListener('error', () => {
        this._errorLoad('音频/视频', media.currentSrc || media.src)
      })

      media.src = media.currentSrc || media.src
    })

  }

  // 加载整体进度的检测方法 不管是分阶段加载还是整体加载都会调用
  _progressDetect() {

    // 改变进度的函数 用于定时器
    const progressChangeFunc = () => {
      this._progress++
      // 这里需要不断触发 progress相关的事件

      if (this._targetTextDom) {
        this._targetTextDom.innerText = this._progress
      }

      this._events.progress({
        progress: this._progress
      })


      if (this._progress === this._targetProgress) {
        clearInterval(this._progressChangeTimer)
      }
      // 这里是表示所有加载已完成 但是有可能progress
      if (this._progress === 100) {
        // 如果this.preProgress是100 说明已经全部count计数完成
        // 整个加载过程就结束了
        this._loadFinish()

      }

      if (this._progress < 50 && this._preProgress === 100 && this.needSpeedUp) {
        // 如果已经加载完成了 但是progress还没到100 同时this.needSpeedUp为true的话 就加速
        clearInterval(this._progressChangeTimer)
        this._progressChangeTimer = setInterval(progressChangeFunc, 0)
        this.needSpeedUp = false
      }

    }
    ``
    // 每隔100毫秒检查一次 看看 targetProgress有没有变化 有变化就修改递增计时器
    this._progressDetectTimer = setInterval(() => {
      if (this._targetProgress !== this._preProgress) {
        this._preProgress = this._targetProgress
        // 如果目标进度变化了 就重新设置一个递增计时器
        clearInterval(this._progressChangeTimer)
        this._progressChangeTimer = setInterval(progressChangeFunc, this.progressSpeed)
      }

    }, 100)

  }

  // 用来控制加载进度目标的方法 
  _trueLoadControl() {
    // 在每个资源被加载之后都要执行一次 用来检查当前真实的加载进度
    const loadedRatio = this._loadedCount / this._allRourceCount

    // 只要这一次比例比上一次多了超过25% 就增加目标进度值
    if (loadedRatio * 100 - this._queneCompareNum > 25 || loadedRatio === 1) {

      this._queneCompareNum = loadedRatio * 100
      this._targetProgress = Math.ceil(loadedRatio * 60) + 20
      if (loadedRatio === 1) {
        // 这里说明真正加载已经全部完成了
        this._targetProgress = 100
        if (this._events.trueLoadFinish) {
          this._events.trueLoadFinish()
        }
      }
      // console.log('jin')
    }

  }


  // 整个加载进度包括计数到100之后调用的方法
  _loadFinish() {
    // console.log('结束嘞')
    clearInterval(this._progressDetectTimer)
    clearInterval(this._progressChangeTimer)
    if (this._events.countComplete) {
      this._events.countComplete()
    }
  }

  // 设置事件的方法
  addEventListener(event, cb) {


    if (event in this._events) {
      // console.log(event, cb)
      this._events[event] = cb
      // console.log(this._events)
    } else {

      throw new Error('没有这个名字的事件可以设置')

    }



  }
}