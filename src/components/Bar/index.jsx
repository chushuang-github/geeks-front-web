import { useEffect, useRef } from 'react'
// echarts的导入方式
import * as echarts from 'echarts'

function echartInit(node, xData, sData, title) {
  const myChart = echarts.init(node)
  // 绘制图表
  myChart.setOption({
    title: {
      text: title,
    },
    tooltip: {},
    xAxis: {
      data: xData,
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: sData,
      },
    ],
  })
}

function Bar({ style, xData, sData, title }) {
  // 1. 先不考虑传参问题  静态数据渲染到页面中
  // 2. 把那些用户可能定制的参数 抽象props (1.定制大小 2.data 以及说明文字)
  const nodeRef = useRef(null)

  // useEffect在初始化调用的时候，真实dom已经挂载到页面中了
  // useEffect依赖项发生变化，也会执行回调函数
  // 执行顺序：依赖项变化 -> 真实dom更新完毕 -> 执行useEffect回调函数
  useEffect(() => {
    echartInit(nodeRef.current, xData, sData, title)
  }, [xData, sData, title])

  return <div ref={nodeRef} style={style}></div>
}

export default Bar
