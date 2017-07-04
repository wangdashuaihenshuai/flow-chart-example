<template>
  <div class="all">
    <div class="edit">
      <codemirror :code="code" :options="editorOption" @change="codeChange"></codemirror>
    </div>
    <div class="canvas-container">
      <div id="container">
      </div>
    </div>
  </div>
</template>

<script>
const {compiler, layout, Container} = require('Hachart')
const delay = 1000
const c = `
type Condition struct {
  "extend": "deafultShape",
  "fill": "#fcb738"
}

type Close struct {
  "extend": "deafultShape",
  "width": 80,
  "height": 80,
  "cornerRadius": 50,
  "fontType": {
    "fontSize": 16,
    "offsetY": -30,
    "padding": 0
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
  () -> en
end

def en:Close("结束")
  () -> next
end

def next("test")
end
`
export default {
  name: 'hello',
  data () {
    return {
      code: c,
      renderClock: null,
      editorOption: {
        tabSize: 2,
        mode: 'text/x-ruby',
        theme: 'solarized light',
        styleActiveLine: true,
        lineWrapping: true,
        lineNumbers: true,
        smartIndent: false,
        line: true
      }
    }
  },
  mounted: function () {
    this.render(this.code)
  },
  methods: {
    codeChange (newCode) {
      this.renderLater(newCode)
    },
    renderLater (code) {
      clearTimeout(this.renderClock)
      this.renderClock = setTimeout(() => {
        this.render(code)
      }, delay)
    },
    render (code) {
      try {
        const input = layout(compiler(code))
        const c = new Container({containerID: 'container'})
        c.draw(input)
      } catch (e) {
        console.log(code)
        console.log(e)
      }
    }
  }
}
</script>

<style>
.edit {
  width: 50%;
}

.CodeMirror.cm-s-solarized.cm-s-light.CodeMirror-wrap {
  height: auto;
}
.canvas-container {
  margin: auto;
}
.all {
  display: flex;
}
</style>
