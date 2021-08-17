export default function AccountForm (props: any) {
    return (
      <>
        <div className="col-span-6 px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-3 text-gray-900">Account Settings</h3>
            <p className="mt-1 text-sm text-gray-600">Account settings and options.</p>
        </div>      
        <div className="col-span-6">
        <label htmlFor="nextauthUsername" className="block text-sm font-medium text-gray-700">
        Admin Username
        </label>
        <input
        id='nextauthUsername'
        type='text'
        autoComplete='username'
        placeholder='harmonypay'
        {...props.register("nextauthUsername", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-6">
        <label htmlFor="nextauthPassword" className="block text-sm font-medium text-gray-700">
        Password
        </label>
        <input
        id='nextauthPassword'
        type='password'
        placeholder='Password'
        autoComplete='current-password'
        {...props.register("nextauthPassword", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
        <div className="col-span-6">
        <label htmlFor="secret" className="block text-sm font-medium text-gray-700">
        Auth Secret
        </label>
        <input
        id='secret'
        type='text'
        placeholder='...'
        {...props.register("secret", { required: true })}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        </div>
      </>
    )
  }