
import SiteLoader from "https://www.unpkg.com/siteloader/dist/sl.js";
// import SiteLoader from 'siteloader'


console.log(999)
const sl = new SiteLoader(
  [
    {
      sources: [
        {
          sourceType: 'image',
          selectors: ['.selected', '.ppp']
        },
        {
          sourceType: 'media',
          selectors: ['#video']
        }
      ]

    },

    //   {
    //   stageName: 'stage1',
    //   sources: [{
    //     sourceType: 'image',
    //     selectors: ['.selected']
    //   }]
    // },
    // {
    //   stageName: 'stage2',
    //   sources: [
    //     {
    //       sourceType: 'image',
    //       selectors: ['.ppp']
    //     },
    //     {
    //       sourceType: 'media',
    //       selectors: ['#video']
    //     }

    //   ]
    // }
  ]
)

const loadingBar = document.querySelector('.loading-color')

sl.addEventListener('progress', (e) => {
  console.log(e.progress, '嘿')
  console.log(loadingBar.style.transform = `translateX(-${100 - e.progress}%)`)

})
// sl.addEventListener('stage1', () => {
//   console.log('stage1结束了111111111111111')
// })

// sl.addEventListener('stage2', () => {
//   console.log('stage1结束了2222222222')
// })

sl.addEventListener('countComplete', () => {
  console.log('8888888888888888888888')
})

sl.addEventListener('trueLoadFinish', () => {
  console.log('嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿')
})

sl.setTargetTextDom('.loading-num')
// sl.needSpeedUp = true
sl.startLoad()


// const video = document.querySelectorAll('#video')
// console.log(video)
// setTimeout(() => {
//   video[0].addEventListener("canplay", (event) => {
//     console.log("Video can start, but not sure it will play through.");
//   })
//   video[0].src = video[0].src

// }, 5000)