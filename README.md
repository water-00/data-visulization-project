## 基本思路

如果无法访问国外网站，必应搜索“如何配置clash for windows”，下载并配置好

如果要买clash节点：https://yuritele.com/ ，一个我觉得很便宜的网站，选20元 128GB/年 即可

基于清华大学“全国城市空气质量数据可视化、全球气温变化温室气体排放可视化及分析”项目（主要是后者）做一个全球环境数据可视化图

实现内容：

- 可缩放的世界地图，鼠标悬停于某地区会显示该地区的数据
- 可点击、拖拽实现缩放的折线图，或者像[股票折线图](https://github.com/arnauddri/d3-stock)一样内容丰富的折线图
- 对数据进行分析得出来的一些图表，比如heatmap（其实就是一个矩阵，矩阵元素是两个因素的相关性）或其他

数据网站：

- https://climate.nasa.gov/vital-signs/carbon-dioxide/

  类别：Carbon Dioxide, Global Temperature, Methane, Ocean Warmng, Ice Sheets, Sea Level, Arctic Sea Ice Minimum Extent

  有txt数据，一些是全球一些不是，页面上对折线图Click+drag to zoom的功能实现

  且这个网站主打环境保护，可以找到相当多的基于网站给出的数据的环境保护分析和论文（希望我们不用看）

- https://climatedata.imf.org/pages/climatechange-data

  有许多好看的图表，可以下载csv

- Kaggle

  https://www.kaggle.com/search

  搜索climate，我只觉得那个2k赞的有点用

- https://berkeleyearth.org/data/

  Kaggle上最大的地表温度数据集的数据来源，还没细看

还没确定是否有用的网站：

- https://www.climate.gov/maps-data/all
- https://climateknowledgeportal.worldbank.org/download-data world bank网站

可参考的github项目：

![image-20231120221810438](md_img/image-20231120221810438.png)

点击github页面右边的链接可以直接访问仓库对应的可运行的demo/网站

- https://github.com/bartromgens/climatemaps ，一个动态的气象地图，有各种炫酷的功能
- https://github.com/MaayanLab/clustergrammer ，炫酷的动态heatmap，做heatmap时可参考效果
- https://github.com/arnauddri/d3-stock ，信息、形式都比较丰富的股票折线图
