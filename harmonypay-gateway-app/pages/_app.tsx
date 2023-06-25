import { Provider } from "next-auth/react"
import type { AppProps } from "next/app"
import "./styles.css"
import "./custom.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider
      options={{
        clientMaxAge: 60,  // Sync session state with server if it's older than 60 seconds
        keepAlive: 5 * 60, // Send a keep alive request every 5 minutes
      }}
      session={pageProps.session}
    >
      <Component {...pageProps} />
    </Provider>
  )
}
