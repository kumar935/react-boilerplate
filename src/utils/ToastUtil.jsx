import React, { Component } from 'react';
import { toast, style, ToastContainer } from 'react-toastify';

class ToastUtil extends Component{
  render(){
    style({
      width: "320px",
      colorDefault: "#fff",
      colorInfo: "#3498db",
      colorSuccess: "#0db46b",
      colorWarning: "#b1a11c",
      colorError: "#bd2654"
    });
    return (
      <ToastContainer
        progressClassName="toast-progress"
        className="toast-container"
        position="bottom-right"
        autoClose={12000}
      />
    );
  }
  static success(msg){
    toast.success(
      <div className="custom-toast">
        <div className="title-container">
          <span className="svgicons svgicons-success"/>&nbsp;
          <span className="title">SUCCESS</span>
        </div>
        <div className="desc">{msg}</div>
      </div>
    )
  }
  static error(msg){
    toast.error(
      <div className="custom-toast">
        <div className="title-container">
          <span className="svgicons svgicons-error"/>&nbsp;
          <span className="title">ERROR</span>
        </div>
        <div className="desc">{msg}</div>
      </div>
    )
  }
  static warn(msg){
    toast.warn(
      <div className="custom-toast">
        <div className="title-container">
          <span className="svgicons svgicons-warning"/>&nbsp;
          <span className="title">WARNING</span>
        </div>
        <div className="desc">{msg}</div>
      </div>
    )
  }

  static info(msg){
    toast.info(
      <div className="custom-toast">
        <div className="title-container">
          <span className="svgicons svgicons-warning"/>&nbsp;
          <span className="title">INFO</span>
        </div>
        <div className="desc">{msg}</div>
      </div>
    )
  }
}

export default ToastUtil;
