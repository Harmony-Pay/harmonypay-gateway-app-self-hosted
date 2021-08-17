export default function WordpressForm (props: any) {
    return (
      <>
        <div className="col-span-6 px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-3 text-gray-900">Wordpress Settings</h3>
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
        <label htmlFor="woocommerceConsumerKey" className="block text-sm font-medium text-gray-700">
        Woocommerce API Consumer Key
        </label>
        <input
        id='woocommerceConsumerKey'
        type='text'
        placeholder='...'
        {...props.register("woocommerceConsumerKey", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>      

        <div className="col-span-6">
        <label htmlFor="woocommerceConsumerSecret" className="block text-sm font-medium text-gray-700">
        Woocommerce API Consumer Secret
        </label>
        <input
        id='woocommerceConsumerSecret'
        type='text'
        placeholder='...'
        {...props.register("woocommerceConsumerSecret", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>     
      </>
    )
}