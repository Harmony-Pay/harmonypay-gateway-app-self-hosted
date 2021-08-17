import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import FormCoin from '../../components/forms/form-coin'
import AccessDenied from '../../components/access-denied'

// This function gets called at build time
export async function getStaticProps() {
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  //const currentEnv = commitMgrEnv();
  //const res = await fetch(`/api/v1/admin/coin/${context.params.id}`)
  //const json = await res.json()
  
  return {
    props: {},
  }
}
// This function gets called at build time
export async function getStaticPaths() {
  return {
    paths: [], fallback: true
  }
}

export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(props)
  const router = useRouter()
  const { id } = router.query
  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch(`/api/v1/admin/coin/${id}`)
      const json = await res.json()
      //console.log(json)
      if (json.data) { setContent(json.data) }
    }
    fetchData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && typeof content !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  // If session exists, display content
  return (
    <Layout>
      <h1 className="font-bold text-xl mb-3">Coin Details</h1>
      {/*<p><strong>{content || "\u00a0"}</strong></p>*/}
      <FormCoin {...content} />
    </Layout>
  )
}