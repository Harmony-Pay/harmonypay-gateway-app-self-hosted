export default function GeneralForm (props: any) {
    return (
      <>
        <div className="col-span-6 px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-3 text-gray-900">General Settings</h3>
            <p className="mt-1 text-sm text-gray-600">General settings and options.</p>
        </div>

        <div className="col-span-6 mb-3">
        <label htmlFor="nextauthUrl" className="block text-sm font-medium text-gray-700">
        HarmonyPay Gateway URL
        </label>
        <input
        id='nextauthUrl'
        type='text'
        placeholder='https://api.harmonypay.one'
        {...props.register("nextauthUrl", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>

        <div className="col-span-6 mb-3">
            <label htmlFor="networkMode" className="block text-sm font-medium text-gray-700">
            Harmony Network Mode
            </label>
            <select
            id="networkMode"
            autoComplete="networkMode"
            {...props.register("networkMode", { value: "testnet", required: true })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <option value="mainnet">Mainnet</option>
            <option value="testnet">Testnet</option>
            </select>
        </div>

      </>
    )
}