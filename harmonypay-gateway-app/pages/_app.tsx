import { Provider } from "next-auth/react"
import type { AppProps } from "next/app"
import "./styles.css"
import "./custom.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider
      session={pageProps.session}
    >
      <Component {...pageProps} />
    </Provider>
  )
}

