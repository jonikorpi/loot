import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";
import "aframe-bmfont-text-component";

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleStateEvent(event) {
    const name = event.detail.state;
    const type = event.type;
    let boolean;

    switch (type) {
      case "stateadded":
        boolean = true;
        break;
      case "stateremoved":
        boolean = false;
        break;
      default:
        console.log("Bad event in Button");
        return;
    }

    if (name && type && this._reactInternalInstance) {
      this.setState({[name]: boolean});
    }
  }

  render() {
    const text = this.props.text || "Quick brown fox";
    const baseLineHeight = 0.12;
    const textSizeMultiplier = 200;
    const computedWidth = text.length * 0.1;

    const padding = this.props.padding || 0.1;
    const lineHeight = this.props.lineHeight ? this.props.lineHeight * baseLineHeight : baseLineHeight;

    const width = (this.props.width || computedWidth) + padding*2;
    const height = lineHeight + padding*2;
    const color = this.props.color || "grey";
    const scale = this.props.scale || 0.5;

    const currentColor = this.state["cursor-hovered"] ? "black" : color;

    return (
      <Entity
        className="button"
        position={this.props.position || [0,0,0]}
        geometry={{
          primitive: "plane",
          width: width,
          height: height,
        }}
        scale={[scale, scale, scale]}
        material={{
          shader: "flat",
          color: currentColor,
        }}
      >

        {this.props.children}

        <Entity
          className="button-text"
          position={[width * -0.5, lineHeight * -0.5, 0.02]}
          bmfont-text={{
            text: text,
            color: this.props.textColor || "white",
            lineHeight: lineHeight * textSizeMultiplier,
            width: width * textSizeMultiplier,
            letterSpacing: 0,
            align: "center",
          }}
        />

        <Entity
          className="clickable"
          position={[0, 0, 0.05]}
          onClick={this.props.onClick}
          onStateadded={this.handleStateEvent.bind(this)}
          onStateremoved={this.handleStateEvent.bind(this)}
          geometry={{
            primitive: "plane",
            width: width,
            height: height,
          }}
          material={{
            shader: "flat",
            opacity: 0,
            transparent: true,
          }}
        />

      </Entity>
    );
  }
}
