import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application Error:", error);
    console.error("Error Info:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0b1020] p-6 text-white">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
            <h1 className="mb-4 text-3xl font-bold text-red-400">
              Something went wrong
            </h1>

            <p className="mb-6 text-sm text-white/70">
              An unexpected error crashed this section of the app.
            </p>

            <button
              onClick={this.handleReload}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Reload Application
            </button>

            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 overflow-auto rounded-lg bg-black/40 p-4 text-left text-xs text-red-300">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;