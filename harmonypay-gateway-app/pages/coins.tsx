import { useState, useEffect } from 'react'
import axios from "axios";
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import Link from "next/link"
import { useRouter } from 'next/router'
import AccessDenied from '../components/access-denied'
import { Alert, ConfirmAlert } from "../components/utils/alert";

const removeEntry = async (id: any) => {

  return await axios.post(`/api/v1/admin/coin/remove/${id}`)
    .then((response: any) => {
        //access the resp here....
        console.log(`Status Coin : ${response.data}`)
        //Alert('success', 'Coin removed...', `Coin removed with success...`);
        //return response.data;
    })
    .catch((error: any) => {
        //console.log(error);
        Alert('error', 'ERROR...', error)
    })

}

const confirmRemove = async (id: any, router: any) => {

  ConfirmAlert('warning', 'Remove Coin?', `Are you sure you want to remove this coin?`, 'OK', 
  'Coin removed...', `Coin removed with success...`, 'success', async () => await removeEntry(id), router)

}


export default function Page (props: any) {
  const [ session, loading ] = useSession()
  const [ content , setContent ] = useState(new Array())
  const router = useRouter()
  // Fetch content from protected route
  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch('/api/v1/admin/coins')
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
      <h1 className="font-bold text-xl mb-3">Coins Management</h1>
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
                    Name
                  </th>
                  {/*<th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>*/}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Group
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Update</span>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {content && content.map((coin: any) => (
                  <tr key={coin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                        <Link href={`/coin-details/${coin.id}`}>
                          <a href={`/coin-details/${coin.id}`}>
                          <img className="h-10 w-10 rounded-full" src={coin.token_image ? coin.token_image : `/coins/${coin.symbol}.png`} alt={coin.name} />
                          </a>
                        </Link>
                        </div>
                        <div className="ml-4">
                        <Link href={`/coin-details/${coin.id}`}>
                          <a href={`/coin-details/${coin.id}`}>
                          <div className="text-sm font-medium text-gray-900">{coin.symbol}</div>
                          <div className="text-sm text-gray-500">{coin.name}</div>
                          </a>
                          </Link>
                        </div>

                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={coin.active ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"}>
                        {coin.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.token_group}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                    <Link href={`/coin-details/${coin.id}`}>
                      <button type="button" className="py-1 px-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                        Update
                      </button>
                    </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" onClick={() => confirmRemove(coin.id, router)} className="py-1 px-2 flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 w-7 h-7 rounded-lg">X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right">
      <Link href={`/new-coin`}>
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Coin
        </button>
      </Link>  
      </div> 
    </div>
    </Layout>
  )
}