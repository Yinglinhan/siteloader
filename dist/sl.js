class i {
  /**
    * @typedef {Object} StageObj - 特别的
    * @property {String} [stageName] - 如果不分阶段加载的话就不需要这个属性
    */
  /**
   * 
   * @param {StageObj[]} stageArr - 特别的 {@link StageObj}
   */
  constructor(e) {
    this._allResorceData = e, this._allRourceCount = 0, this._allDoms = {
      imgsDoms: [],
      mediaDoms: []
    }, this._isStageLoad = e.length > 1, this._stageDoms = [], this._stageResourceCount = {}, this._stageResourceLoadedCount = {}, this._targetTextDom = null, this._targetProgress = 20, this._queneCompareNum = 0, this._loadedCount = 0, this._progress = 0, this._progressChangeTimer = null, this._events = {
      beforeStart: null,
      countComplete: null,
      trueLoadFinish: null,
      // error: null,
      progress: null
    }, this.progressSpeed = 20, this.needSpeedUp = !1, this._isStageLoad && this._allResorceData.forEach((t) => {
      this._events[t.stageName] = null;
    }), this._errorCheck();
  }
  _errorCheck() {
    if (this._allResorceData.length === 0)
      throw new Error("no resource data | 没有资源数据");
    if (!(this._allResorceData instanceof Array))
      throw new Error("传入的必须是一个数组 | resource data must be array");
    if (this._isStageLoad) {
      this._allResorceData.forEach((s) => {
        var r;
        if (!s.stageName)
          throw new Error("没有设置stageName | no stageName");
        if (((r = s.sources) == null ? void 0 : r.length) === 0 || !s.sources)
          throw new Error("没有设置资源数据 sources data | no sources");
        if (!(s.sources instanceof Array))
          throw new Error("资源数据sources必须是数组 | sources must be array");
        s.sources && s.sources.forEach((o) => {
          if (!["image", "font", "media"].includes(o.sourceType))
            throw new Error("sourceType is not correct | sourceType 名称不对，只能是image font或者media（视频或者音频）");
        });
      });
      const e = this._allResorceData.map((s) => s.stageName);
      if (new Set(e).size !== this._allResorceData.length)
        throw new Error("stageName 重复 | stageName is repeat");
    } else {
      if (!this._allResorceData[0].sources)
        throw new Error("没有设置资源数据 sources data | no sources");
      if (!(this._allResorceData[0].sources instanceof Array))
        throw new Error("资源数据sources必须是数组 | sources must be array");
      this._allResorceData[0].sources.forEach((e) => {
        if (!["image", "font", "media"].includes(e.sourceType))
          throw new Error("sourceType is not correct | sourceType 名称不对，只能是image font或者media（视频或者音频）");
      });
    }
  }
  setTargetTextDom(e) {
    const t = document.querySelector(e);
    this._targetTextDom = t;
  }
  startLoad() {
    this._events.beforeStart && this._events.beforeStart(), this._loaderInit(), this._progressDetect();
  }
  _errorLoad(e, t) {
    this._loadedCount++, this._trueLoadControl(), console.warn(`加载${e}资源${t}失败`);
  }
  _loaderInit() {
    this._allResorceData.forEach((e) => {
      this._isStageLoad ? this._stageResourceInit(e) : this._allResourceInit(e);
    }), this._allResorceData.length > 1 ? this._mutileStageStartLoad(this._allResorceData[0].stageName) : this._allLoad();
  }
  // 分阶段加载的资源初始化
  _stageResourceInit(e) {
    this._stageResourceCount[e.stageName] = 0, this._stageResourceLoadedCount[e.stageName] = 0, e.sources.forEach((t) => {
      this._stageDoms[e.stageName] = this._stageDoms[e.stageName] || {}, this._stageDoms[e.stageName][t.sourceType] = this._stageDoms[e.stageName][t.sourceType] || [], t.sourceType === "image" ? t.selectors.forEach((s) => {
        const r = document.querySelectorAll(s);
        this._stageDoms[e.stageName][t.sourceType] = [...this._stageDoms[e.stageName][t.sourceType], ...r], this._allRourceCount += r.length, this._stageResourceCount[e.stageName] += r.length;
      }) : t.sourceType === "media" && t.selectors.forEach((s) => {
        const r = document.querySelectorAll(s);
        this._stageDoms[e.stageName][t.sourceType] = [...this._stageDoms[e.stageName][t.sourceType], ...r], this._allRourceCount += r.length, this._stageResourceCount[e.stageName] += r.length;
      });
    });
  }
  // 整体加载的资源初始化
  _allResourceInit(e) {
    e.sources.forEach((t) => {
      t.sourceType === "image" ? t.selectors.forEach((s) => {
        const r = document.querySelectorAll(s);
        this._allDoms.imgsDoms = [...this._allDoms.imgsDoms, ...r], this._allRourceCount += r.length;
      }) : t.sourceType === "media" && t.selectors.forEach((s) => {
        const r = document.querySelectorAll(s);
        this._allDoms.mediaDoms = [...this._allDoms.mediaDoms, ...r], this._allRourceCount += r.length;
      });
    });
  }
  // 整体加载调用的方法
  _allLoad() {
    this._allDoms.imgsDoms.length > 0 && this._loadAllImg(), this._allDoms.mediaDoms.length > 0 && this._loadAllMedia();
  }
  // 分阶段加载调用的方法
  _mutileStageStartLoad(e) {
    const t = this._stageDoms[e];
    for (let s in t)
      s === "image" ? this._loadStageImg(t[s], e) : s === "media" && this._loadStageMedia(t[s], e);
  }
  // 分阶段加载用的图片加载    传入的是img元素DOM的数组
  _loadStageImg(e, t) {
    e.forEach((s) => {
      s.onload = () => {
        this._stageResourceLoadedCount[t]++, this._loadedCount++, this._stageLoadCheck(t), this._trueLoadControl();
      }, s.onerror = () => {
        this._errorLoad("图片", s.currentSrc || s.src);
      }, s.src = s.currentSrc || s.src;
    });
  }
  // 分阶段加载用的媒体加载   传入的是媒体元素DOM的数组
  _loadStageMedia(e, t) {
    e.forEach((s) => {
      s.addEventListener("canplaythrough", () => {
        this._stageResourceLoadedCount[t]++, this._loadedCount++, this._stageLoadCheck(t), this._trueLoadControl();
      }), s.addEventListener("error", () => {
        this._errorLoad("音频/视频", s.currentSrc || s.src);
      }), s.src = s.currentSrc || s.src;
    });
  }
  // 每次分阶段加载每加载完一个资源 都要在资源完成的会调用使用的方法 用来检测分阶段的加载进度
  _stageLoadCheck(e) {
    this._stageResourceLoadedCount[e] === this._stageResourceCount[e] && (this._events[e] && this._events[e](), this._allResorceData.forEach((t, s) => {
      if (t.stageName === e) {
        if (s === this._allResorceData.length - 1)
          return;
        this._mutileStageStartLoad(this._allResorceData[s + 1].stageName);
      }
    }));
  }
  // 整体加载的图片加载方法
  _loadAllImg() {
    this._allDoms.imgsDoms.forEach((e) => {
      e.onload = () => {
        this._loadedCount++, this._trueLoadControl();
      }, e.onerror = () => {
        this._errorLoad("图片", e.currentSrc || e.src);
      }, e.src = e.currentSrc || e.src;
    });
  }
  // 整体加载的媒体加载方法
  _loadAllMedia() {
    this._allDoms.mediaDoms.forEach((e) => {
      e.addEventListener("canplaythrough", () => {
        this._loadedCount++, this._trueLoadControl();
      }), e.addEventListener("error", () => {
        this._errorLoad("音频/视频", e.currentSrc || e.src);
      }), e.src = e.currentSrc || e.src;
    });
  }
  // 加载整体进度的检测方法 不管是分阶段加载还是整体加载都会调用
  _progressDetect() {
    const e = () => {
      this._progress < this._targetProgress && (this._progress++, this._targetTextDom && (this._targetTextDom.innerText = this._progress), this._events.progress({
        progress: this._progress
      }), this._progress === this._targetProgress && clearInterval(this._progressChangeTimer), this._progress === 100 && this._loadFinish(), this._progress < 50 && this._preProgress === 100 && this.needSpeedUp && (clearInterval(this._progressChangeTimer), this._progressChangeTimer = setInterval(e, 0), this.needSpeedUp = !1));
    };
    this._progressChangeTimer = setInterval(e, this.progressSpeed);
  }
  // 用来控制加载进度目标的方法 
  _trueLoadControl() {
    const e = this._loadedCount / this._allRourceCount;
    (e * 100 - this._queneCompareNum > 25 || e === 1) && (this._queneCompareNum = e * 100, this._targetProgress = Math.ceil(e * 60) + 20, e === 1 && (this._targetProgress = 100, this._events.trueLoadFinish && this._events.trueLoadFinish()));
  }
  // 整个加载进度包括计数到100之后调用的方法
  _loadFinish() {
    clearInterval(this._progressChangeTimer), this._events.countComplete && this._events.countComplete();
  }
  // 设置事件的方法
  addEventListener(e, t) {
    if (e in this._events)
      this._events[e] = t;
    else
      throw new Error("没有这个名字的事件可以设置");
  }
}
export {
  i as default
};
