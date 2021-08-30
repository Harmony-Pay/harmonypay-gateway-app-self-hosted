import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import { signIn } from 'next-auth/client'
import { useSession } from 'next-auth/client'
import AccessDenied from '../components/access-denied'
import WelcomeBanner from '../components/welcome-banner'
import settingsEnv from '../lib/envfile'
import { resetEnviroment } from '../lib/utils'

// This function gets called at build time
export async function getStaticProps() {
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  const currentEnv = await settingsEnv()
  return {
    props: {...currentEnv},
  }
}


export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState()

  // Fetch content from protected route
  useEffect(()=>{
    const currentUrl = window.location.href

    console.log(currentUrl, props)

    if (props.nextauthUrl === undefined || 
      props.nextauthUrl === null || 
      props.nextauthUrl === '' || 
      props.nextauthUsername === undefined || 
      props.nextauthUsername === null ||
      props.nextauthUsername === '') {
      resetEnviroment(currentUrl)
    }
    
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { 

  return (
    <Layout>
      <WelcomeBanner />
      <h1 className="font-bold text-xl mb-3">Harmony Pay Gateway</h1>
      <p className="text-gray-700 text-base mb-3">
      Here at Harmony Pay we are doing our part to help the Harmony Ecosystem by looking into creating bridges from TradFi to deFi.
      </p>
      <p className="text-gray-700 text-base mb-3">
      We want to create interoperable systems and protocols that are intuitive to use for the end clients and users as well as create easy to integrate protocols that can be embedded into existing systems and offer flowless and safe way for digital and traditional currencies to interreact.
      </p>
      <div className="py-3 text-center">
        <a
          href={`/api/auth/signin`}
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
        <button className="btn py-4 min-w-full bg-indigo-500 hover:bg-indigo-600 text-white" style={{outline: "none"}}>
            <span className="xs:block">LOGIN TO MANAGE</span>
        </button>
        </a>
      </div>
    </Layout>
  )

  } else {
    let status = true;
    return (
    <Layout>   
    <WelcomeBanner />
    <div className="mt-3 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-6">
        {/* 1 card */}
        <div className="relative bg-white py-6 px-6 rounded-3xl w-full my-4 shadow-xl">
          <div
            className="text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-red-500 left-4 -top-6">
            {/* svg */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-8">
            <p className="text-xl font-semibold my-2">WORDPRESS</p>
            <div className="flex space-x-2 text-gray-400 text-sm">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>http://wpaddress.com</p>
            </div>
            <div className="flex space-x-2 text-gray-400 text-sm my-3">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>IN PROGRESS</p>
            </div>
            <div className="border-t-2" />
            <div className="flex justify-between mt-3">
              <div className="my-2">
              <span className={status
                  ? "px-6 py-1 inline-flex text-md leading-6 font-semibold rounded-full bg-green-100 text-green-800"
                  : "px-6 py-1 inline-flex text-md leading-6 font-semibold rounded-full bg-red-100 text-red-800"
                  }>
                  {status ? 'ONLINE' : 'OFFLINE'}
              </span>
              </div>
            </div>
          </div>
        </div>
        {/* 2 card */}
        <div className="relative bg-white py-6 px-6 rounded-3xl w-full my-4 shadow-xl">
          <div
            className=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-green-500 left-4 -top-6">
            {/* svg */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-8">
            <p className="text-xl font-semibold my-2">PAYMENTS</p>
            <div className="flex space-x-2 text-gray-400 text-sm">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Payments Monitor</p>
            </div>
            <div className="flex space-x-2 text-gray-400 text-sm my-3">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>IN PROGRESS</p>
            </div>
            <div className="border-t-2 " />
            <div className="flex justify-between mt-3">
              <div className="my-2">
              <span className={status
                  ? "px-6 py-1 inline-flex text-md leading-6 font-semibold rounded-full bg-green-100 text-green-800"
                  : "px-6 py-1 inline-flex text-md leading-6 font-semibold rounded-full bg-red-100 text-red-800"
                  }>
                  {status ? 'ONLINE' : 'OFFLINE'}
              </span>
              </div>
            </div>
          </div>
        </div>
        {/* 3 card */}
        <div className="relative bg-white py-6 px-6 rounded-3xl w-full my-4 shadow-xl">
          <div
            className=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-blue-500 left-4 -top-6">
            {/* svg */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="mt-8">
            <p className="text-xl font-semibold my-2">AUTOSETTLEMENT</p>
            <div className="flex space-x-2 text-gray-400 text-sm">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Autosettlement Agent</p>
            </div>
            <div className="flex space-x-2 text-gray-400 text-sm my-3">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>IN PROGRESS</p>
            </div>
            <div className="border-t-2" />
            <div className="flex justify-between mt-3">
              <div className="my-2">
              <span className={status
                  ? "px-6 py-1 inline-flex text-md leading-6 font-semibold rounded-full bg-green-100 text-green-800"
                  : "px-6 py-1 inline-flex text-md leading-6 font-semibold rounded-full bg-red-100 text-red-800"
                  }>
                  {status ? 'ONLINE' : 'OFFLINE'}
              </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    </Layout>
    )
  }
}