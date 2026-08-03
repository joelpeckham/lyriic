import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Catches lazy-route / render failures so soft navigation never leaves an empty #root.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route failed", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 bg-background px-6 py-16 text-center"
        >
          <p className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
            This page couldn’t load. Your drafts and settings are still available.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button type="button" variant="ghost" onClick={this.handleRetry}>
              Try again
            </Button>
            <Button type="button" variant="ghost" onClick={this.handleReload}>
              Reload
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
