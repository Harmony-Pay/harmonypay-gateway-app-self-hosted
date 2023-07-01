import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import { useRouter } from 'next/router'
import FormCoin from '../components/forms/form-coin'
import AccessDenied from '../components/access-denied'

export default function Page (props: any) {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [ content , setContent ] = useState(props)
  const router = useRouter()
  const { id } = router.query
  // Fetch content from protected route
  useEffect(()=>{
    /*const fetchData = async () => {
      const res = await fetch(`/api/v1/admin/coin/1`)
      const json = await res.json()
      //console.log(json)
      if (json.data) { setContent(json.data) }
    }
    fetchData()*/
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && typeof content !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  // If session exists, display content
  return (
    <Layout>
      <h1 className="font-bold text-xl mb-3">Coin Details</h1>
      <FormCoin {...content}/>
    </Layout>
  )
}
