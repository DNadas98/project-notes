import React from "react";

//https://legacy.reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="error_500">
          <h1>500 - Internal Server Error</h1>
          <a href="/">
            <button>Home</button>
          </a>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
