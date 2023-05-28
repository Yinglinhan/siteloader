
<h4 align="center">

<p>
  <img alt="siteLoader logo" src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/logo.png?raw=true">
</p>
<p>
  <img alt="line" src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/line.png?raw=true">
</p>
<br />
<br />
<p>
 <img alt="me" src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/me.png?raw=true">
</p>

<p>
 <a href="https://www.bilibili.com/cheese/play/ss1226">
  <img alt="course" src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/course.png?raw=true">
 </a>
</p>



</h4>

## What is it / 有什么用

### 面对的问题⛔️
开发网站的时候，我们经常会需要有一个页面加载loading的效果，这样的方式能提高网站整体的一个浏览体验，但是我们又🚫不想要🚫一个简单（假）的loading，我们希望loading的进度能够和我们的页面资源加载的进度一致，这样既能够让用户更好的感受到页面的加载进度，也能最大程度地合理化整个加载效果的持续时间，而这个库就是为了解决这个问题而生的。

### 库的能力✅
这个库可以统计你传入的所有页面元素（图片/视频/音频）资源的整体加载进度，这个进度会从0到100变化，你可以通过progress事件，在每次这个进度变化时执行你自己设置的回调函数，并且你能通过该回调函数获取到当前的进度值。

而当所有你设置需要进行统计的资源都加载完成后，👉会触发相应的事件，而你通过这事件可以设置相应的回调函数，这样就很容易去执行一些自定义代码来实现一些页面的行为，比如隐藏loading，显示页面等等。

### 有两种加载统计模式🙂
- **整体加载** 最常用的一种加载统计模式，所有需要加载统计的资源作为一个整体一起加载，加载顺序按照浏览器的默认机制

- **分阶段依次加载** 所有设置需要统计的资源会被分成多个阶段，每个阶段的资源会依次加载，比如第一阶段的资源加载完之后，才会进行第二阶段的资源加载，每个阶段的加载完成后会触发相应的事件，你可以在事件中执行你自己的代码

### 目前能统计两类资源（可自定义其他资源的加载与检测）⚡️
- 图片
- 媒体（视频/音频）


## Usage / 使用方法

### 引入代码

ESM模式 CDN

```jsx  
import SiteLoader from 'https://www.unpkg.com/siteloader/dist/sl.js'
```

ESM模式 npm包安装模式
  
  ```jsx
  npm install siteloader
  ```
    
  ```jsx  
  import SiteLoader from 'siteloader'
  ``` 



UMD模式 html页面引入 
通过全局变量 SiteLoader（注意这里大小写）访问和使用

```jsx
<script src="https://www.unpkg.com/siteloader"></script>
```



### 添加需要进行加载统计的资源

> 一般来说，需要进行加载统计的资源一般是页面加载效果消失后会直接展示的那些资源,可以根据自己网页的情况进行设置

目前能进行设置的主要是图片和视频/音频

- 资源类型两种 🌟 sourceType 🌟 即 image 和 media（media就是视频或者音频）

- **创建实例时可以不传入任何数据**，这样就会默认统计所有的图片和视频/音频资源

- 设置元素的选择器 哪些元素的资源是需要进行统计的

  如果是img元素，建议用元素class选择器

  如果是picture元素，要用其中的img元素的class选择器

  如果是video或者audio元素，建议用元素的id选择器



```jsx

// 不穿入任何数据
// 这样就会默认统计当前页面所有的图片和视频/音频资源

const sl = new SiteLoader()
```

```jsx

// 整体加载 整体是一个数组作为参数传入 然后内部只有一个对象
// 对象中有sources属性 其值是一个数组 数组中是对象
// 不同类型的资源可以同时设置，用不同的对象来设置 {sourceType:'image',selectors:[]}
// selectors属性接受一个数组，同一类型的资源可以设置多个选择器

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

    }
  ]
)
```

```jsx
// 分阶段加载 这里设置了两个阶段 数组中有两个及两个以上对象 就是分阶段加载
// 每个阶段的资源都是一个对象，会比整体加载多一个stageName的属性
// stageName是一个字符串，用来标识这个阶段，可以完全自定义，但是不能重名

const sl = new SiteLoader(
  [
	    // stage1
		{
      stageName: 'stage1',
      sources: [{
        sourceType: 'image',
        selectors: ['.selected']
      }]
    },
	
	// stage2 
    {
      stageName: 'stage2',
      sources: [
        {
          sourceType: 'image',
          selectors: ['.ppp']
        },
        {
          sourceType: 'media',
          selectors: ['#video']
        }

      ]
    }
  ]
)
```

### 可以设置目标dom 用来展示进度数字

```jsx
sl.setTargetTextDom('.loading-num')
```

### 添加事件 addEventListener

```jsx
sl.addEventListener('countComplete', () => {
  console.log('countComplete')
})
```

默认的几个事件

```bash
beforeStart  开始加载前
countComplete 整个计数过程结束（进度值到100数字）
trueLoadFinish 资源真正地加载完之后就触发（很有可能进度值还没到100）
progress 计数加载过程中触发（进度值变化0-100都会触发 每次变化都会触发）
```


```jsx
// progress事件回调可以设置事件对象，通过事件对象的progress属性获取当前进度值
sl.addEventListener('progress', (e) => {
  console.log(e.progress)
})
```

如果分阶段，那么阶段名称stageName，也可以作为事件添加
```jsx
// 比如像演示代码中分阶段执行，那么可以这样设置
sl.addEventListener('stage1',  () => {
  console.log('stage1的加载执行完了')
})

```
设置的回调在阶段资源加载完成（真实加载）后触发
### 添加自定义的加载资源方式🥳

如果你的网页中有一些资源是通过js动态加载的，那么可以通过添加自定义的加载方式来统计这些资源的加载情况

setAddonLoadFunc 设置自定义加载函数

setAddonLoadData 在自定义加载函数中使用，一般放在onprogress事件中执行，传入已经加载的比例值

设置之后，自定义加载的进度会成为siteLoader加载进度的一部分

当执行siteLoader的startLoad方法，这里的自定义加载函数行为才会执行并进行加载 

**注意，这个设置也要在startLoad方法执行前设置**  
:heart:**目前只支持添加一个自定义的加载行为函数，如果有很多不同的单独的加载行为可以自行在函数中合并处理，最后只在一个持续触发的progress回调函数中执行setAddonLoadData方法并传入整合的加载比例值**

```jsx
// 注意通过siteLoader实例调用setAddonLoadFunc方法
// 把你要进行的自定义加载操作作为一个函数传入

// 这里演示的是在threejs中，使用loadingManager进行模型加载的情况

// 👉 注意 注意 👇 这里是setAddonLoadFunc 方法
sl.setAddonLoadFunc(

  () => {
   
    // 监听加载完成事件
    loadingManager.onLoad = function () {
      console.log("加载完成！");
    };

    // 监听加载进度事件 注意 要在这种加载进度中会持续调用的回调函数中设置setAddonLoadData方法
    loadingManager.onProgress = function (item, loaded, total) {
      console.log("正在加载 " + item + " (" + loaded + "/" + total + ")");
      // 👉 注意这里 👇 要使用setAddonLoadData方法 穿入已加载的比例值
      sl.setAddonLoadData(loaded / total)

    };

    // 加载模型
    var loader = new OBJLoader(loadingManager);
    loader.load('/resources/monkey.obj', function (object) {
      console.log(11)
    });
  }

)


```



### 设置计数变化的速度
设置越大的值，计数变化的速度越慢，建议设置在10-50之间

```jsx
sl.progressSpeed = 20 (默认)
```

### 设置是否在真实加载完之后计数会提速
默认是false，表示不提速，true表示会提速
比如当所有需要统计加载的资源全部加载完时，进度值才累计到55，那么如果needSpeedUp是true，进度值会以progressSpeed设置为0的速度迅速累计到100
如果needSpeedUp是false（默认值），那么进度值会以progressSpeed设置的速度从55开始继续累计到100，速度不会变快

```jsx
sl.needSpeedUp = false (默认)
```

### 启动加载
在设置完所有相关参数后，调用startLoad方法，开始加载

```jsx
sl.startLoad()
```


## Other Info / 其他信息

#### 我的其他分享

- [👉 所有视频分享尽在我的B站](https://space.bilibili.com/345880241)
- [👉 GSAP中文教程于文档](https://gsap.framer.wiki/)

  <a href="https://gsap.framer.wiki/">
  <img src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/gsap-cover.png?raw=true" style="border-radius: 6px;width:200px;"/>
  </a>

- [👉 Framer-Motion中文文档教程](https://motion.framer.wiki/)
  
   <a href="https://motion.framer.wiki/">
    <img src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/framer-motion-cover.png?raw=true" style="border-radius: 6px;width:200px"/>
   </a>


#### 我的课程
- [👉 《JavaScript高手之路全能课》](https://www.bilibili.com/cheese/play/ss1226)

  <a href="https://www.bilibili.com/cheese/play/ss1226">
    <img src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/course-cover.png?raw=true" style="border-radius: 6px;width:200px;"/>
  </a>
#### 我的微信
  <img src="https://github.com/Yinglinhan/siteloader/blob/main/public/mdresource/qrcode.JPG?raw=true" style="border-radius: 6px;width:200px;"/>