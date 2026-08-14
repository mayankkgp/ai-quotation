import React from 'react';
import { useInitializeStorage } from '../../utils/useInitializeStorage';
import { WorkspaceController } from '../../features/workspace/WorkspaceController';
import { Loader2 } from 'lucide-react';

/**
 * Global 3-Pane Desktop Layout Shell & Initialization Wrapper
 */
export function AppWrapper() {
  const { isReady, authState, setAuthState, history } = useInitializeStorage();

  if (!isReady) {
    return (
      <div className="w-screen h-screen bg-neutral-900 text-white flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
        <h2 className="text-sm font-mono tracking-wider">Initializing Fabrito Workspace...</h2>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex select-none min-w-[1024px]">
      <WorkspaceController
        history={history}
        authState={authState}
        onAuthChange={setAuthState}
      />
    </div>
  );
}
