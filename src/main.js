// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import App from './App'
// Vue.config.productionTip = false
//
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })

import Konva from 'konva'
import {compiler} from 'flow-compiler'
import layout from 'flow-composition'

const code = `
type Condition struct {
  "extend": "deafultShape",
  "fill": "#fcb738"
}

type Close struct {
  "extend": "deafultShape",
  "fontType": {
    "padding": 20
  },
  "fill": "#da5961"
}

type Start struct {
  "extend": "deafultShape",
  "fill": "#34495d"
}

type Blank struct {
  "extend": "deafultShape",
  "fill": "#fff",
  "fontType": {
    "fontSize": 16,
    "fontFamily": "Calibri",
    "fill": "#8699a3",
    "fontStyle": "bold",
    "align": "center"
  }
}

type DashArrow struct {
  "extend": "defaultArrow",
  "dash": [8, 5]
}

def action:Close("开始")
  () -> start
end

def start:Start("new Vue()")
  () -> observeData
end

def observeData("Observe Data")
  () -> initEvents
end

def initEvents("Init Events")
  () -> cond1
end

def cond1:Condition("Has 'el' option?")
  ("yes") -> cond2
  :DashArrow("no") -> blank
end

def blank:Blank("vm.$mount(el) is called")
  :DashArrow() -> cond2
end

def cond2:Condition("has 'template' option?")
  ("yes") -> func
  ("no") -> html
end

def func("Compile template into reder function")
  () -> create
end

def html("Compile el's outerHTML as template")
  () -> create
end

def create("Create vm.$el and replace 'el' with it")
  () -> mounted
end

def mounted:Close("mounted")
  () ->beforeClose
end

def beforeClose("Teardown watchers, child components and event listeners")
  () -> close
end

def close:Close("destroyed")
end
`
const opt = {
  type: {
    deafultShape: {
      fill: '#3ab882',
      cornerRadius: 10,
      maxWidth: 180,
      fontType: {
        fontSize: 16,
        fontFamily: 'Calibri',
        padding: 20,
        fill: '#fff',
        fontStyle: 'bold',
        align: 'center'
      }
    },
    defaultAnnotation: {
      fill: '#fff',
      fontType: {
        fontSize: 16,
        fontFamily: 'Calibri',
        padding: 5,
        fill: '#8699a3',
        fontStyle: 'bold',
        align: 'center'
      }
    },
    defaultArrow: {
      stroke: '#8699a3',
      strokeWidth: 3,
      lineCap: 'round',
      lineJoin: 'round'
    }
  }
}
const input = layout(compiler(code, opt))

var width = window.innerWidth
var height = window.innerHeight
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height * 3
})

const layer = new Konva.Layer()

const Text = function (x, y, width, height, label, style) {
  const opt = Object.assign({}, style, {text: label, width, x, y})
  const text = new Konva.Text(opt)
  layer.add(text)
}

const Box = function (centerX, centerY, width, height, label, style) {
  const x = centerX - width / 2
  const y = centerY - height / 2
  const opt = Object.assign({}, style, {x, y, width, height})
  var rect = new Konva.Rect(opt)
  layer.add(rect)
  Text(x, y, width, height, label, style.fontType)
}

const Line = function (a, type) {
  const points = []
  a.points.map(p => {
    points.push(p.x, p.y)
  })
  const shortPoints = shortLine(points)
  const opt = Object.assign({}, type, {points: shortPoints})
  const line = new Konva.Line(opt)
  layer.add(line)
  const arrowPoints = points.slice(points.length - 4, points.length)
  const arrow = new Konva.Arrow({
    x: 0,
    y: 0,
    points: arrowPoints,
    pointerLength: type.strokeWidth * 3,
    pointerWidth: type.strokeWidth * 3,
    fill: type.stroke
  })
  layer.add(arrow)
}

const shortLine = function (oldPoints, k = 0.8) {
  let points = oldPoints.slice()
  let [x1, y1, x2, y2] = points.splice(points.length - 4, points.length)
  x2 = (x2 - x1) * k + x1
  y2 = (y2 - y1) * k + y1
  points = points.concat([x1, y1, x2, y2])
  return points
}

const draw = function (info, opt = {}) {
  const {nodesInfo, labelInfo, arrowsInfo, types} = info

  for (let a of arrowsInfo) {
    const type = types[a.type]
    Line(a, type)
  }
  for (let l of labelInfo) {
    const {x, y, width, height, label} = l
    const type = types['defaultAnnotation']
    Box(x, y, width, height, label, type)
  }

  for (let name of Object.keys(nodesInfo)) {
    const node = nodesInfo[name]
    const type = types[node.type]
    const {width, height, x, y, string} = node
    Box(x, y, width, height, string, type)
  }
}
console.log(input)
draw(input)

stage.add(layer)
