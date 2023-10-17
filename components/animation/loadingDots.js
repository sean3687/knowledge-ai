import React, { Component } from "react";

class LoadingDots extends Component {
  constructor() {
    super();
    this.state = {
      dotCount: 1, // Initial count of dots
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const { dotCount } = this.state;
      // Update the count based on the current count
      switch (dotCount) {
        case 1:
          this.setState({ dotCount: 2 });
          break;
        case 2:
          this.setState({ dotCount: 3 });
          break;
        case 3:
          this.setState({ dotCount: 1 });
          break;
        default:
          break;
      }
    }, 400); // Update every 400 milliseconds (change as needed)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="w-6">
        <div className="flex">
          {this.state.dotCount >= 1 && <div className="dot"></div>}
          {this.state.dotCount >= 2 && <div className="dot"></div>}
          {this.state.dotCount >= 3 && <div className="dot"></div>}
        </div>
      </div>
    );
  }
}

export default LoadingDots;
