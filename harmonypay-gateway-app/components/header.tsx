import { useState, useEffect } from 'react'
import Link from "next/link"
import Head from 'next/head'
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [networkmode, setNetworkmode] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/v1/admin/settings/env`)
      const json = await res.json()
      if (json.data.networkMode) {
        setNetworkmode(json.data.networkMode)
      }
    }
    fetchData()
  }, [])

  return (
    <header>
      <Head>
        <title>HarmonyPay Gateway</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not logged in
              </span>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                LOGIN
              </a>
            </>
          )}
          {session && (
            <>
              <span
                style={{ backgroundImage: `url(${session.user?.image || ''})` }}
                className={styles.avatar}
              />
              <span className={styles.signedInText}>
                <small>Logged as</small>
                <br />
                <strong>{session.user?.email || session.user?.name || ''}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Logout
              </a>
            </>
          )}
        </p>
        {session && networkmode === 'testnet' && (
        <p className="px-4 py-2 text-base text-center rounded-b-full text-yellow-600 bg-yellow-100">
            TESTNET MODE ACTIVE
        </p>)}
        {session && networkmode === 'mainnet' && (
        <p className="px-4 py-2 text-base text-center rounded-b-full text-green-600 bg-green-100">
            MAINNET MODE ACTIVE
        </p>)}
      </div>
      {session && (
      <nav className="text-center">
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a aria-current="page" className="block transition duration-150 hover:text-blue-200"
               style={{outline: 'none'}}>
               <div className="flex flex-grow"><svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                   <path className="fill-current text-gray-400 text-indigo-500"
                     d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 2c1.85 0 3.583.637 4.95 1.7l-1.4 1.4A7.947 7.947 0 0 0 12 4c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8a7.96 7.96 0 0 0-1.088-4.009l1.638-1.285A9.943 9.943 0 0 1 22 12c0 5.514-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm1 16h-2v-2h2v2zm2-7h-4V7h2a2 2 0 0 1 2 2v2z" />
               </svg>
               <span className="flex-grow">Dashboard</span>
              </div>
             </a>
            </Link>
          </li>
          {/* Add more navigation items */}
        </ul>
      </nav>
      )}
    </header>
  )
}
