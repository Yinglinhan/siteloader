declare module 'siteloader' {
  export default class SiteLoader {
    constructor(data?: stageResourceData[] | resourceData[]);
    
    
    progressSpeed:number;

    needSpeedUp:boolean;

    setTargetTextDom(selector: string): void;

    addEventListener(type: EventType, listener: (event?: ProgressEvent) => void): void;
    
    setAddonLoadData(ratio: number): void;

    @MyDescription('设置附加加载函数')
    setAddonLoadFunc(func: () => void): void;
      

    @MyDescription('开始进行资源加载进度统计')
    startLoad(): void;
  }

  type EventType = 'beforeStart' | 'countComplete' | 'trueLoadFinish' | 'progress' | string;

  interface stageResourceData {
    stageName:string;
    sources: resourceData[];
  }

  interface resourceData {
    sourceType:  'media' | 'image';
    selectors: string[];
  }



}