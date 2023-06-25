import { useState, useEffect } from 'react'
import Link from "next/link"
import Head from 'next/head'
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const [session, loading] = useSession()
  const [networkmode, setNetworkmode] = useState()

  useEffect(()=>{
    const fetchData = async () => {
        const res = await fetch(`/api/v1/admin/settings/env`)
        const json = await res.json()
        if (json.data.networkMode) { setNetworkmode(json.data.networkMode) }
      }
    fetchData()
  },[networkmode])

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
                onClick={(e: any) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                LOGIN
              </a>
            </>
          )}
          {session?.user && (
            <>
              <span
                style={{ backgroundImage: `url(${session.user.image})` }}
                className={styles.avatar}
              />
              <span className={styles.signedInText}>
                <small>Logged as</small>
                <br />
                <strong>{session.user.email || session.user.name}</strong>
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
                     d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                   <path className="fill-current text-gray-600 text-indigo-600"
                     d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z" />
                   <path className="fill-current text-gray-400 text-indigo-200"
                     d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z" />
                   </svg><span className="font-medium">Dashboard</span></div>
             </a>           
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/coins">
            <a aria-current="page" className="block hover:text-blue-200 transition duration-150 false"style={{outline: 'none'}}>
              <div className="flex flex-grow"><svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                  <circle className="fill-current text-gray-400 false" cx="18.5" cy="5.5" r="4.5" />
                  <circle className="fill-current text-gray-600 false" cx="5.5" cy="5.5" r="4.5" />
                  <circle className="fill-current text-gray-600 false" cx="18.5" cy="18.5" r="4.5" />
                  <circle className="fill-current text-gray-400 false" cx="5.5" cy="18.5" r="4.5" />
                </svg><span className="font-medium">Coins</span></div>
            </a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/orders">
            <a aria-current="page" className="block hover:text-blue-200 transition duration-150 false" style={{outline: 'none'}}>
              <div className="flex items-center justify-between">
                <div className="flex flex-grow"><svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                    <path className="fill-current text-gray-400 false" d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
                    <path className="fill-current text-gray-700 false" d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
                    <path className="fill-current text-gray-600 false" d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z">
                    </path>
                  </svg><span className="font-medium">Orders</span></div>
                {/*<div className="flex flex-shrink-0 ml-2">
                  <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded-sm">0</span>
                </div>*/}
              </div>
            </a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/donations">
            <a aria-current="page" className="block hover:text-blue-200 transition duration-150 false" style={{outline: 'none'}}>
              <div className="flex flex-grow"><svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                  <path className="fill-current text-gray-600 false" d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z">
                  </path>
                  <path className="fill-current text-gray-400 false" d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z">
                  </path>
                </svg><span className="font-medium">Donations</span></div>
            </a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/settlements">
            <a aria-current="page" className="block hover:text-blue-200 transition duration-150 false" style={{outline: 'none'}}>
              <div className="flex flex-grow">
              <svg className="flex-shrink-0 h-6 w-6 mr-3" viewBox="0 0 24 24">
                <path className="fill-current text-gray-600 false" d="M8 1v2H3v19h18V3h-5V1h7v23H1V1z" />
                <path className="fill-current text-gray-600 false" d="M1 1h22v23H1z" />
                <path className="fill-current text-gray-400 false" d="M15 10.586L16.414 12 11 17.414 7.586 14 9 12.586l2 2zM5 0h14v4H5z" />
              </svg>
              <span className="font-medium">Settlements</span></div>
            </a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/settings">
            <a aria-current="page" className="block hover:text-blue-200 transition duration-150 false" style={{outline: 'none'}}>
              <div className="flex flex-grow"><svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                  <path className="fill-current text-gray-600 false" d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z">
                  </path>
                  <path className="fill-current text-gray-400 false" d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z">
                  </path>
                  <path className="fill-current text-gray-600 false" d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z">
                  </path>
                  <path className="fill-current text-gray-400 false" d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z">
                  </path>
                </svg><span className="font-medium">Settings</span></div>
            </a>
            </Link>
          </li>
        </ul>
      </nav>
      )}
    </header>
  )
}
