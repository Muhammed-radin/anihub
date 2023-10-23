function Mango() {
  var canvas = {
    canvasElem: "NO_CANVAS_FOUND",
    canvasCtx: "NO_CTX_FOUND",
    store: [],
    entityStore: [],
    layerStore: [],
    activatedLayer: "NO_ACITIVE_LAYER",
    addEntity: function(entity) {
      if (canvas.store.length == 0) {
        var defaultLayer = new canvas.Layer();
        defaultLayer.add(entity);
        canvas.setLayer(defaultLayer);
        //canvas.store.push(defaultLayer)
      } else {
        canvas.activatedLayer.add(entity);
      }

      canvas.entityStore.push(entity);
    },
    setLayer: function(layer) {
      canvas.activatedLayer = layer;
      canvas.store.push(layer);
    },
    idStorage: [],
    version: 1.0,
    dev_version: "1.9.47",
    setPixels: function(w, h) {
      this.isCanvasFilled = false;
      this.canvasElem.width = w;
      this.canvasElem.height = h;
    },
    setCanvas: function(elem) {
      if (elem) {
        canvas.canvasElem = elem;
        var ctx = canvas.canvasElem.getContext("2d");
        canvas.canvasCtx = ctx;

        return {
          elem: elem,
          ctx: ctx,
          app: canvas.app.start()
        };
      }
    },
    fillScreen: function() {
      this.setPixels(window.innerWidth, window.innerHeight);
      this.isCanvasFilled = true;
      var myStyle = document.createElement("style");
      myStyle.innerHTML = `
        body {
            margin: 0;
            overflow: hidden;
        }
        ::-webkit-scrollbar {
            display: none;
        }
        `;
      document.head.appendChild(myStyle);
    },
    layerIndex: 0,
    Layer: class {
      constructor(name) {
        this.name = name == undefined ? "NAME" : name;
        canvas.layerStore.push(this);
      }
      name = "LAYER_NAME";
      entities = [];
      index = (canvas.layerIndex += 1);
      zIndex = 0;
      enabled = true;
      getWidth() {
        var width = 0;
        var wStr = "";
        var x = 0;
        var xStr = "";
        var multiCompare = "";

        this.entities.forEach(function(v) {
          wStr += v.data ? v.data.width : v.width + ",";
        });

        this.entities.forEach(function(v) {
          xStr += v.data ? v.data.x : v.x + ",";
        });

        x = eval("Math.max(" + xStr + ")");
        width = eval("Math.max(" + wStr + ")");
        multiCompare = Math.max(x, width);

        if (x == multiCompare) {
          width += x;
        }

        console.log(x, width, multiCompare, this.entities, "www");
        return width;
      }
      getHeight() {
        var height = 0;
        var hStr = "";
        var y = 0;
        var yStr = "";
        var multiCompare = "";

        this.entities.forEach(function(v) {
          hStr += v.data ? v.data.height : v.height + ",";
        });

        this.entities.forEach(function(v) {
          yStr += v.data ? v.data.y : v.y + ",";
        });

        y = eval("Math.max(" + yStr + ")");
        height = eval("Math.max(" + hStr + ")");
        multiCompare = Math.max(y, height);

        if (y == multiCompare) {
          height += y;
        }

        console.log(y, height, multiCompare, "hhh");
        return height;
      }
      enable() {
        this.enabled = true;
        var ent = this.entities;
        var enabled = this.enabled;
        ent.forEach(function(value, index) {
          value.data ? (value.data.render = enabled) : (value.render = enabled);
        });
      }
      disable() {
        this.enabled = false;
        var ent = this.entities;
        var enabled = this.enabled;
        ent.forEach(function(value, index) {
          value.data ? (value.data.render = enabled) : (value.render = enabled);
        });
      }
      length = this.entities.length;
      id = canvas.id();
      add(...items) {
        var ent = this.entities;
        items.forEach(function(value, index) {
          ent.push(value);
        });
      }
      destroy() {
        this.entities.forEach((v) => (v.data ? v.data.destroy() : v.destroy()));
        Object.keys(this).forEach((v) => {
          delete this[v];
        });
      }
    },
    getEntityByName(name) {
      var ent = null;
      canvas.entityStore.forEach(function(entity) {
        if (name == entity.name) {
          ent = entity;
        }
      });
      return ent;
    },
    getEntityById(id) {
      var ent = null;
      canvas.entityStore.forEach(function(entity) {
        if (id == entity.id) {
          ent = entity;
        }
      });
      return ent;
    },
    loopers: [],
    looper_property: {
      class_mode: false,
      isRunning: false,
    },
    addLoop(looper = canvas.Looper || Function) {
      this.loopers.push(looper);
    },
    start_loop() {
      this.looper_property.isRunning = true;
    },
    end_loop() {
      this.looper_property.isRunning = false;
    },
    endLoop: this.end_loop,
    startLoop: this.start_loop,
    Looper: class Looper {
      script = function() {};
      enabled = true;
    },
    render: function() {
      var ctx = canvas.canvasCtx;

      this.store.forEach(function(layer, layerIndex) {
        if (layer.entities) {
          layer.entities.sort(function(a, b) {
            return a.z - b.z;
          });

          layer.entities.forEach(function(data, dataIndex) {
            ctx.beginPath();
            data.onupdated();
            if (data._inited == undefined) {
              data.oninit();
            }
            data._inited = true;

            if (data.render == true) {
              if (data.afterScript == true) {
                typeof data.script == "string" ?
                  eval(data.script) :
                  data.script();
              }

              switch (data.type) {
                case "rect":
                  ctx.save();
                  ctx.transform(
                    data.scale.x,
                    data.skew.x,
                    data.skew.y,
                    data.scale.y,
                    data.translate.x,
                    data.translate.y
                  );
                  /*ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );*/
                  //ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  ctx.rect(data.x, data.y, data.width, data.height);
                  ctx.stroke();
                  ctx.fill();
                  data.afterClip ? ctx.clip() : null;
                  ctx.restore();
                  break;
                case "circle":
                  ctx.save();
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.strokeStyle = data.stroke;
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  ctx.arc(
                    data.x,
                    data.y,
                    data.radius,
                    0,
                    Math.PI * data.arcLevel
                  );
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "ellipse":
                  ctx.save();
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  // ctx.rotate(data.rotate);
                  ctx.strokeStyle = data.stroke;
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  ctx.ellipse(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    data.rotate,
                    0,
                    Math.PI * data.arcLevel
                  );
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "text":
                  ctx.save();
                  ctx.font = data.fontSize + "px " + data.font;
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.strokeStyle = data.stroke;
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.textBaseline = data.textBaseline;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  if (data.splitLine == false) {
                    ctx.fillText(data.text, data.x, data.y, data.textMax);
                  } else {
                    var splitedLines = data.text.split("\n");
                    splitedLines.forEach(function(line, lineIndex) {
                      var index = lineIndex + 1;
                      ctx.fillText(
                        line,
                        data.x,
                        data.y +
                        (data.fontSize + data.addExtraTextPixels) * index,
                        data.textMax
                      );
                    });
                  }

                  if (data.width == null) {
                    data.setProperty("width", data.getWidth());
                  }

                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "image":
                  if (data.img.src == data.imageURL || data.mergeimageURL == false) {} else {
                    data.img.src = data.imageURL;
                  }

                  var img = data.img;

                  ctx.save();
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.strokeStyle = data.stroke;
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  data.imageSizeAuto == true ?
                    ctx.drawImage(
                      img,
                      data.x,
                      data.y,
                      data.width,
                      data.height
                    ) :
                    ctx.drawImage(
                      img,
                      data.x,
                      data.y,
                      data.width,
                      data.height,
                      data.dx,
                      data.dy,
                      data.dWidth,
                      data.dHeight
                    );
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();

                  break;
                case "line":
                  ctx.save();
                  // ctx.transform(1,0,0,1,data.translate.x,data.translate.y)
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  ctx.moveTo(data.x, data.y);
                  ctx.lineTo(data.width, data.height);
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "quadraticLine":
                  ctx.save();
                  // ctx.transform(1,0,0,1,data.translate.x,data.translate.y)
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  ctx.moveTo(data.x, data.y);
                  ctx.quadraticCurveTo(
                    data.dx,
                    data.dy,
                    data.width,
                    data.height
                  );
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "bezierLine":
                  ctx.save();
                  // ctx.transform(1,0,0,1,data.translate.x,data.translate.y)
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  ctx.shadowOffsetY = data.shadowY;
                  // data.afterClip ? ctx.clip() : null;
                  ctx.moveTo(data.x, data.y);
                  ctx.bezierCurveTo(
                    data.dx,
                    data.dy,
                    data.bx,
                    data.by,
                    data.width,
                    data.height
                  );
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "roundRect":
                  ctx.save();
                  // ctx.transform(1,0,0,1,data.translate.x,data.translate.y)
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  ctx.shadowOffsetY = data.shadowY;
                  //data.afterClip ? ctx.clip() : null;
                  ctx.roundRect(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    Math.PI * data.arcLevel
                  );
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "clear":
                  ctx.save();
                  // ctx.transform(1,0,0,1,data.translate.x,data.translate.y)
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  ctx.shadowOffsetY = data.shadowY;
                  // data.afterClip ? ctx.clip() : null;
                  ctx.clearRect(data.x, data.y, data.width, data.height);
                  ctx.stroke();
                  ctx.fill();
                  ctx.restore();
                  break;
                case "path":
                  ctx.save();
                  // ctx.transform(1,0,0,1,data.translate.x,data.translate.y)
                  ctx.translate(
                    data.translate.x + data.physics.vx,
                    data.translate.y + data.physics.vy
                  );
                  ctx.scale(data.scale.x, data.scale.y);
                  ctx.rotate(data.rotate);
                  ctx.fillStyle = data.fill ? data.fill : "transparent";
                  ctx.strokeStyle = data.stroke;
                  ctx.lineWidth = data.strokeWidth;
                  ctx.shadowBlur = data.shadow;
                  ctx.shadowColor = data.shadowColor;
                  ctx.shadowOffsetX = data.shadowX;
                  ctx.shadowOffsetY = data.shadowY;
                  ctx.globalAlpha = data.opacity;
                  ctx.filter = data.filter;
                  ctx.setLineDash(data.dashedLineSegments);
                  // data.afterClip ? ctx.clip() : null;
                  ctx.stroke(
                    typeof data.path == "string" ?
                    new Path2D(data.path) :
                    data.path
                  );
                  ctx.fill(
                    typeof data.path == "string" ?
                    new Path2D(data.path) :
                    data.path
                  );
                  ctx.restore();
                  break;
              }

              if (data.afterScript == false) {
                eval(data.script);
              }
            }
          });
        }
      });
    },
    getCanvasTranslateXY(element) {
      var style = window.getComputedStyle(element);
      var matrix = new WebKitCSSMatrix(style.transform);

      return {
        x: matrix.e,
        y: matrix.f,
      };
    },
    entity: function(data, addOn = true) {
      var tempData = new canvas._newDataModule();
      var dataKey = Object.keys(data);
      var dataValues = Object.values(data);

      dataKey.forEach(function(v, i) {
        tempData[v] = dataValues[i];
      });

      if (addOn) {
        canvas.addEntity(tempData);
      }
      this.data = tempData;
    },
    id: function() {
      var id = Math.floor(Math.random() * 99999999);
      canvas.idStorage.push(id);
      return id;
    },
    _newDataModule: function() {
      this.x = 0;
      this.y = 0;
      this.width = this.type == "text" ? null : 0;
      this.height = 0;
      this.fill = "#000";
      this.textBaseline = "top";
      this.dashedLineSegments = [];
      this.stroke = "#00000050";
      this.type = "rect";
      this.textMax = 100000;
      this.strokeWidth = 0;
      this.textAlign = "left" | "center" | "right";
      this.bx = 0;
      this.by = 0;
      this.splitLine = false;
      this.path = "";
      this.img = new Image();
      this.number = canvas.app.indexEntity++;
      this.z = this.number;
      this.id = canvas.id();
      this.render = true;
      this.imageURL = "NOT_FOUND_IMAGE_URL";
      this.radius = 0;
      this.arcLevel = 3;
      this.saveContext = true;
      this.restoreContext = true;
      this.shadowColor = "#000";
      this.shadowX = 0;
      this.shadowY = 0;
      this.opacity = 1;
      this.filter = "";
      this.textWidths = [];
      this.mergeimageURL = true;
      this.setProperty = function(key, value) {
        this[key] = value;
      };
      this.addExtraTextPixels = 5;
      this.getWidth = function() {
        var self = this;
        if (self.type == "image") {
          return self.dWidth;
        } else if (self.type == "circle") {
          return self.radius * 2;
        } else if (self.type == "text") {
          var canva = new OffscreenCanvas(100, 100);
          var ctux = canva.getContext("2d");

          ctux.font = self.fontSize + "px " + self.font;
          var mT = ctux.measureText(self.text);
          if (self.text.includes("\n")) {
            var splitedLines = self.text.split("\n");
            var widths = [];
            splitedLines.forEach(function(txt) {
              widths.push(ctux.measureText(txt));
            });
            mT.width = Math.max.apply(widths);
            self.setProperty("textWidths", widths);
          }

          return mT.width + self.addExtraTextPixels;
        } else {
          return self.width;
        }
      };
      this.getHeight = function() {
        var self = this;
        if (self.type == "image") {
          return self.dHeight;
        } else if (self.type == "circle") {
          return self.radius * 2;
        } else if (self.type == "text") {
          return self.fontSize + self.addExtraTextPixels;
        } else {
          return self.height;
        }
      };
      this.onupdated = function() {};
      this.update = this.onupdated;
      this.oninit = function() {};
      this.init = this.oninit;
      this.script = "";
      this.afterScript = false;
      this.afterClip = false;
      this.text = "TEXT_IS_EMPTY";
      this.translate = {
        x: 0,
        y: 0,
      };
      this.scale = {
        x: 1,
        y: 1,
      };
      this.skew = {
        x: 0,
        y: 0,
      };
      this.rotate = 0;
      this.fontSize = 25;
      this.font = "sans-serif";
      this.dx = 0;
      this.dy = 0;
      this.dWidth = 100;
      this.dHeight = 100;
      this.layer = canvas.activatedLayer;
      this.name = "NOT_NAME_SETTELD";
      this.destroy = function() {
        var ent = null;
        var self = this;
        canvas.store.forEach(function(layer, lI) {
          if (self.layer.id == layer.id) {
            layer.entities.forEach(function(entity, eI) {
              if (self.id == entity.id) {
                ent = entity;
                layer.entities.splice(eI, 1);

                Object.keys(self).forEach(function(v, i) {
                  delete self[v];
                });
              }
            });
          }
        });
        //canvas.store.splice(this.number, 1);
        canvas.idStorage.splice(this.number, 1);
      };
      this.shadow = 0;
      this.physics = {
        type: "dynamic",
        enabled: false,
        weight: 0,
        damping: 0,
        toWeight: false,
        sponging: false,
        vx: 0,
        vy: 0,
      };
      this.tags = [];
      this.imageSizeAuto = false;
      this.on = function(type, callback) {
        var elem = canvas.canvasElem;
        var element = {
          top: this.y,
          left: this.x,
          height: this.height,
          width: this.width,
        };

        setInterval(() => {
          element = {
            top: this.y,
            left: this.x,
            height: this.height,
            width: this.width,
          };
        });

        var self = this;

        canvas.canvasElem.addEventListener(type, function(e) {
          var martix = canvas.getCanvasTranslateXY(elem);
          martix.x = Math.abs(martix.x);
          martix.y = Math.abs(martix.y);
          var y = e.clientY;
          var x = e.clientX;

          x = x - (elem.offsetLeft - martix.x);
          y = y - (elem.offsetTop - martix.y);

          switch (type) {
            case "mousemove":
            case "mousedown":
            case "mouseup":
            case "click":
              if (
                y > element.top &&
                y < element.top + element.height &&
                x > element.left &&
                x < element.left + element.width
              ) {
                callback(e);
              }
              break;
            case "touchmove":
            case "touchend":
              var e1 = e;
              e = e.changedTouches[0];
              var y = e.clientY;
              var x = e.clientX;
              x = x - (elem.offsetLeft - martix.x);
              y = y - (elem.offsetTop - martix.y);
              if (
                y > element.top &&
                y < element.top + element.height &&
                x > element.left &&
                x < element.left + element.width
              ) {
                callback(e1);
              }
              break;
            case "touchstart":
              var e1 = e;
              e = e.touches[0];
              var y = e.clientY;
              var x = e.clientX;
              x = x - (elem.offsetLeft - martix.x);
              y = y - (elem.offsetTop - martix.y);

              if (
                y > element.top &&
                y < element.top + element.height &&
                x > element.left &&
                x < element.left + element.width
              ) {
                callback(e);
              }
              break;
          }
        });
      };
      this.off = function(type, callback) {
        var element = {
          top: this.y,
          left: this.x,
          height: this.height,
          width: this.width,
        };

        setInterval(() => {
          element = {
            top: this.y,
            left: this.x,
            height: this.height,
            width: this.width,
          };
        });

        canvas.canvasElem.removeEventListener(type, function(e) {
          var martix = canvas.getCanvasTranslateXY(elem);
          martix.x = Math.abs(martix.x);
          martix.y = Math.abs(martix.y);
          var y = e.clientY;
          var x = e.clientX;
          x = x - (elem.offsetLeft - martix.x);
          y = y - (elem.offsetTop - martix.y);

          switch (type) {
            case "mousemove":
            case "mousedown":
            case "mouseup":
            case "click":
              if (
                y > element.top &&
                y < element.top + element.height &&
                x > element.left &&
                x < element.left + element.width
              ) {
                callback(e);
              }
              break;
            case "touchmove":
            case "touchend":
              var e1 = e;
              e = e.changedTouches[0];
              var y = e.clientY;
              var x = e.clientX;
              x = x - (elem.offsetLeft - martix.x);
              y = y - (elem.offsetTop - martix.y);
              if (
                y > element.top &&
                y < element.top + element.height &&
                x > element.left &&
                x < element.left + element.width
              ) {
                callback(e1);
              }
              break;
            case "touchstart":
              var e1 = e;
              e = e.touches[0];
              var y = e.clientY;
              var x = e.clientX;
              x = x - (elem.offsetLeft - martix.x);
              y = y - (elem.offsetTop - martix.y);

              if (
                y > element.top &&
                y < element.top + element.height &&
                x > element.left &&
                x < element.left + element.width
              ) {
                callback(e1);
              }
              break;
          }
        });
      };
    },
    isCanvasFilled: false,
    clear: function() {
      canvas.canvasCtx.clearRect(
        0,
        0,
        canvas.canvasElem.width,
        canvas.canvasElem.height
      );
    },
    app: {
      start() {
        this.Entity = canvas.entity
        this.Layer = canvas.Layer
        this.EntityGroup = canvas.entityGroup
        this.HEXColor = this.Color
        return this;
      },
      RGBColor: class RGBColor {
        constructor(r, g, b, a = false) {
          this.r = r;
          this.g = g;
          this.b = b;
          this.a = a;
          this.color = 'rgb(' + r + "," + g + "," + b + "," + a + ')';
        }
        update() {
          this.color = 'rgb(' + this.r + "," + this.g + "," + this.b + "," + this.a + ')';
        }
        toHex() {
          return canvas.app.rgbToHex(this.r, this.g, this.b) + (a == false ? '' : 10 * this.a)
        }
      },
      Color: class Color {
        constructor(hex) {
          this.hex = hex
        }
        toRGB() {
          return canvas.app.hexToRgb(this.hex)
        }
      },
      count(from, to, callback, howMany, speed) {
        var plusValue = from;
        var countValue = 1;
        var countSpeed = 100;

        if (speed === undefined) {
          countSpeed = 100;
        } else {
          countSpeed = speed;
        }

        var timer = setInterval(function() {
          callback(plusValue);

          if (howMany === undefined) {
            countValue = 1;
          } else {
            countValue = howMany;
          }

          plusValue += countValue;
          if (plusValue == to || plusValue > to) {
            clearInterval(timer);
          }
          if (plusValue === to || plusValue > to) {
            clearInterval(timer);
          }
        }, countSpeed);
        return plusValue;
      },
      rgbToHex(r, g, b) {
        function componentToHex(c) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
        }

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      },

      hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
      },
      entityToImg(entity) {
        entity = entity.data ? entity.data : entity;
        entity.cropWidth ?
          "" :
          console.warn(
            "please add cropWidth and cropHeight in your entity properties"
          );
        var demo = document.createElement("canvas");
        document.body.appendChild(demo);
        var onfalse = entity.render;
        entity.render = true;
        demo.width = entity.cropWidth;
        demo.height = entity.cropHeight;
        var renderManager = Mango();
        renderManager.setCanvas(demo);

        renderManager.addEntity(entity);
        var rt = "";
        for (i = 0; i < 50; i++) {
          renderManager.render();
          rt = demo.toDataURL("image/png");
          if (i == 10) {
            demo.style.display = "none";
            demo.remove();
            onfalse ? "" : (entity.render = false);
            return rt;
          }
        }
      },
      colorsFromImg(url) {
        var demo = document.createElement("canvas");
        var img = new Image();
        img.src = url;
        var loaded = false;
        var rt = {};
        img.onload = function() {
          rt = {
            colors: [],
            inRGB: [],
            img: img,
          };
          var ctx = demo.getContext("2d");
          demo.width = img.width;
          demo.height = img.height;
          ctx.beginPath();
          ctx.drawImage(img, 0, 0, img.width, img.height);
          ctx.fill();

          var rtq = false;

          var data = ctx.getImageData(0, 0, demo.width, demo.height).data;
          rt.colors = data;
          for (var i = 0; i < data.length; i += 0) {
            rt.inRGB.push(
              "rgba(" +
              data[i] +
              ", " +
              data[i + 1] +
              ", " +
              data[i + 2] +
              ", " +
              data[i + 3] +
              ")"
            );
            i += 4;
          }

          loaded = true;
        };

        var pro = new Promise(function(resolve) {
          var timer = setInterval(function() {
            if (loaded == true) {
              resolve(rt);
              clearInterval(timer);
            }
          });
        });

        return pro;
      },
      createGradient(x1, y1, x2, y2, colorStop) {
        var rt = {
          x1,
          x2,
          y1,
          y2,
          colorStop,
          type: "linear",
          gradient: null,
          imageURL: null,
          linearImage: null,
          imageColors: null,
        };
        ////
        var grad = canvas.canvasCtx.createLinearGradient(x1, y1, x2, y2);
        var invertNum = 0;
        var codeStop = 'grad.addColorStop(PN, "CL")';
        var runStop = "";
        colorStop.forEach(function(color) {
          invertNum += 1;
          if (invertNum == 1) {
            runStop = codeStop.replace("PN", color);
          } else if (invertNum == 2) {
            runStop = runStop.replace("CL", color);
            eval(runStop);
            runStop = "";
            invertNum = 0;
          }
        });
        rt.gradient = grad;
        rt.imageURL = canvas.app.entityToImg(
          new canvas.entity(
            {
              fill: rt.gradient,
              width: x2,
              height: y2,
              cropWidth: x2,
              cropHeight: y2,
              render: false,
            },
            false
          )
        );
        rt.linearImage = canvas.app.entityToImg(
          new canvas.entity(
            {
              fill: rt.gradient,
              width: x2,
              height: 1,
              cropWidth: x2,
              cropHeight: 1,
              render: false,
            },
            false
          )
        );
        rt.imageColors = canvas.app.colorsFromImg(rt.linearImage);
        return rt;
      },
      keyboard: {
        value: false,
        press: function(key) {
          var keyboardEVT = new KeyboardEvent("keypress", {
            bubbles: true,
            keyCode: key,
            charCode: key,
          });

          // dispatchEvent(keyboardEVT)
          window.onkeyup = function(e) {
            console.log(keyboardEVT);
            keyboard.value = false;
          };

          return keyboard.value;
        },
      },
      indexEntity: 0,
      css(string) {
        var style = document.createElement("style");
        style.innerHTML = string;
        document.head.appendChild(style);
      },

      /////////////////////////////////////////////////
      // testing code [ disabled ]                   //
      /*
      globalPhysics: {
        gravity: 4,
        fog: 0,
      },
      addPhysics: function(entity, kg) {
        var baitValue = kg * canvas.app.globalPhysics.gravity;
        var kilogram = baitValue / 5;
        console.log(kilogram);

        if (entity.physics) {
          physics(entity);
        } else if (entity.data.physics) {
          physics(entity.data);
        }

        function physics(entity1) {
          canvas.app.count(
            0,
            100,
            function(y) {
              entity1.physics.vy = y;
            },
            1,
            kilogram
          );
        }
      },
      */
      //////////////////////////////////////////////////////

      HTML: {
        input: function(type, x, y) {
          var inp = document.createElement("input");
          inp.type = type;
          if (x != undefined) {
            inp.style.position = "fixed";
            inp.style.left = x + "px";
          }
          if (y != undefined) {
            inp.style.position = "fixed";
            inp.style.top = y + "px";
          }
          document.body.appendChild(inp);

          return inp;
        },
      },
      update: function() {},
      onupdate: function() {},
      Vec2: function(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      },
      randomNumberOnly: function(start, to) {
        var array = [];
        for (
          i = start; start < to ? i <= to : i >= to; start < to ? i++ : i--
        ) {
          array.push(start < to ? i : -i);
        }

        return array[Math.floor(Math.random() * array.length)];
      },
      randomColor: function(light) {
        if (light == undefined || light === undefined || light == null) {
          var colorCode = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
          ];
          var colorCodeGen =
            "#" +
            colorCode[Math.floor(Math.random() * colorCode.length)] +
            colorCode[Math.floor(Math.random() * colorCode.length)] +
            colorCode[Math.floor(Math.random() * colorCode.length)] +
            colorCode[Math.floor(Math.random() * colorCode.length)] +
            colorCode[Math.floor(Math.random() * colorCode.length)] +
            colorCode[Math.floor(Math.random() * colorCode.length)];
          return colorCodeGen;
        } else {
          if (light instanceof Boolean || typeof light == "boolean") {
            if (light == true) {
              var colorCode = ["a", "b", "c", "d", "e", "f"];
              var colorCodeGen =
                "#" +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)];
              return colorCodeGen;
            } else {
              var colorCode = [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                0,
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
              ];
              var colorCodeGen =
                "#" +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)] +
                colorCode[Math.floor(Math.random() * colorCode.length)];
              return colorCodeGen;
            }
          } else {
            console.log("%c please write Boolean code", "color: red");
          }
        }
      },
    },
    repeatRender: function() {
      window.requestAnimationFrame(function(dt) {
        canvas.clear();
        canvas.render();
        if (canvas.app.update instanceof Function) {
          canvas.app.update();
        } else {
          console.warn("set function in update");
        }
        canvas.repeatRender();
      });
    },
    debug_mode: true,
    _specialRender_timer: 0,
    global: {
      time: 0,
      timeStep: 0,
      nowTime: 0,
      lastTime: 0,
      gravityPoint: [screen.availWidth / 2, 230],
      dt: 0,
      maxTimeSpeed: 1,
    },
    specialRender() {
      var global = this.global;
      window.requestAnimationFrame(function() {
        //var render = function() {
        if (canvas.app.update instanceof Function) {
          canvas.app.update();
        } else {
          console.warn("set function in update");
        }

        canvas.clear();
        canvas.render();

        if (canvas.looper_property.isRunning == true) {
          canvas.loopers.forEach((looper) => {
            if (
              canvas.looper_property.class_mode == true &&
              looper.enabled == true
            ) {
              looper.script();
            } else {
              looper();
            }
          });
        }

        if (canvas.app.onupdate instanceof Function) {
          canvas.app.onupdate();
        } else {
          console.warn("set function in onupdate");
        }
        //}
        global.time += 1;
        global.nowTime = Date.now();
        global.dt = global.lastTime ?
          (global.nowTime - global.lastTime) / 1000 :
          0;
        global.lastTime = global.nowTime;
        canvas.specialRender();
      });
    },
    entityGroup: class EntityGroup {
      constructor(name) {
        name == undefined ? null : (this.name = name);
      }
      type = "eGroup";
      name = null;
      entities = [];
      add(entity) {
        this.entities.push(entity);
      }
    },
  };

  return canvas;
}

///////////////////////////////////////////////////////////////////////////////////////////
//                                      Pixel Prefect                                   //
//////////////////////////////////////////////////////////////////////////////////////////

/*

function $(q) {
  return document.querySelector(q)
}

var c = $("#c");
var ctx = c.getContext('2d')


var x = 0,
  y = 0,
  width = 40,
  height = 40,
  timeStamp = 0;

var cleanPath = []
var blackBox = []
var cleanPoint = []
var blackTeams = []
var state = 'first'


var dt = new Date()
//window.addEventListener('touchmove', (e) => {
var timer = setInterval(() => {
  //e = e.changedTouches[0]
  if (state == 'first') {
    x += 1;
    timeStamp += 1

    if (x == width) {
      x = 0
      y += 1;
    }

    if (y >= height) {
      state = 'second'
      x = width
    }
  } else if (state == 'second') {
    x -= 1;
    timeStamp += 1

    if (x == 0) {
      x = width
      y -= 1;
    }

    //console.log(x, state, y);

    if (y == 0) {
      state = 'third'
      x = 0
      y = height
    }
  } else if (state == 'third') {
    y -= 1;
    timeStamp += 1

    if (y == 0) {
      y = height
      x += 1;
    }

    if (x >= width) {
      state = 'final'
      y = 0
      x = 0
    }
  } else if (state == 'final') {
    y += 1;
    timeStamp += 1

    if (y == height) {
      y = 0
      x += 1;
    }

    if (x == width) {
      state = false
      c.addEventListener('touchmove', function(e) {
        var e = e.changedTouches[0]
        conCode = ''
        var cgX = e.clientX,
          cgY = e.clientY;
        var floor = Math.floor
        cleanPath.forEach(function(v, i) {
          //var flo = `${floor(v.x)} ${cleanPoint[i]} ${floor(cgX)} && ${floor(v.y)} ${cleanPoint[i]} ${floor(cgY)} ${(cleanPath.length - 1) == i ? '' : '&&'} `
          //conCode += flo;
          // conTr.push(hoi)
          console.log(conCode += cgX.toString()[0] +' '+ v.x.toString()[0], cgX.toString()[0] == v.x.toString()[0]);
        })
        eval('condition = ' + conCode)
        lgo([conCode, condition]);
        if (condition) {
          console.log('4')
        }
        ctx.fillRect(cgX, cgY, 2, 2)
      })
      clearInterval(timer)
    }
  }

  color = '#555'

  var isBlackBox = false
  $("p").innerHTML = state + ' state / timeStamp ' + timeStamp + ' / startTime ' + dt + '\n\t' + 'x: ' + x + ' y:' + y
  //$("#prg").value = timeStamp / 1000
  //$("span").innerHTML = '\t' + timeStamp / 1000 + '%'

  var im = ctx.getImageData(x, y, 1, 1)
  // console.log(im.data[0], im.data[1], im.data[2], im);

  if (im.data[3] == 0 && im.data[2] == 0 && im.data[1] == 0 && im.data[0] == 0) {
    blackBox.push(x, y)
    //console.log(im.data);
    //if (state == 'final') {
    //  ctx.fillStyle = color
    //  ctx.beginPath()
    //  ctx.fillRect(x - 1, y - 1, 1, 1)
    //}
    isBlackBox = true;
    blackTeams.push(isBlackBox)
  } else {
    blackTeams.push(isBlackBox)
    if (blackTeams[timeStamp - 2] == true) {
      //console.log('clean_pathers');
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.fillRect(x + 100, y, 1, 1)
      cleanPath.push({ x: x, y: y })
      ctx.closePath()

      if (state == 'first' || state == 'final') {
        cleanPoint.push('<')
      } else if (state == 'second' || state == 'third') {
        cleanPoint.push('>')
      }
    }
    //console.log(blackTeams[timeStamp - 1]);
  }


  //document.body.style.background = 'rgba(' + im.data[0] + ',' + im.data[1] + ',' + im.data[2] + ',' + im.data[3] + ')'
})

function lgo(msg) {
  $(".div").innerHTML = JSON.stringify(msg)
}

ctx.beginPath()
ctx.drawImage($("img"), 0, 0, width, height)

*/

///////////////////////////////////////////////////////////////////////////////////////////
//                                      Text Editor                                      //
///////////////////////////////////////////////////////////////////////////////////////////

// const textEditor = {
//     editorElem: 'EDITOR_NOT_SETTED',
//     value: '',
//     getIndicesOf: function (searchStr, str, caseSensitive) {
//         var searchStrLen = searchStr.length;
//         if (searchStrLen == 0) {
//             return [];
//         }
//         var startIndex = 0, index, indices = [];
//         if (!caseSensitive) {
//             str = str.toLowerCase();
//             searchStr = searchStr.toLowerCase();
//         }
//         while ((index = str.indexOf(searchStr, startIndex)) > -1) {
//             indices.push(index);
//             startIndex = index + searchStrLen;
//         }
//         return indices;
//     },
//     setEditor: function (elem) {
//         this.editorElem = elem;
//         this.value = this.editorElem.innerText;

//     },
//     highLightValue: function () {

//         this.editorElem.className = ' my-editor'

//         var varHighLight = textEditor.editorElem.innerHTML.replaceAll('var', '<var>var</var>');
//         textEditor.editorElem.innerHTML = varHighLight;

//         var asignSymbol = textEditor.editorElem.innerHTML.replaceAll('=', '<red>=</red>');
//         textEditor.editorElem.innerHTML = asignSymbol;

//         var leftBraseHighLight = textEditor.editorElem.innerHTML.replaceAll('{', '<blue>{</blue>');
//         textEditor.editorElem.innerHTML = leftBraseHighLight;

//         var requireValues = ['}', '(', ';', ')', 'function', '+', '-', '%', '*', '?', '&&', 'this', '.']
//         var replaceValues = ['blue', 'pink', 'blue', 'pink', 'blue_i', 'blue', 'blue', 'blue', 'blue', 'red', 'pink', 'blue_i', 'red']
//         requireValues.forEach(function (values, index) {
//             textEditor.editorElem.innerHTML = textEditor.editorElem.innerHTML.replaceAll(values, '<' + replaceValues[index] + '>' + values + '</' + replaceValues[index] + '>');
//         })

//         var orginalEditor = document.createElement('textarea')
//         orginalEditor.id = 'orgEditor';
//         orginalEditor.value = this.value
//         orginalEditor.onclick = function () {
//             textEditor.value = orginalEditor.value;
//             textEditor.innerHTML = textEditor.value;
//             textEditor.highLightValue()
//             console.log(9);
//         }

//         var getNowValue = textEditor.editorElem.innerHTML;
//         textEditor.editorElem.innerHTML = `<pre><code class='code'>${getNowValue}</code></pre>`;
//         this.editorElem.appendChild(orginalEditor)

//         var myCodeStyle = document.createElement('style')
//         myCodeStyle.innerHTML = `
//         var {
//             color: red
//         }

//         red {
//             color: red
//         }

//         .my-editor {
//             font-family: monospace;
//             background: #eee;
//             padding: 0.5rem;
//         }

//         pink {
//             color: #ff22c8;
//         }

//         pre {
//             margin: 0
//         }

//         blue {
//             color: blue;
//         }

//         blue_i {
//             color: blue;
//             font-style: italic;
//         }

//         #orgEditor {
//             opacity: 20%;
//             min-width: 50px;
//             min-height: 50px;
//             width: ${document.querySelector('.code').offsetWidth}px;
//             height: ${document.querySelector('.code').offsetHeight}px;
//             position: absolute;
//             top: ${document.querySelector('.code').offsetTop}px;
//             left: ${document.querySelector('.code').offsetLeft}px;
//             border: none;
//             outline: none;
//             resize: none;
//         }
//         `
//         document.head.appendChild(myCodeStyle)
//     },
//     resetValue: function () {
//         if (document.getElementById('orgEditor')) {
//             document.getElementById('orgEditor').remove()
//         }
//         this.editorElem.innerHTML = this.value;
//     }

// }