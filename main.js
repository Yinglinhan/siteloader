
// import SiteLoader from "https://www.unpkg.com/siteloader/dist/sl.js";
// import SiteLoader from 'siteloader'
import SiteLoader from "./lib/siteLoader"

import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

var loadingManager = new THREE.LoadingManager();
console.log(loadingManager)



const sl = new SiteLoader(
  // [
  //   {
  //     sources: [
  //       {
  //         sourceType: 'image',
  //         selectors: ['.selected', '.ppp']
  //       },
  //       {
  //         sourceType: 'media',
  //         selectors: ['#video']
  //       }
  //     ]

  //   },

  // ]
)

const loadingBar = document.querySelector('.loading-color')

sl.addEventListener('progress', (e) => {

  loadingBar.style.transform = `translateX(-${100 - e.progress}%)`

})

sl.addEventListener('countComplete', () => {
  console.log(999999999999)
  setTimeout(() => {
    document.body.style.overflow = 'auto'
    document.querySelector('.loading-container').style.display = 'none'
  }, 200)
})

sl.addEventListener('trueLoadFinish', () => {
  console.log(999999)
})


sl.setTargetTextDom('.loading-num')

sl.progressSpeed = 80

sl.needSpeedUp = true


sl.setAddonLoadFunc(

  () => {
    console.log(99)
    // 监听加载完成事件
    loadingManager.onLoad = function () {
      console.log("加载完成！");
    };

    // 监听加载进度事件
    loadingManager.onProgress = function (item, loaded, total) {
      console.log("正在加载 " + item + " (" + loaded + "/" + total + ")");
      sl.setAddonLoadData(loaded / total)

    };

    // 加载模型
    var loader = new OBJLoader(loadingManager);
    loader.load('/resources/monkey.obj', function (object) {
      console.log(11)
    });
  }

)

sl.startLoad()




