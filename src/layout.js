const dagre = require('dagre')
const formater = require('./formater.js')

module.exports = function (input) {
  const g = new dagre.graphlib.Graph({ directed: true, compound: true, multigraph: true })
  g.setGraph({})
  g.setDefaultEdgeLabel(function () { return {} })
  const {nodes, arrows, types} = formater(input)
  for (let name of Object.keys(nodes)) {
    const node = nodes[name]
    g.setNode(name, node)
  }
  for (let k of Object.keys(arrows)) {
    const a = arrows[k]
    g.setEdge(a.from, a.to)
  }
  dagre.layout(g)
  const nodesInfo = {}
  const arrowsInfo = []
  g.nodes().forEach(n => {
    nodesInfo[n] = g.node(n)
  })
  g.edges().forEach(e => {
    const key = `${e.v}->${e.w}`
    arrowsInfo.push(Object.assign(arrows[key], g.edge(e)))
  })
  return {
    nodesInfo,
    arrowsInfo,
    types
  }
}
