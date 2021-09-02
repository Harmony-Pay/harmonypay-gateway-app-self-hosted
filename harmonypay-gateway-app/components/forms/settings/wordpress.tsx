import {CheckIcon} from '@heroicons/react/solid'
import { nanoid } from 'nanoid'

function generateSecretKey(name: string, setValue: any): void {
    return setValue(name, nanoid(36), { shouldValidate: true })
}

export default function WordpressForm (props: any) {
    return (
      <>
        <div className="col-span-6 px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-3 text-gray-900">Woocommerce Settings</h3>
            <p className="mt-1 text-sm text-gray-600">Wordpress and WooCommerce settings.</p>
        </div>

        <div className="col-span-6 mb-3">
        <label htmlFor="wpSiteUrl" className="block text-sm font-medium text-gray-700">
        Wordpress/WooCommerce Site URL
        </label>
        <input
        id='wpSiteUrl'
        type='text'
        placeholder='https://my-wordpress-store'
        {...props.register("wpSiteUrl", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>

        <div className="col-span-6">
        <label htmlFor="woocommerceWebhookUrl" className="block text-sm font-medium text-gray-700">
        Woocommerce Webhook URL
        </label>
        <input
        id='woocommerceWebhookUrl'
        type='text'
        placeholder='.../harmony-pay/v1/webhook'
        {...props.register("woocommerceWebhookUrl", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>      

        <div className="col-span-5">
        <label htmlFor="woocommerceSignatureSecret" className="block text-sm font-medium text-gray-700">
        Webhook Signature Secret
        </label>
        <input
        id='woocommerceSignatureSecret'
        type='text'
        placeholder='Your Signature Secret'
        {...props.register("woocommerceSignatureSecret", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-1 mt-6">
        <button
          type="button"
          onClick={() => generateSecretKey("woocommerceSignatureSecret", props.setValue)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <CheckIcon className="h-5 w-5" aria-hidden="true" />
        </button>    
        </div> 
      </>
    )
}