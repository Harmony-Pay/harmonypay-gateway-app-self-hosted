import { Alert } from "../utils/alert"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/router'
import axios from "axios";

type FormInputs = {
    id: string
    symbol: string
    name: string
    address_length: string
    decimal_precision: string
    token_group: string
    contract: string
    contract_testnet: string
    erc20: string
    hrc20: string
    metamask_abi: string
    metamask_currency: string
    metamask_gas: string
    metamask_gas_limit: string
    wp_plugin_open_in_wallet: string
    active: string
}

function FormSettings(props: FormInputs){
    // defining the initial state for the form
    const initialState = {...props}
    const router = useRouter()
    const { register, handleSubmit, setValue } = useForm<FormInputs>()

    // a submit function that will execute upon form submission
    const onSubmit = (data: FormInputs) => { 
        // send "values" to database
        //console.log(data);
        //Alert('success', 'Settings saved...', 'Settings saved with success!')
        axios.post(`/api/v1/admin/coin/save`, data)
          .then((response: any) => {
              //access the resp here....
              var payload = response.statusText;
              //console.log(`Settings saved: ${payload}`);
              Alert('success', 'Coin saved...', 'Coin information saved with success...');
              router.push('/coins')
          })
          .catch((error: any) => {
              Alert('error', 'ERROR...', "OOPS that didn't work :(");
          });        
    }

    if (props) {
        for (let [key, value] of Object.entries(props)) {
            //console.log(`${key}: ${value}`)
            //initialState[key] = value
            let myKey: any = key as any;
            if (key === 'metamask_abi'){
                setValue(myKey, JSON.stringify(value,null,2))
            } else {
                setValue(myKey, value)
            }
        }
    }

    return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>


      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:gap-6">

          <div className="mt-5 md:mt-0">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">

                <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                Symbol
                </label>
                <input
                type="text"
                id="symbol"
                placeholder="Currency Symbol"
                {...register("symbol", { required: true })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="col-span-6 sm:col-span-4 lg:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
                </label>
                <input
                type="text"
                id="name"
                placeholder="Coin name"
                {...register("name", { required: true })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                <label htmlFor="address_length" className="block text-sm font-medium text-gray-700">
                Address Length
                </label>
                <input
                type="number"
                id="address_length"
                {...register("address_length", { required: true })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                <label htmlFor="decimal_precision" className="block text-sm font-medium text-gray-700">
                Decimal Precision
                </label>
                <input
                type="number"
                id="decimal_precision"
                {...register("decimal_precision", { required: true })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                <label htmlFor="token_group" className="block text-sm font-medium text-gray-700">
                Group
                </label>
                <select
                id="token_group"
                autoComplete="token_group"
                {...register("token_group", { required: true })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                <option>Main blockchains</option>
                <option>HRC20 Tokens</option>
                <option>ERC20 Tokens</option>
                <option>BEP-2 Tokens</option>
                </select>
            </div>

            <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                <label htmlFor="contract" className="block text-sm font-medium text-gray-700">
                [ <strong className="text-green-500">MAINNET</strong> ] Contract Address
                </label>
                <input
                type="text"
                id="contract"
                placeholder="Contract address [MAINNET]"
                {...register("contract", { required: false })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="col-span-6">
                <label htmlFor="metamask_abi" className="block text-sm font-medium text-gray-700">
                Contract ABI
                </label>
                <div className="mt-1">
                <textarea
                    id="metamask_abi"
                    rows={9}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Contract ABI json description"
                    {...register("metamask_abi", { required: false })}
                />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                Contract ABI json description
                </p>
                </div>

            <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                <label htmlFor="contract_testnet" className="block text-sm font-medium text-gray-700">
                [ <strong className="text-red-500">TESTNET</strong> ] Contract Address
                </label>
                <input
                type="text"
                id="contract_testnet"
                placeholder="Contract address [TESTNET]"
                {...register("contract_testnet", { required: false })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>

            {/*<div className="col-span-6 sm:col-span-2 lg:col-span-2">
                <label htmlFor="metamask_currency" className="block text-sm font-medium text-gray-700">
                Wallet Symbol
                </label>
                <input
                type="text"
                id="metamask_currency"
                defaultValue="ETH"
                {...register("metamask_currency", { required: false })}
                readOnly
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>*/}
            <div className="col-span-6 sm:col-span-2 lg:col-span-3">
                <label htmlFor="metamask_gas" className="block text-sm font-medium text-gray-700">
                Gas price
                </label>
                <input
                type="text"
                id="metamask_gas"
                {...register("metamask_gas", { value: '0', required: false })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="col-span-6 sm:col-span-2 lg:col-span-3">
                <label htmlFor="metamask_gas_limit" className="block text-sm font-medium text-gray-700">
                Gas limit
                </label>
                <input
                type="text"
                id="metamask_gas_limit"
                {...register("metamask_gas_limit", { value: '0', required: false })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>

            <div className="col-span-6">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input
                        id="erc20"
                        type="checkbox"
                        {...register("erc20", { required: false })}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="erc20" className="font-medium text-gray-700">
                    Is ERC20 Token?
                    </label>
                    <p className="text-gray-500">erc20 description</p>
                    </div>
                </div>
                </div>
            <div className="col-span-6">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input
                        id="hrc20"
                        type="checkbox"
                        {...register("hrc20", { required: false })}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="hrc20" className="font-medium text-gray-700">
                    Is HRC20 Token?
                    </label>
                    <p className="text-gray-500">hrc20 description</p>
                    </div>
                </div>
            </div>

            <div className="col-span-6">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input
                        id="wp_plugin_open_in_wallet"
                        type="checkbox"
                        {...register("wp_plugin_open_in_wallet", { required: false })}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="wp_plugin_open_in_wallet" className="font-medium text-gray-700">
                    Open in wallet
                    </label>
                    <p className="text-gray-500">wp_plugin_open_in_wallet description</p>
                    </div>
                </div>
                </div>
            <div className="col-span-6">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input
                        id="active"
                        type="checkbox"
                        {...register("active", { required: false })}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="active" className="font-medium text-gray-700">
                    Active
                    </label>
                    <p className="text-gray-500">active description</p>
                    </div>
                </div>
                </div>

                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
      
          </div>
        </div>
      </div>

        </form>
    );
}

export default FormSettings;