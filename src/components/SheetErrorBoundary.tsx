import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  /** Accessible name for the retry control (e.g. "Retry settings"). */
  label: string;
};

type State = {
  hasError: boolean;
};

/**
 * Isolates lazy sheet/chunk failures so the editor chrome stays mounted.
 */
export class SheetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Sheet failed", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 px-2 font-[family-name:var(--font-ui)] text-xs text-muted-foreground hover:text-foreground"
          aria-label={this.props.label}
          onClick={this.handleRetry}
        >
          Retry
        </Button>
      );
    }

    return this.props.children;
  }
}
