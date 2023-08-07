var canvas = Mango();
var mng = canvas;
var mango = canvas;
var cnv = canvas.setCanvas(document.getElementById('c'));
var ctx = cnv.ctx;
var elem = document.getElementById('c');
var entity = canvas.entity;
var entityGroup = canvas.entityGroup;
var layer = canvas.Layer;
var app = canvas.app

canvas.setPixels(300, 200)

var cTools = document.querySelectorAll('.c-tool')
var tools = document.querySelectorAll('.tool')
var activeTool = 'move'
var selection = []
var touchstart = ''
var touchend = ''
var rootList = document.querySelector('.list')

function inProgress(title, progress, body = '', isHide = false) {
  document.querySelector('.progress').style.display = 'block'
  document.querySelector('.progress progress').style.display = isHide ? 'none' : 'block'
  document.querySelector('.progress progress').value = progress
  document.querySelector('.pr-title').innerHTML = title
  document.querySelector('.pr-body').innerHTML = body
}

function outProgress() {
  document.querySelector('.progress').style.display = 'none'
}

var editorBox = new entity({
  stroke: '#557BB4',
  fill: '#ffffff10',
  isHidden: true,
  z: 9999999999999999
})

var widthEditorBox = new entity({
  width: 10,
  height: 20,
  x: -100,
  y: -100,
  fill: '#557BB4',
  isHidden: true,
  z: 9999999999999999
})

var heightEditorBox = new entity({
  width: 20,
  height: 10,
  x: -100,
  y: -100,
  fill: '#557BB4',
  isHidden: true,
  z: 9999999999999999
})

var rotaterBox = new entity({
  width: 20,
  height: 20,
  x: -100,
  y: -100,
  fill: '#557BB4',
  isHidden: true,
  z: 9999999999999999
})

var point = new entity({
  type: 'circle',
  x: -100,
  y: -200,
  isHidden: true,
  radius: 5,
  fill: '#557BB4',
  arcLevel: 3,
  z: 9999999999999999
})

tools.forEach(function(elem) {
  elem.onclick = function() {
    document.querySelector('[data-tool="' + activeTool + '"]').className = document.querySelector('[data-tool="' + activeTool + '"]').className.replaceAll('active-icn', '')
    activeTool = elem.dataset.tool
    document.querySelector('[data-tool="' + activeTool + '"]').className += ' active-icn'


    if (activeTool != 'edit') {
      editorBox.data.render = false
    } else {
      editorBox.data.render = true
    }
  }
})

document.querySelectorAll('.option-title').forEach(function(elem) {
  if (elem.dataset.toggle == 0) {
    elem.querySelector('ion-icon').name = 'chevron-forward-outline'
    document.querySelector('.' + elem.dataset.pair).style.display = 'none'
  }
  elem.onclick = function() {
    if (elem.dataset.toggle == 1) {
      elem.dataset.toggle = 0
      elem.querySelector('ion-icon').name = 'chevron-forward-outline'
      document.querySelector('.' + elem.dataset.pair).style.display = 'none'
    } else if (elem.dataset.toggle == 0) {
      elem.dataset.toggle = 1
      elem.querySelector('ion-icon').name = 'chevron-down-outline'
      document.querySelector('.' + elem.dataset.pair).style.display = 'block'
    }
  }

})


function widthStart(e) { editMove(e, 'width') }

function heightStart(e) { editMove(e, 'height') }

function rotaterStart(e) { editMove(e, 'rotate') }


document.querySelector('[data-tool="shapes"]').click()


editorBox.data.on('touchstart', function() {
  document.body.addEventListener('touchmove', editMove)
})

editorBox.data.on('touchend', function() {
  document.body.removeEventListener('touchmove', editMove)
})


widthEditorBox.data.on('touchstart', function() {
  document.body.addEventListener('touchmove', widthStart)
})

document.body.addEventListener('touchend', function() {
  document.body.removeEventListener('touchmove', widthStart)
})


heightEditorBox.data.on('touchstart', function() {
  document.body.addEventListener('touchmove', heightStart)
})

document.body.addEventListener('touchend', function() {
  document.body.removeEventListener('touchmove', heightStart)
})

rotaterBox.data.on('touchstart', function() {
  document.body.addEventListener('touchmove', rotaterStart)
})

document.body.addEventListener('touchend', function() {
  document.body.removeEventListener('touchmove', rotaterStart)
})

//////////////

editorBox.data.on('mousedown', function() {
  document.body.addEventListener('mousemove', editMove)
})

editorBox.data.on('mouseup', function() {
  document.body.removeEventListener('mousemove', editMove)
})

widthEditorBox.data.on('mousedown', function() {
  document.body.addEventListener('mousemove', widthStart)
})

document.body.addEventListener('mouseup', function() {
  document.body.removeEventListener('mousemove', widthStart)
})

heightEditorBox.data.on('mousedown', function() {
  document.body.addEventListener('mousemove', heightStart)
})

document.body.addEventListener('mouseup', function() {
  document.body.removeEventListener('mousemove', heightStart)
})

function editEntity(entity, update = false, hide = false) {
  if (update == false) {
    document.querySelector('[data-tool="edit"]').click()
  }

  if (hide == false) {
    editorBox.data.x = (entity.x - 10)
    editorBox.data.y = (entity.y - 10)
    editorBox.data.width = (entity.width + 20)
    editorBox.data.height = (entity.height + 20)

    if (entity.type == 'ellipse') {
      editorBox.data.x = entity.x - (entity.width + 10)
      editorBox.data.y = entity.y - (entity.height + 10)
      editorBox.data.width = 20 + entity.width * 2
      editorBox.data.height = 20 + entity.height * 2
    }

    widthEditorBox.data.x = editorBox.data.x + editorBox.data.width + 5
    widthEditorBox.data.y = editorBox.data.y + (editorBox.data.height / 2) - 10

    heightEditorBox.data.y = editorBox.data.y + editorBox.data.height + 5
    heightEditorBox.data.x = editorBox.data.x + (editorBox.data.width / 2) - 10

    rotaterBox.data.y = editorBox.data.y + editorBox.data.height + 5
    rotaterBox.data.x = editorBox.data.x + editorBox.data.width + 5
  }
}

function checkSelections() {
  if (selection[0] == undefined || selection[0].name == undefined) {
    editorBox.data.render = false
    document.querySelectorAll('.for_entity_update').forEach(function(elem) {
      elem.disabled = true
    })
  } else {
    editorBox.data.render = true
    document.querySelectorAll('.for_entity_update').forEach(function(elem) {
      elem.disabled = false
    })
  }

}

checkSelections()


function hErr(e) {
  alert(e)
}

window.onerror = hErr
document.querySelectorAll('*').forEach(function(elem) {
  elem.onerror = hErr
})

function changeInputValues() {
  document.querySelectorAll('.for_entity_update').forEach(function(elem) {
    elem.value = elem.checked = selection[0][elem.id]
  })

}

function update() {
  checkSelections()

  canvas.entityStore.forEach(function(entity) {
    if (entity.initedClick == undefined) {
      entity.scale = { x: graphical.scale, y: graphical.scale }
      if (entity.isHidden == undefined && entity.name != undefined) {
        entity.on('click', function(e) {
          if (activeTool == 'edit') {
            selection = [entity]
            editEntity(entity)
            changeInputValues()
            document.querySelectorAll('.list .proper').forEach(function(elem) {
              elem.className = 'proper'
            })

            document.querySelector('#ID_' + entity.id).className = 'proper active'
          }
        })
      }
    }
  })
}

function uiUpdate() {
  rootList.innerHTML = ''
  var select = selection[0]


  canvas.entityStore.forEach(function(select) {
    if (select.isHidden == undefined && select.name != undefined) {

      var elemName = (select.name == 'NOT_NAME_SETTELD' ? (select.type == 'roundRect' ? 'rect' : select.type) + '_' + select.id : select.name)
      var icon = 'shapes'
      icon = (select.render == false ? 'remove' : 'shapes')

      rootList.innerHTML += `<div id="ID_${select.id}" class="proper active">
              <ion-icon name="${icon}-outline"></ion-icon>
              <div class="proper-text">${elemName}</div>
              <div class="inner"></div>
            </div>`

    }
  })

  document.querySelectorAll('.list .proper').forEach(function(elem) {
    elem.className = 'proper'
  })

  if (rootList.querySelector('#ID_' + select.id)) {
    rootList.querySelector('#ID_' + select.id).className = 'proper active'
  }


  document.querySelectorAll('.list .proper').forEach(function(elem) {
    elem.onclick = function() {

      document.querySelectorAll('.list .proper').forEach(function(elem) {
        elem.className = 'proper'
      })

      elem.className = 'proper active'
      editEntity(canvas.getEntityById(elem.id.replace('ID_', '')))
      selection[0] = canvas.getEntityById(elem.id.replace('ID_', ''))
      changeInputValues()
    }
  })
}

document.querySelectorAll('.for_entity_update').forEach(function(elem) {
  elem.onchange = function() {
    selection[0][elem.id] = elem.value = (elem.type == 'checkbox' ? elem.checked : elem.value)
    uiUpdate()
    editEntity(selection[0])
    changeInputValues()
  }
})

function editMove(e, type = 'move') {
  if (e.changedTouches != undefined) {
    e = e.changedTouches[0]
  }

  var x = e.clientX
  var y = e.clientY


  switch (type) {
    case 'move':
      selection[0].x = (x - (elem.offsetLeft - (elem.offsetWidth / 2))) - (selection[0].width / 2)
      selection[0].y = (y - (elem.offsetTop - (elem.offsetHeight / 2))) - (selection[0].height / 2)
      editEntity(selection[0])
      break;
    case 'width':
      var x = (x - (elem.offsetLeft - (elem.offsetWidth / 2)))
      var nx = (selection[0].x)
      selection[0].width = Math.abs(x - nx)
      editEntity(selection[0])
      changeInputValues()
      break;
    case 'height':
      var y = (y - (elem.offsetTop - (elem.offsetHeight / 2)))
      var ny = (selection[0].y)
      selection[0].height = Math.abs(y - ny)
      editEntity(selection[0])
      changeInputValues()
      break;
    case 'rotate':

      break;
  }

  update()
  changeInputValues()
}

function move(e) {
  if (e.changedTouches != undefined) {
    e = e.changedTouches[0]
  }
  var x = e.clientX
  var y = e.clientY

  point.data.x = (x - (elem.offsetLeft - (elem.offsetWidth / 2)))
  point.data.y = (y - (elem.offsetTop - (elem.offsetHeight / 2)))
  //document.querySelector('.ix').style.left = x - elem.offsetWidth +'px'
  update()
  changeInputValues()
  switch (activeTool) {
    case 'shapes':
      var shape = 'rect'
      if (document.getElementById('shape').value != undefined) {
        shape = document.getElementById('shape').value
      }

      if (shape == 'rect') {
        selection[0].width = Math.abs(x - elem.offsetLeft)
        selection[0].height = Math.abs(y - elem.offsetTop)
      } else if (shape == 'ellipse') {
        selection[0].width = Math.abs((x - elem.offsetLeft) / 2)
        selection[0].height = Math.abs((y - elem.offsetTop) / 2)
      } else if (shape == 'circle') {
        selection[0].width = Math.abs((x - elem.offsetLeft) / 2)
        selection[0].height = Math.abs((x - elem.offsetLeft) / 2)
      }
      break;
    case 'edit':
      /*selection[0].x = (x - (elem.offsetLeft - (elem.offsetWidth / 2))) - (selection[0].width / 2)
      selection[0].y = (y - (elem.offsetTop - (elem.offsetHeight / 2))) - (selection[0].height / 2)
      editEntity(selection[0])*/
      break;
    case 'brush':
      var width = elem.offsetLeft
      //alert(x+' '+ elem.offsetLeft+' '+(x-elem.offsetLeft))
      selection[0].path += ' L' + (x - (elem.offsetLeft - (elem.offsetWidth / 2))) + ' ' + (y - (elem.offsetTop - (elem.offsetHeight / 2)))
      break;
  }
}


function onstart(e) {
  touchstart = e
  if (e.touches != undefined) {
    touchstart = e = e.touches[0]
  }

  var x = e.clientX
  var y = e.clientY
  elem.addEventListener('touchmove', move)
  elem.addEventListener('mousemove', move)

  switch (activeTool) {
    case 'shapes':
      var shape = 'rect'
      if (document.getElementById('shape').value != undefined) {
        shape = document.getElementById('shape').value
      }

      if (shape == 'rect') {
        selection = [new entity({ type: 'roundRect', x: (x - (elem.offsetLeft - (elem.offsetWidth / 2))), y: (y - (elem.offsetTop - (elem.offsetHeight / 2))) }).data]
        uiUpdate()
      } else if (shape == 'ellipse') {
        selection = [new entity({ type: 'ellipse', arcLevel: 3, x: Math.abs((x - (elem.offsetLeft - (elem.offsetWidth / 2)))), y: Math.abs((y - (elem.offsetTop - (elem.offsetHeight / 2)))) }).data]
        uiUpdate()
      } else if (shape == 'circle') {
        selection = [new entity({ type: 'ellipse', arcLevel: 3, x: Math.abs((x - (elem.offsetLeft - (elem.offsetWidth / 2)))), y: Math.abs((y - (elem.offsetTop - (elem.offsetHeight / 2)))) }).data]
        uiUpdate()
      }
      break;
    case 'text':
      var width = 100
      selection = [new entity({ type: 'text', x: (x - (elem.offsetLeft - (elem.offsetWidth / 2))), y: (y - (elem.offsetTop - (elem.offsetHeight / 2))), width: width, height: 30, fontSize: 14, text: 'empty' }).data]
      uiUpdate()
      update()
      changeInputValues()
      editEntity(selection[0], false, true)
      break;
    case 'brush':
      selection = [new entity({
        type: 'path',
        fill: null,
        path: 'M' + (x - (elem.offsetLeft - (elem.offsetWidth / 2))) + ' ' + (y - (elem.offsetTop - (elem.offsetHeight / 2)))
      }).data]
      uiUpdate()
      update()
      break;
  }
}

function onend(e) {
  touchend = e
  if (e.changedTouches != undefined) {
    touchend = e.changedTouches[0]
  }
  elem.removeEventListener('touchmove', move)

  switch (activeTool) {
    case 'shapes':
      var shape = 'rect'

      if (shape == 'rect') {}
      editEntity(selection[0])
      break;
    case 'brush':
      editEntity(selection[0])
      break;
  }
}

elem.addEventListener('touchstart', onstart)
elem.addEventListener('mousedown', onstart)

elem.addEventListener('touchend', onend)
elem.addEventListener('mouseup', onend)

function fullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }

  window.screen.orientation.lock("landscape").then(function() {
    console.log('done');
  }).catch(function(error) {
    console.warn(error)
  });
}

document.querySelector('[data-tool="move"]').onclick = function() {
  fullScreen(document.querySelector('html'))
}

document.querySelector('[data-tool="update"]').onclick = function() {
  if (selection.length != 0) {
    editEntity(selection[0])
    uiUpdate()
    update()
  }
}

class ApiUrlData {
  constructor(url, headerKeys = [], headerValues = []) {
    this.url = url
    this.headerKeys = headerKeys
    this.headerValues = headerValues
  }
}

var apiData = [new ApiUrlData('https://d74edits-fce6.restdb.io/rest/videos', [
  'x-apikey',
  'content-type'
  ], [
    '64a3b47b86d8c5956ded8f77',
    'application/json'
    ])]


document.getElementById('apiCBtn').onclick = function() {
  var tempApi = new ApiUrlData(document.getElementById('apiUrl').value)
  inProgress('Add Headers', 5, `
  <textarea id="apiJson">{\n}</textarea>
  <br/>
  <button id="jsonSumbtor">Submit</button>
  `, true)

  if (document.getElementById('jsonSumbtor')) {
    document.getElementById('jsonSumbtor').onclick = function() {
      outProgress()
      var value = document.getElementById('apiJson').value
      var json = JSON.parse(value)
      tempApi.headerKeys = Object.keys(json)
      tempApi.headerValues = Object.values(json)
      apiData.push(tempApi)
      document.querySelector('.api-box').innerHTML += `<div class="api-proper"><span>GET</span>${tempApi.url}</div>`
    }
  }
}

var apiReqData = []

document.querySelector('[data-tool="export"]').onclick = function() {
  if (selection.length != 0) {
    editorBox.data.render = false
    widthEditorBox.data.render = false
    heightEditorBox.data.render = false
    rotaterBox.data.render = false
    point.data.render = false

    if (apiData.length != 0) {
      inProgress('Fetching Api', 10, 'Fetching all api requests. please wait')
      var progressUnit = 0
      apiData.forEach(function(data, i) {
        var xhr = new XMLHttpRequest()
        xhr.withCredentials = false;
        xhr.open('GET', data.url)
        data.headerKeys.forEach(function(key, index) {
          xhr.setRequestHeader(key, data.headerValues[index])
        })
        xhr.addEventListener('readystatechange', function() {
          if (xhr.readyState == xhr.DONE) {
            apiReqData.push(JSON.parse(xhr.response))
            progressUnit += (40 / apiData.length)
            inProgress('Exporting Image', 10 + progressUnit, 'Exporting image please wait (1500x1000). please wait')
            if (progressUnit >= 40) {
              canvas.entityStore.forEach(function(entity) {
                Object.keys(entity).forEach(function(key) {
                  var value = (typeof entity[key] == 'string' ? entity[key] : '')
                  if (value.includes('$') && value.includes('{') && value.includes('}')) {
                    apiReqData.forEach(function(api) {
                      if (api instanceof Array) {
                        api.forEach(function(apiData) {
                          var startPoint = value.indexOf('${')
                          var endPoint = value.indexOf('}')
                          var middlePoint = value.slice(0, startPoint) + value.slice(startPoint + 2, endPoint) + value.slice(endPoint + 1, value.length)
                          entity[key] = apiData[middlePoint]
                        })
                      } else {
                        var startPoint = value.indexOf('${')
                        var endPoint = value.indexOf('}')
                        var middlePoint = value.slice(0, startPoint) + value.slice(startPoint + 2, endPoint) + value.slice(endPoint + 1, value.length)
                        entity[key] = apiData[middlePoint]
                      }
                      
                      outProgress()
                    })
                  }
                })
              })

              var url = (elem.toDataURL('image/png'))
              document.getElementById('inspectImg').src = url


              editorBox.data.render = true
              point.data.render = false
              widthEditorBox.data.render = true
              heightEditorBox.data.render = true
              rotaterBox.data.render = true
            }
          }
        })
        xhr.send(null)
      })
    }

    setTimeout(function() {
      var url = (elem.toDataURL('image/png'))
      document.getElementById('inspectImg').src = url


      editorBox.data.render = true
      point.data.render = false
      widthEditorBox.data.render = true
      heightEditorBox.data.render = true
      rotaterBox.data.render = true
    }, 500)
  }
}

document.querySelector('[data-tool="trash"]').onclick = function() {
  selection[0].destroy()
  uiUpdate()
  update()
  checkSelections()
}

let graphical = {
  scale: 1,
  width: 300,
  height: 200,
  update() {
    this.width = 300 * this.scale
    this.height = 200 * this.scale
    canvas.setPixels(this.width, this.height)
  }
}

setInterval(function() {
  canvas.entityStore.forEach(function(entity) {
    entity.scale = { x: graphical.scale, y: graphical.scale }
  })
}, 100)


graphical.scale = 5
graphical.update();

canvas.specialRender();