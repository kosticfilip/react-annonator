import React, { Component } from 'react';

function Button(_ref) {
  var toggleInit = _ref.toggleInit,
      type = _ref.type,
      activeType = _ref.activeType,
      buttonClass = _ref.buttonClass;

  var btnClass = buttonClass || "__ra-button";
  if (type === activeType) {
    btnClass += " active";
  }
  return React.createElement(
    "button",
    { className: btnClass, onClick: function onClick() {
        return toggleInit(type);
      } },
    type
  );
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var options = {
  types: {
    dot: true,
    rectangle: true,
    elipse: true
  }
};

var RannonatorContext = React.createContext({
  init: false,
  toggleInit: function toggleInit() {}
});

var Annonation = function Annonation(_ref) {
  var data = _ref.data,
      type = _ref.type;

  if (type == "dot") {
    var endX = data.endX,
        endY = data.endY;

    return React.createElement("div", {
      className: "preview",
      style: {
        left: endX + "%",
        top: endY + "%",
        transform: "translate(-10px, -10px)",
        width: "20px",
        height: "20px",
        borderRadius: "50%"
      }
    });
  } else {
    var startX = data.startX,
        startY = data.startY,
        _endX = data.endX,
        _endY = data.endY,
        ratio = data.ratio;

    var left = startX - _endX >= 0 ? _endX + "%" : startX + "%";
    var top = startY - _endY >= 0 ? _endY + "%" : startY + "%";
    var width = Math.abs(_endX - startX) + "%";
    var height = Math.abs(_endY - startY) + "%";
    switch (type) {
      case "rectangle":
        return React.createElement("div", {
          className: "preview",
          style: {
            left: left,
            top: top,
            width: width,
            height: height
          }
        });
      case "elipse":
        return React.createElement("div", {
          className: "preview",
          style: {
            left: left,
            top: top,
            width: width,
            height: height,
            borderRadius: "50%"
          }
        });
      default:
        return null;
    }
  }
};

var Canvas = function (_React$Component) {
  inherits(Canvas, _React$Component);

  function Canvas(props) {
    classCallCheck(this, Canvas);

    var _this = possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, props));

    _this.initDrawing = function (e, init) {
      if (!init) {
        return;
      }
      e.persist();
      console.log("Init Active ----------------");
      // Prevent defualt drag behaivor when drawing(dragging)
      _this.myRef.current.ondragstart = function (e) {
        return e.preventDefault();
      };

      // Find width and height of canvas
      var width = _this.myRef.current.getBoundingClientRect().width,
          height = _this.myRef.current.getBoundingClientRect().height,

      // Calculate postion in % for CSS Absolute Position
      startX = e.nativeEvent.offsetX / width * 100,
          startY = e.nativeEvent.offsetY / height * 100;

      _this.setState({
        width: width,
        height: height,
        startX: startX,
        startY: startY,
        endX: startX,
        endY: startY,
        isDrawing: true
      });
    };

    _this.drawing = function (e) {
      if (!_this.state.isDrawing) {
        return;
      }

      // Set Current Position of Cursor, relative to the canvas size
      var endX = void 0,
          ratio = false,
          endY = e.nativeEvent.offsetY / _this.state.height * 100;

      if (e.shiftKey) {
        endX = endY;
        ratio = _this.state.width / _this.state.height;
      } else {
        endX = e.nativeEvent.offsetX / _this.state.width * 100;
      }

      console.log("Drawing Active ----------------");
      _this.setState({
        ratio: ratio,
        endX: endX,
        endY: endY
      });
    };

    _this.endDrawing = function (finishDrawing) {
      if (!_this.state.isDrawing) {
        return;
      }
      console.log("endDrawing Active ----------------");

      var res = {
        startX: _this.state.startX,
        startY: _this.state.startY,
        endX: _this.state.endX,
        endY: _this.state.endY
      };

      finishDrawing(res);
      _this.setState({
        isDrawing: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      });
    };

    _this.myRef = React.createRef();
    _this.state = {
      isDrawing: false,
      ratio: false,
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    };
    return _this;
  }

  createClass(Canvas, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      //const { startX, startY, endX, endY } = this.state;
      //console.log(`x: ${startX} -- y: ${startY} ||| x: ${endX} -- y: ${endY}`);

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          RannonatorContext.Consumer,
          null,
          function (value) {
            return React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "canvas-container" },
                _this2.props.children,
                _this2.state.isDrawing ? React.createElement(Annonation, {
                  data: _this2.state,
                  type: value.activeType,
                  isDrawing: _this2.state.isDrawing
                }) : null,
                React.createElement("div", {
                  className: "drawing-area",
                  ref: _this2.myRef,
                  style: !value.init ? { zIndex: "-1" } : { zIndex: "9999" },
                  onMouseDown: function onMouseDown(e) {
                    return _this2.initDrawing(e, value.init);
                  },
                  onMouseMove: _this2.drawing,
                  onMouseUp: function onMouseUp() {
                    return _this2.endDrawing(value.finishDrawing);
                  }
                })
              )
            );
          }
        )
      );
    }
  }]);
  return Canvas;
}(React.Component);

var ToolBar = function ToolBar() {
  return React.createElement(
    RannonatorContext.Consumer,
    null,
    function (contextValue) {
      var buttons = Object.keys(contextValue.options.types).map(function (type) {
        if (contextValue.options.types[type]) {
          return React.createElement(Button, {
            key: type,
            toggleInit: contextValue.toggleInit,
            type: type,
            activeType: contextValue.activeType
          });
        }
      });
      return React.createElement(
        "div",
        { className: "__ra-navbar" },
        buttons
      );
    }
  );
};

var Rannonator = function (_Component) {
  inherits(Rannonator, _Component);

  function Rannonator(props) {
    classCallCheck(this, Rannonator);

    var _this3 = possibleConstructorReturn(this, (Rannonator.__proto__ || Object.getPrototypeOf(Rannonator)).call(this, props));

    _this3.toggleInit = function (type) {
      if (_this3.state.init && _this3.state.activeType == type) {
        return _this3.setState({
          init: false,
          activeType: ""
        });
      }
      _this3.setState({
        init: true,
        activeType: type
      });
    };

    _this3.onFinishDraw = function (res) {
      var newComment = {
        data: res,
        type: _this3.state.activeType
      };
      if (_this3.props.onFinish) {
        return _this3.props.onFinish(newComment);
      }
    };

    _this3.state = {
      init: false,
      activeType: ""
    };
    return _this3;
  }

  createClass(Rannonator, [{
    key: "render",
    value: function render() {
      var _state = this.state,
          init = _state.init,
          activeType = _state.activeType;


      return React.createElement(
        RannonatorContext.Provider,
        {
          value: {
            init: init,
            activeType: activeType,
            options: this.props.options || options,
            toggleInit: this.toggleInit,
            finishDrawing: this.onFinishDraw
          }
        },
        this.props.children
      );
    }
  }]);
  return Rannonator;
}(Component);

export default Rannonator;
export { Annonation, Canvas, ToolBar };
//# sourceMappingURL=index.es.js.map
