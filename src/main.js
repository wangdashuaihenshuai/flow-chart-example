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

type Arrow struct {
  "extend": "defaultArrow",
  "stroke": "#fcb738"
}

type DashArrow struct {
  "extend": "defaultArrow",
  "dash": [8, 5]
}

def start:Start("new Vue()")
  :Arrow() -> observeData
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

def blank:Blank("vm.$mount called")
  :DashArrow() -> cond2
end

def cond2:Condition("has 'template'")
  ("yes") -> func
  ("no") -> html
end

def func("reder function")
  () -> create
end

def html("compiler html")
  () -> create
end

def create("create vm")
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
      width: 120,
      height: 60,
      fontType: {
        fontSize: 16,
        fontFamily: 'Calibri',
        fill: '#fff',
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
  height: height * 2
})

const layer = new Konva.Layer()

const Text = function (x, y, width, label, style) {
  const padding = style.padding || width * 0.1
  const opt = Object.assign({}, {text: label, width, x, y, padding}, style)
  const text = new Konva.Text(opt)
  layer.add(text)
}

const Box = function (centerX, centerY, width, height, label, style) {
  const x = centerX - width / 2
  const y = centerY - height / 2
  const opt = Object.assign({}, style, {x, y, width, height})
  var rect = new Konva.Rect(opt)
  layer.add(rect)
  Text(x, y, width, label, style.fontType)
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
void Line

const shortLine = function (oldPoints, k = 0.8) {
  let points = oldPoints.slice()
  let [x1, y1, x2, y2] = points.splice(points.length - 4, points.length)
  x2 = (x2 - x1) * k + x1
  y2 = (y2 - y1) * k + y1
  points = points.concat([x1, y1, x2, y2])
  return points
}

const draw = function (info, opt = {}) {
  const {nodesInfo, arrowsInfo, types} = info

  for (let a of arrowsInfo) {
    const type = types[a.type]
    Line(a, type)
  }

  for (let name of Object.keys(nodesInfo)) {
    const node = nodesInfo[name]
    const type = types[node.type]
    const {width, height, x, y, string} = node
    Box(x, y, width, height, string, type)
  }
}

draw(input)

stage.add(layer)
