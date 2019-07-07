### react 生命周期   
- 初始化阶段
    - getDefaultProps
    - getInitalState
    - componentWillMount
    - render
    - componentDidMount
- 运行中状态
    - componentWillReceiveProps
    - shouldComponentUpdate
    - componentWillUpdate
    - render
    - componentDidUpdate
- 销毁阶段
    - componentWillUnmount


### react diff原理
1. 只比较相同class Name 同一个组件   
2. 树形结构按层级分解，只比较同级   
3. 列表结构的每个单元添加key属性，方便比较（在某个列表中间添加或删除内容，有key,更快定位）   
4. 在调用 setState()方法时候，react会将其标记为dirty，当事件循环结束后，react 会检查所有标记为dirty的component 重新绘制一边   
5. 