"use client";

import { useMiniApp } from "@neynar/react";
import { HomeTab } from "~/components/ui/tabs";

export interface AppProps {
  title?: string;
}

/**
 * App component serves as the main container for the mini app interface.
 *
 * Displays The Trustless Manifesto with signing functionality.
 */
export default function App(
  { title }: AppProps = { title: "The Trustless Manifesto" }
) {
  // --- Hooks ---
  const { isSDKLoaded, context } = useMiniApp();

  // --- Early Returns ---
  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading SDK...</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      {/* Main content */}
      <HomeTab />
    </div>
  );
}

