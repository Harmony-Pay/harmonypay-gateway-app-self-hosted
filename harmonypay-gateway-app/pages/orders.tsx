import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import useSwr from 'swr'
import Layout from '../components/layout'
import Link from "next/link"
import AccessDenied from '../components/access-denied'

export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(new Array())

  //const fetcher = (url: string) => fetch(url).then((res) => res.json());
  //const { content, error } = useSwr(`/api/v1/admin/orders`, { refreshInterval: 6000, fetcher: fetcher });

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
        const res = await fetch('/api/v1/admin/orders')
        const json = await res.json()
        //console.log(json)
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
    <h1 className="font-bold text-xl mb-3">Orders Management</h1>
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
                Payment ID
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
                To Address
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
                {content && content.map((field: any) => (
                <tr key={field.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                <Link href={`/order-details/${field.id}`}>
                    <a href={`/order-details/${field.id}`}>
                    <svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                    <path className="fill-current text-gray-400 false" d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
                    <path className="fill-current text-gray-700 false" d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
                    <path className="fill-current text-gray-600 false" d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z">
                    </path>
                    </svg>
                    </a>
                </Link>
                </div>
                <div className="ml-1">
                <Link href={`/order-details/${field.id}`}>
                    <a href={`/order-details/${field.id}`}>
                    <div className="text-sm font-medium text-gray-900">ID: {field.id}</div>
                    <div className="text-sm text-gray-500">#ORDER: {field.payment_id}</div>
                    </a>
                </Link>
                </div>

                </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-sm text-gray-600">{field.amount} <span className="text-sm text-gray-900">{field.currency_id}</span></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/order-details/${field.id}`}>
                    <a href={`/order-details/${field.id}`}>
                    <div className="text-sm text-gray-900">{field.to_address.substr(0, 19)}...</div>
                    </a>
                </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={field.status ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"}>
                    {field.status ? 'Paid' : 'Pendent'}
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

    </Layout>
  )
}