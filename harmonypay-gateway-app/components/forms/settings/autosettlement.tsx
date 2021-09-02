export default function AutosettlementForm (props: any) {
    return (
      <>
        <div className="col-span-6 px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-3 text-gray-900">Autosettlement Settings</h3>
            <p className="mt-1 text-sm text-gray-600">Autosettlement options.</p>
        </div>
        
        <div className="col-span-6">
        <label htmlFor="settlementsCheckInterval" className="block text-sm font-medium text-gray-700">
          Auto settlement check interval 
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="number"
            id="settlementInterval"
            min="1"
            {...props.register("settlementInterval", { value: 6, required: true })}
            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            placeholder="6"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            minutes
          </span>          
          </div>
          </div>
        
          <div className="col-span-6">
          <label htmlFor="settlementBinanceMin" className="block text-sm font-medium text-gray-700">
          Binance ( Minimal Settlement Amount )
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                      $
                  </span>
              </div>
              <input 
              type="text"
              id="settlementBinanceMin"
              {...props.register("settlementBinanceMin", { value: '11', required: true })}
              className="focus:ring-indigo-500 border-l border-b border-t border-gray-300 py-2 px-4 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md" 
              placeholder="11.00"/>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                      <label htmlFor="currency" className="sr-only">
                          Currency
                      </label>
                      <select id="Currency" name="currency" className="focus:ring-indigo-500 py-2 px-4 border-t border-r border-gray-300 border-b bo focus:border-indigo-500 h-full pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-r-md">
                          <option>
                              USD
                          </option>
                          {/*<option>
                              GBP
                          </option>
                          <option>
                              CAD
                          </option>
                          <option>
                              EUR
                          </option>*/}
                      </select>
                  </div>
              </div>

          </div>


          <div className="col-span-6">
          <label htmlFor="settlementCryptocomMin" className="block text-sm font-medium text-gray-700">
          Crypto.com ( Minimal Settlement Amount )
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                      $
                  </span>
              </div>
              <input 
              type="text" 
              id="settlementCryptocomMin" 
              {...props.register("settlementCryptocomMin", { value: '1', required: true })}
              className="focus:ring-indigo-500 border-l border-b border-t border-gray-300 py-2 px-4 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md" 
              placeholder="1.00"/>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                      <label htmlFor="currency" className="sr-only">
                          Currency
                      </label>
                      <select id="Currency" name="currency" className="focus:ring-indigo-500 py-2 px-4 border-t border-r border-gray-300 border-b bo focus:border-indigo-500 h-full pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-r-md">
                          <option>
                              USD
                          </option>
                          {/*<option>
                              GBP
                          </option>
                          <option>
                              CAD
                          </option>
                          <option>
                              EUR
                          </option>*/}
                      </select>
                  </div>
              </div>

          </div>

      </>
    )
}