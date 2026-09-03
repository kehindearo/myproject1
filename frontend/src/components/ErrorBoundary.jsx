import { Component } from "react";
import Button from "./ui/Button";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Collabo Travel error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="stack"
          style={{
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
            gap: 16,
          }}
        >
          <p className="screen-title">Something went wrong</p>
          <p className="body-text">Please try again. If this keeps happening, restart the app.</p>
          <Button onClick={() => this.setState({ hasError: false })}>Try Again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
