# jQuery.imgLoadCatch.js #

一款用于**自动捕获网页图片并进行加载进度计算**的插件

对于一些微信HTML的页面开发，如果图片比较多，通常会使用一个loading来过渡加载期，然而大多数情况下，loading都是模拟的一个跳动的百分数，等body onload之后，把loadinig隐藏  
这样的结果是，有时候因为网络信号欠佳，100%后不能如期关闭loading而需要一定时间等待，甚至如果onload卡住，页面将停在100%无法打开，这是一种很糟糕的体验

使用此插件后，这种情况即成为过去式，插件将自动捕获网页上所有的图片，甚至包括所有外链css文件上嵌入的背景图片，然后监听这些图片的加载度变化  
loading是不是已经finish了，让数据说了算！


## 用法 ##

### 引入script ###
	<script src="../libs/zepto-1.1.6.min.js"></script>
	<script src="../src/jQuery.imgLoadCatch.js"></script>

文件需要依赖jQuery，当然zepto也是可以的，然后再引入插件本身

### 使用示例 ###

	$(function() {
		$.imgLoadCatch({
			deep: 'all',
			step: function(percent) {
				console.log(percent + '%');
			},
			finish: function() {
				alert('全部图片加载完成!');
			}
		});
	});

插件的使用是非常简单的，无需任何html上的改动，也不需要任何class标记  
仅需要在jQuery ready后配置插件，并设置percent百分比输出和完成，即可完成全部功能

### 参数详情 ###

当然，肯定有更详细的js参数配置，以提供我们不同需求的开发：

**deep**：'img' / 'all'，设置图片捕获深度，默认值'img'  
'all' 值将包含背景图片一起计算，略微消耗一点点性能，但因为处于loading状态，对用户体验没有什么影响

**start**：function回调，插件开始工作是执行一次

**step**：function回调，每次当一张图片被加载完毕时即执行一次，此回调传回三个参数

- percent：当前加载进度百分比，0~100，不带百分比符号
- total：当前页面上图片的总数
- count：当前实际已经被加载的图片数

**imgTag**：function回调，当IMG全部加载完成时执行一次  
因为网页肯定先把所有IMG标签加载完，所以必定在完成之前执行  
（当仅'img'深度时，回调仍然会执行，且同样在完成之前执行）

**finish**：function回调，所有图片加载完毕时执行  
注意，为了让100%不至于一闪消失从而视觉上看不到效果，当所有图片加载完毕时，会延迟0.1秒再执行此回调

页面参数：

**no-catch**：对于某些特殊的img元素，如果不想加入加载捕获列队，使用此属性标记即可:

	<img no-catch src="space.gif">


## Demo ##
[http://code.xf09.net/imgloadcatch/demo/](http://code.xf09.net/imgloadcatch/demo/index.html "http://code.xf09.net/imgloadcatch/demo/index.html")

## 更新说明 ##

### v 0.2.1 ###
优化错误处理方式，为开发过程提供便利
当图片明确结果为出错后，仅抛出一个错误，不再会卡住loading百分比结束，抛错是为了给开发使用，调试好后仍然是全部加载完成
抛错将给出错误加载信息

