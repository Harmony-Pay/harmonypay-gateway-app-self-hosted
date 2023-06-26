import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import Link from "next/link"
import AccessDenied from '../components/access-denied'
import { ellipsisAddress } from '../lib/utils'

export default function Page (props: any) {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [ content , setContent ] = useState(new Array())

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
        const res = await fetch('/api/v1/admin/settlements')
        const json = await res.json()
        if (json.data) { setContent(json.data) }
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
    <h1 className="font-bold text-xl mb-3">Settlements</h1>
    <div className="mt-6 col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-gray-200">
        <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Auto Settlements</h2>
        </header>

        <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Settlement ID
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Pair
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    To Address
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
                    {content && content.map((field:any) => (
                    <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                    <Link href={`/settlement-details/${field.id}`}>
                        <a href={`/settlement-details/${field.id}`}>
                        <svg className="flex-shrink-0 h-6 w-6 mr-3" viewBox="0 0 24 24">
                            <path className="fill-current text-gray-600 false" d="M8 1v2H3v19h18V3h-5V1h7v23H1V1z" />
                            <path className="fill-current text-gray-600 false" d="M1 1h22v23H1z" />
                            <path className="fill-current text-gray-400 false" d="M15 10.586L16.414 12 11 17.414 7.586 14 9 12.586l2 2zM5 0h14v4H5z" />
                        </svg>
                        </a>
                    </Link>
                    </div>
                    <div className="ml-0">
                    <Link href={`/settlement-details/${field.id}`}>
                        <a href={`/settlement-details/${field.id}`}>
                        <div className="text-sm font-medium text-gray-900">ID #{field.id}</div>
                        <div className="text-sm text-gray-500">Order ID #{field.order_id}</div>
                        <div className="text-sm text-blue-600">{field.settlement_type}</div>
                        </a>
                    </Link>
                    </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{field.settlement_pair}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/settlement-details/${field.id}`}>
                        <a href={`/settlement-details/${field.id}`}>
                        <div className="text-sm text-gray-900">{ellipsisAddress(field.to_address)}</div>
                        </a>
                    </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.amount} {field.currency_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={field.status ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"}>
                    {field.status ? 'Complete' : 'Pending'}
                    </span>
                    </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
        </div>
</Layout>
)
}
