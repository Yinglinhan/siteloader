
// import SiteLoader from "https://www.unpkg.com/siteloader/dist/sl.js";
// import SiteLoader from 'siteloader'

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


sl.addEventListener('countComplete', () => {
  console.log('8888888888888888888888')
})

sl.addEventListener('trueLoadFinish', () => {
  console.log('嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿')
})

sl.setTargetTextDom('.loading-num')
// sl.needSpeedUp = true
sl.startLoad()


