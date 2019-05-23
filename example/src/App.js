import React, { Component } from "react";
import Rannonator, { Canvas, ToolBar, Annonation } from "test";
import CommentForm from "./CommentForm";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      newAnnonation: {},
      showForm: false
    };
  }
  handler = res => {
    this.setState({
      showForm: true,
      newAnnonation: res
    });
  };

  createComment = () => {
    let newComment = {};
    this.setState(prevState => ({
      comments: [newComment, ...prevState.comments]
    }));
  };

  render() {
    let comments = null;
    this.state.comments.length > 0
      ? (comments = this.state.comments.map((comment, index) => (
          <Annonation key={index} data={comment.data} type={comment.type} />
        )))
      : null;
    return (
      <Rannonator onFinish={this.handler}>
        <h1>Cool Annonations</h1>
        <ToolBar />
        <Canvas>
          <img src="https://timedotcom.files.wordpress.com/2017/08/game-of-thrones-eastwatch-01.jpg" />
          {comments}
          {this.state.newAnnonation !== null && <CommentForm />}
        </Canvas>
      </Rannonator>
    );
  }
}
