import React, { Component } from "react";

export default class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  handleSubmit = () => {
    this.props.handler(this.state.text);
  };
  handleType = e => {
    this.setState({
      text: e.target.value
    });
  };

  render() {
    return (
      <div className="comment-form">
        <form onSubmit={this.handleSubmit}>
          <textarea onChange={this.handleType} type="text" />
        </form>
      </div>
    );
  }
}
