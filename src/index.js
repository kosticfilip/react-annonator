import React, { Component } from "react";
import Button from "./components/Button";

const options = {
  types: {
    dot: true,
    rectangle: true,
    elipse: true
  }
};

const RannonatorContext = React.createContext({
  init: false,
  toggleInit: () => {}
});

export const Annonation = ({ data, type }) => {
  if (type == "dot") {
    const { endX, endY } = data;
    return (
      <div
        className="preview"
        style={{
          left: endX + "%",
          top: endY + "%",
          transform: "translate(-10px, -10px)",
          width: "20px",
          height: "20px",
          borderRadius: "50%"
        }}
      />
    );
  } else {
    const { startX, startY, endX, endY, ratio } = data;
    const left = startX - endX >= 0 ? endX + "%" : startX + "%";
    const top = startY - endY >= 0 ? endY + "%" : startY + "%";
    const width = Math.abs(endX - startX) + "%";
    const height = Math.abs(endY - startY) + "%";
    switch (type) {
      case "rectangle":
        return (
          <div
            className="preview"
            style={{
              left,
              top,
              width,
              height
            }}
          />
        );
      case "elipse":
        return (
          <div
            className="preview"
            style={{
              left,
              top,
              width,
              height,
              borderRadius: "50%"
            }}
          />
        );
      default:
        return null;
    }
  }
};

export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isDrawing: false,
      ratio: false,
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    };
  }
  initDrawing = (e, init) => {
    if (!init) {
      return;
    }
    e.persist();
    console.log("Init Active ----------------");
    // Prevent defualt drag behaivor when drawing(dragging)
    this.myRef.current.ondragstart = e => e.preventDefault();

    // Find width and height of canvas
    const width = this.myRef.current.getBoundingClientRect().width,
      height = this.myRef.current.getBoundingClientRect().height,
      // Calculate postion in % for CSS Absolute Position
      startX = (e.nativeEvent.offsetX / width) * 100,
      startY = (e.nativeEvent.offsetY / height) * 100;

    this.setState({
      width,
      height,
      startX,
      startY,
      endX: startX,
      endY: startY,
      isDrawing: true
    });
  };

  drawing = e => {
    if (!this.state.isDrawing) {
      return;
    }

    // Set Current Position of Cursor, relative to the canvas size
    let endX,
      ratio = false,
      endY = (e.nativeEvent.offsetY / this.state.height) * 100;

    if (e.shiftKey) {
      endX = endY;
      ratio = this.state.width / this.state.height;
    } else {
      endX = (e.nativeEvent.offsetX / this.state.width) * 100;
    }

    console.log("Drawing Active ----------------");
    this.setState({
      ratio,
      endX,
      endY
    });
  };

  endDrawing = finishDrawing => {
    if (!this.state.isDrawing) {
      return;
    }
    console.log("endDrawing Active ----------------");

    const res = {
      startX: this.state.startX,
      startY: this.state.startY,
      endX: this.state.endX,
      endY: this.state.endY
    };

    finishDrawing(res);
    this.setState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    });
  };

  render() {
    //const { startX, startY, endX, endY } = this.state;
    //console.log(`x: ${startX} -- y: ${startY} ||| x: ${endX} -- y: ${endY}`);

    return (
      <React.Fragment>
        <RannonatorContext.Consumer>
          {value => (
            <React.Fragment>
              <div className="canvas-container">
                {this.props.children}
                {this.state.isDrawing ? (
                  <Annonation
                    data={this.state}
                    type={value.activeType}
                    isDrawing={this.state.isDrawing}
                  />
                ) : null}
                <div
                  className="drawing-area"
                  ref={this.myRef}
                  style={!value.init ? { zIndex: "-1" } : { zIndex: "9999" }}
                  onMouseDown={e => this.initDrawing(e, value.init)}
                  onMouseMove={this.drawing}
                  onMouseUp={() => this.endDrawing(value.finishDrawing)}
                />
              </div>
            </React.Fragment>
          )}
        </RannonatorContext.Consumer>
      </React.Fragment>
    );
  }
}

export const ToolBar = () => (
  <RannonatorContext.Consumer>
    {contextValue => {
      const buttons = Object.keys(contextValue.options.types).map(type => {
        if (contextValue.options.types[type]) {
          return (
            <Button
              key={type}
              toggleInit={contextValue.toggleInit}
              type={type}
              activeType={contextValue.activeType}
            />
          );
        }
      });
      return <div className="__ra-navbar">{buttons}</div>;
    }}
  </RannonatorContext.Consumer>
);
export default class Rannonator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      activeType: ""
    };
  }

  toggleInit = type => {
    if (this.state.init && this.state.activeType == type) {
      return this.setState({
        init: false,
        activeType: ""
      });
    }
    this.setState({
      init: true,
      activeType: type
    });
  };
  onFinishDraw = res => {
    const newComment = {
      data: res,
      type: this.state.activeType
    };
    if (this.props.onFinish) {
      return this.props.onFinish(newComment);
    }
  };

  render() {
    const { init, activeType } = this.state;

    return (
      <RannonatorContext.Provider
        value={{
          init: init,
          activeType: activeType,
          options: this.props.options || options,
          toggleInit: this.toggleInit,
          finishDrawing: this.onFinishDraw
        }}
      >
        {this.props.children}
      </RannonatorContext.Provider>
    );
  }
}
