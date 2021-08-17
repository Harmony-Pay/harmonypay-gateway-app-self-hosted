export default function DatabaseForm (props: any) {
    return (
      <>
        <div className="col-span-6 px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-3 text-gray-900">Database Settings</h3>
            <p className="mt-1 text-sm text-gray-600">Database Information.</p>
        </div>

        <div className="col-span-6">
        <label htmlFor="dbName" className="block text-sm font-medium text-gray-700">
        Database Name
        </label>
        <input
        id='dbName'
        type='text'
        placeholder='harmonypaydb'
        {...props.register("dbName", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-6">
        <label htmlFor="dbUsername" className="block text-sm font-medium text-gray-700">
        Database Username
        </label>
        <input
        id='dbUsername'
        type='text'
        placeholder='...'
        {...props.register("dbUsername", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-6">
        <label htmlFor="dbPassword" className="block text-sm font-medium text-gray-700">
        Database Password
        </label>
        <input
        id='dbPassword'
        type='password'
        {...props.register(" dbPassword", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-6 sm:col-span-4 lg:col-span-4">
        <label htmlFor="dbHost" className="block text-sm font-medium text-gray-700">
        Database Host
        </label>
        <input
        id='dbHost'
        type='text'
        placeholder='localhost'
        {...props.register("dbHost", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-6 sm:col-span-2 lg:col-span-2">
        <label htmlFor="dbPort" className="block text-sm font-medium text-gray-700">
        Database Port
        </label>
        <input
        id='dbPort'
        type='text'
        placeholder='5432'
        {...props.register("dbPort", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>                        

      </>
    )
}