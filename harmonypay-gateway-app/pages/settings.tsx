import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import FormSettings from '../components/forms/settings'
import AccessDenied from '../components/access-denied'
import settingsEnv from '../lib/envfile';

// This function gets called at build time
export async function getStaticProps() {
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  //const currentEnv = commitMgrEnv();
  return {
    props: { ...settingsEnv() },
  }
}


export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState()

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch('/api/examples/protected')
      const json = await res.json()
      if (json.content) { setContent(json.content) }
    }
    fetchData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  // If session exists, display content
  return (
    <Layout>
      <h1 className="font-bold text-xl mb-3">Settings</h1>
      <p><strong>{content || "\u00a0"}</strong></p>
      <FormSettings {...props} />
    </Layout>
  )
}