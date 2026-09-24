"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { blockType: string; blockKey: string; children: ReactNode };
type State = { failed: boolean };

/**
 * Contains a runtime failure to the one block that caused it. The rest of the page keeps
 * rendering; the broken block renders nothing rather than an error panel visitors can see.
 */
export class BlockErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[blocks] "${this.props.blockType}" (${this.props.blockKey}) failed to render and was skipped.`,
      error,
      info.componentStack,
    );
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
