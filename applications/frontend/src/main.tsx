import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import { ApiProvider } from "./providers/ApiProvider"
import { NotificationProvider } from "./providers/NotificationProvider"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </NotificationProvider>
  </React.StrictMode>
)
