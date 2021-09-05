import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import dayjs from 'dayjs'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import AccessDenied from '../../components/access-denied'
import { getHarmonyExplorer } from '../../lib/utils'
//import { PaperClipIcon } from '@heroicons/react/solid'

export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(props)
  const [networkmode, setNetworkmode] = useState<string>()

  const router = useRouter()
  const { id } = router.query
  if (id === undefined) return false

  // Fetch content from protected route
  useEffect(()=>{
    const fetchNetworkmode = async () => {
      const res = await fetch(`/api/v1/admin/settings/env`)
      const json = await res.json()
      if (json.data.networkMode) { setNetworkmode(json.data.networkMode) }
    }
    const fetchData = async () => {
      const res = await fetch(`/api/v1/admin/donation/${id}`)
      const json = await res.json()
      //console.log(json)
      if (json.data) { setContent(json.data) }
    }
    fetchNetworkmode()
    fetchData()
  },[session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && typeof content !== 'undefined' && loading) return null

  // If no session exists, display access denied message
  if (!session) { return  <Layout><AccessDenied/></Layout> }

  // If session exists, display content
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Donation Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Donation / Transaction details.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Donation ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.id}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.amount} {content.currency_id}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">To Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <a href={getHarmonyExplorer(networkmode,'address',content.to_address)} target="_blank">
              {content.to_address}
            </a>  
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">From Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <a href={getHarmonyExplorer(networkmode,'address',content.from_address)} target="_blank">
              {content.from_address}
            </a>  
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{dayjs(content.created_at).format('MMMM D, YYYY h:mm A')}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">



          </div>
        </dl>
      </div>
    </div>
    </Layout>
  )
}