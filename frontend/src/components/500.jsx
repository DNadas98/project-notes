import React from "react";
import Header from "./Header";
import Footer from "./Footer";

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
        <div className="Layout">
          <Header pageTitle="Project Auth" />
          <main>
            <div className="500 column">
              <h1>Something went wrong...</h1>
              <a href="/">
                <button>Home</button>
              </a>
            </div>
          </main>
          <Footer pageTitle="Project Auth" name="Daniel Nadas" />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
