<template>
  <div class="v-waterfall-content" id="v-waterfall">
    <div v-for="(img, index) in waterfallList" :key="index" class="v-waterfall-item"
        :style="{top:img.top+'px',left:img.left+'px',width:waterfallImgWidth+'px',height:img.height}">
      <img :src="img.src" :style="{width:waterfallImgWidth+'px',height: img.height}" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-waterfall",
    data(){
      return {
        waterfallList:[],
        imgArr:[
          require('../assets/1.png'),
          require('../assets/2.png'),
          require('../assets/3.png'),
          require('../assets/4.png'),
          require('../assets/5.png'),
          require('../assets/6.png'),
          require('../assets/7.png')
        ],
        waterfallImgWidth: 100,
        waterfallImgCol: '',
        waterfallImgRight: 10,//图片与右边间隔
        waterfallImgBottom: 10,//图片与下边间隔
        waterfallDeviationHeight: [],
        imgList:[],
        flag: false
      }
    },
    created() {
      this.getList()
      // 如果有加载更多功能 这个imgList不要push 
      // 只需重新赋值最新的数据并再执行imgPreloading()
    },
    mounted(){
      this.calculationWidth();
      window.addEventListener('scroll', () => {
        this.listenerScroll(() => {
          if(!this.flag){
            this.flag = true;
            console.log('进来了')
            this.getList(true)
          }
        })
      }, false)
    },
    methods:{
      getList(add = false){
        this.flag = false;
        this.imgList = [];
        for (let i = 0;i < 30;i++){
          const index = Math.floor(Math.random() * 7);
          this.imgList.push(this.imgArr[index]);
        }
        if(add){
          this.imgPreloading();
        }
      },
      //计算每个图片的宽度或者是列数
      calculationWidth(){
        let domWidth = document.getElementById("v-waterfall").offsetWidth;
        // 以规定好的列数布局
        if (!this.waterfallImgWidth ){
          this.waterfallImgWidth = (domWidth-this.waterfallImgRight*this.waterfallImgCol)/this.waterfallImgCol;
        // 以规定好的图片宽度布局
        }else {
          this.waterfallImgCol = Math.floor(domWidth/(this.waterfallImgWidth+this.waterfallImgRight))
        }
        //初始化偏移高度数组
        this.waterfallDeviationHeight = new Array(this.waterfallImgCol);
        for (let i = 0;i < this.waterfallDeviationHeight.length;i++){
          this.waterfallDeviationHeight[i] = 0;
        }
        this.imgPreloading()
      },
      //图片预加载
      imgPreloading(){
        for (let i = 0;i < this.imgList.length;i++){
          let aImg = new Image();
          aImg.src = this.imgList[i];
          aImg.onload = aImg.onerror = ()=>{
            let imgData = {};
            imgData.height = this.waterfallImgWidth/aImg.width*aImg.height; //与图片同等
            imgData.src = this.imgList[i];
            this.waterfallList.push(imgData);
            this.rankImg(imgData);
          }
        }
      },
      //瀑布流布局
      rankImg(imgData){
        let {waterfallImgWidth,waterfallImgRight,waterfallImgBottom,waterfallDeviationHeight} = this;
        let minIndex = this.filterMin();
        imgData.top = waterfallDeviationHeight[minIndex];
        imgData.left = minIndex*(waterfallImgRight+waterfallImgWidth);
        waterfallDeviationHeight[minIndex] += (imgData.height + waterfallImgBottom);
      },
      /**
       * 找到最短的列并返回下标
       * @returns {number} 下标
       */
      filterMin(){
        const min = Math.min.apply(null, this.waterfallDeviationHeight);
        return this.waterfallDeviationHeight.indexOf(min);
      },
      // 监听滚动到底部
      listenerScroll(callback) { // 监听滚动是否接近底部 
        this.$nextTick(() => {
          const u = navigator.userAgent;
          // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          let scr = document.documentElement.scrollTop || document.body.scrollTop; // 向上滚动的那一部分高度
          let clientHeight = document.documentElement.clientHeight || document.body.clientHeight; // 屏幕高度也就是当前设备静态下你所看到的视觉高度
          let scrHeight = isiOS ? document.documentElement.scrollHeight : document.body.scrollHeight; // 整个网页的实际高度，兼容Pc端
          if (scr + clientHeight + 20 >= scrHeight) { //当快要滚动到底部时
            callback()
          }
        })
      }
    }
  }
</script>

<style scoped>
.v-waterfall-content{
    width: 100%;
    height: 100%;
    position: relative;
}
.v-waterfall-item{
    float: left;
    position: absolute;
}
.v-waterfall-item img{
    width: auto;
    height: auto;
}
</style>