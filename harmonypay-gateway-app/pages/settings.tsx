import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import FormSettings from '../components/forms/settings'
import AccessDenied from '../components/access-denied'
//import settingsEnv from '../lib/envfile';

// This function gets called at build time
export async function getStaticProps() {
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  //const currentEnv = await settingsEnv();
  return {
    props: {},
  }
}


export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(props)

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch('/api/v1/admin/settings/env')
      const json = await res.json()
      //console.log(json.data)
      if (json.data) { setContent(json.data) }
    }
    fetchData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  //console.log(content)
  // If session exists, display content
  return (
    <Layout>
      <h1 className="font-bold text-xl mb-3">Settings</h1>
      <FormSettings {...content} />
    </Layout>
  )
}