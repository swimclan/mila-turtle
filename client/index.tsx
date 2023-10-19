import { createRoot } from "react-dom/client";
import { App } from "./src/App";

if ((module as NodeModule & { hot: any }).hot) {
  (module as NodeModule & { hot: any }).hot.accept();
}

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);
