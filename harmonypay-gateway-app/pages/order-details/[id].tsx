import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import dayjs from 'dayjs'
import Layout from '../../components/layout'
import Link from "next/link"
import { useRouter } from 'next/router'
import AccessDenied from '../../components/access-denied'
import { covertFromWei, getHarmonyExplorer } from '../../lib/utils'

export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(props)
  const [networkmode, setNetworkmode] = useState()

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
      const res = await fetch(`/api/v1/admin/order/${id}`)
      const json = await res.json()
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Order details</p>
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
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <a href={getHarmonyExplorer(networkmode,'address',content.to_address)} target="_blank">  
              {content.to_address}
            </a>  
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{dayjs(content.created_at).format('MMMM D, YYYY h:mm A')}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Auto Settlement</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <strong>{content && content.autosettlements && `${content.autosettlements[0].type}`.toUpperCase()}</strong><br/>
              {content && content.autosettlements && content.autosettlements[0].binance_settlement_currency}
            </dd>
          </div>
          <div className="bg-white px-4 py-3 w-full">
        {(content && content.transactions && content.transactions.length > 0) ? (<>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Transactions Information</h3>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-3">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
                Transaction Hash
            </th>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
                Amount
            </th>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
                Status
            </th>

                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {content && content.transactions && content.transactions.map((field: any) => (
                <tr key={field.id}>

                <td className="px-6 py-4 whitespace-nowrap">
                  <a href={getHarmonyExplorer(networkmode,'tx',field.hash)} target="_blank">
                    <div className="text-sm text-blue-900">{field.hash.substr(0, 33)}...</div>
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-sm text-gray-600">
                      {field.value > 0 && covertFromWei(`${field.value}`)} {field.value > 0 && (<span className="text-sm text-gray-900">ONE</span>)}
                      {field.value == 0 && content.amount} {field.value == 0 && content.currency_id}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={parseInt(field.order_id) > 0 ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" : (parseInt(field.status) < 0 ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800" : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-600")}>
                    {parseInt(field.order_id) > 0 ? 'Complete' : (parseInt(field.status) < 0 ? 'Cancelled' : 'Pending')}
                    </span>
                </td>

                </tr>
                ))}
            </tbody>
            </table>
            </div></>) : <div className="text-center text-xl text-red-500">No transactions found</div>}

          </div>
        </dl>
      </div>
    </div>
    </Layout>
  )
}