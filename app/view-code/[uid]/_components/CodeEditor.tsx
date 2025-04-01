import React from "react";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import Constants from "@/data/Constants";
import { freeCodeCampDark } from "@codesandbox/sandpack-themes";

function CodeEditor({ codeResp, isReady }: { codeResp: any; isReady: any }) {
  return (
    <div>
      {isReady ? (
        <Sandpack
          template="react"
          theme={freeCodeCampDark}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDENCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 620,
          }}
          files={{
            "/App.js": `${codeResp}`,
          }}
        />
      ) : (
        // jab code ready nhi hoga tab ye sab component render hoga with what ai is generating
        <SandpackProvider
          template="react"
          theme={freeCodeCampDark}
          files={{ "/app.js": { code: `${codeResp}`, active: true } }}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDENCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor showTabs={true} style={{ height: "80vh" }} />
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
}

export default CodeEditor;
