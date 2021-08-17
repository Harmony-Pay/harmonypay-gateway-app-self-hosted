import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import AccessDenied from '../../components/access-denied'
//import { PaperClipIcon } from '@heroicons/react/solid'

export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(props)
  const router = useRouter()
  const { id } = router.query
  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch(`/api/v1/admin/order/${id}`)
      const json = await res.json()
      console.log(json)
      if (json.data) { setContent(json.data) }
    }
    fetchData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && typeof content !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }
/*

amount: "30.30"
autosettlements: (2) [{…}, {…}]
confirmations: 1
created_at: "2021-08-12T02:42:22.252Z"
currency_id: "ONE"
domain: "http://wplab.test"
domain_key: ""
id: 121
microtime: "2735"
payment_id: 126
status: 0
timeout_hours: 2
to_address: "one109edxa2urjpf0f3g6c98p9xeq9l5ysfjaqset2"

*/

  //console.log(content)
  // If session exists, display content
  return (
    <Layout>
      {/*<p><strong>{content || "\u00a0"}</strong></p>*/}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Order/Transaction details.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Paymend ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.payment_id}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.amount} {content.currency_id}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">To Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.to_address}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.created_at}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Autosettlements</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {JSON.stringify(content.autosettlements, null, 2)}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">



          </div>
        </dl>
      </div>
    </div>
    </Layout>
  )
}