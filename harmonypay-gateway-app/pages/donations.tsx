import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import Link from "next/link"
import AccessDenied from '../components/access-denied'


export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(new Array())

  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
        const res = await fetch('/api/v1/admin/donations')
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
    <h1 className="font-bold text-xl mb-3">Donations</h1>
    <div className="mt-6 col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-gray-200">
        <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Latest Donations</h2>
        </header>

        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        To Address
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                <Link href={`/donation-details/${field.id}`}>
                                                <a href={`/donation-details/${field.id}`}>
                                                <svg className="flex-shrink-0 h-6 w-6 mr-1" viewBox="0 0 24 24">
                                                <path className="fill-current text-gray-600 false" d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z">
                                                </path>
                                                <path className="fill-current text-gray-400 false" d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z">
                                                </path>
                                                </svg>
                                                </a>
                                                </Link>
                                            </div>
                                            <div className="ml-0">
                                                <Link href={`/donation-details/${field.id}`}>
                                                <a href={`/donation-details/${field.id}`}>
                                                    <div className="text-sm font-medium text-gray-900">ID #{field.id}</div>
                                                    <div className="text-xs font-medium text-gray-600"># {field.transaction_id.substr(0, 19)}...</div>
                                                </a>
                                                </Link>
                                            </div>

                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="text-sm text-gray-600">{field.amount} <span className="text-sm text-gray-900">{field.currency_id}</span></div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{field.to_address.substr(0, 19)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={field.status
                                            ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                            : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                                            }>
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