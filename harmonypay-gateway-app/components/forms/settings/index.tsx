import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "../../utils/alert";
import { useForm } from "react-hook-form";
import {
    BriefcaseIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    CurrencyDollarIcon,
    LinkIcon,
    LocationMarkerIcon,
    PencilIcon,
  } from '@heroicons/react/solid';

import GeneralForm from "./general";
import AccountForm from "./account";
import WordpressForm from "./wordpress";
import DatabaseForm from "./database";
//import NotificationForm from "./notification";
//import AutosettlementForm from "./autosettlement";

type FormInputs = {
  NodeEnv: string
  LogLevel: string
  networkMode: string
  apiServer: string
  nextauthUrl: string
  nextauthUsername: string
  nextauthPassword: string
  secret: string
  wpSiteUrl: string
  woocommerceWebhookUrl: string
  woocommerceSignatureSecret: string
  dbHost: string
  dbPort: string
  dbName: string
  dbUsername: string
  dbPassword: string
}

function FormSettings(props: FormInputs) {
    // defining the initial state for the form
    const initialState = {...props}

    const { register, handleSubmit, setValue } = useForm<FormInputs>();
    const [ settingform , setSettingForm ] = useState('general');

    // a submit function that will execute upon form submission
    const onSubmit = (data: FormInputs) => { 
        // send "values" to database
        //console.log(data);

        axios.post(`/api/v1/admin/settings/save`, data)
          .then((response: any) => {
              //access the resp here....
              //var payload = response.statusText;
              //console.log(`Settings saved: ${payload}`);
              Alert('success', 'Settings saved...', 'Settings saved with success...');
          })
          .catch((error: any) => {
              Alert('error', 'ERROR...', "OOPS that didn't work :(");
          });
    }

    //console.log(initialState)

    if (props) {
      for (let [key, value] of Object.entries(props)) {
          //console.log(`${key}: ${value}`)
          //initialState[key] = value
          let myKey: any = key as any;
          if (key === 'metamask_abi')
              setValue(myKey, JSON.stringify(value,null,2))
          else
              setValue(myKey, value)
      }
  }

    const setActiveForm = (form_type: string) => {
      setSettingForm(form_type);
      return form_type;
    }

    const setTabClass = (active: boolean) => {
      if (active){
        return `w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;
      } else {
        return `w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
      }
    }

    useEffect(()=>{
      if (settingform) { setSettingForm(settingform) }
    },[settingform])

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0 mt-6 mb-6">
                <h3 className="text-lg font-medium leading-3 text-gray-900">Payment Gateway Settings</h3>
                <p className="mt-1 text-sm text-gray-600">Application settings and options.</p>
            </div>

            <div className="px-4 sm:px-0 mb-3">
              <p className="mt-1 text-sm text-gray-600">
              <span>
                <button
                    type="button"
                    onClick={() => setSettingForm('general')}
                    className={settingform === 'general' ? setTabClass(true) : setTabClass(false)}                
                >
                    <CalendarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    General Settings
                </button>
                </span>
              </p>
            </div>

            <div className="px-4 sm:px-0 mb-3">
              <p className="mt-1 text-sm text-gray-600">
              <span>
                <button
                    type="button"
                    onClick={() => setSettingForm('account')}
                    className={settingform === 'account' ? setTabClass(true) : setTabClass(false)}
                >
                    <BriefcaseIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Account Settings
                </button>
                </span>
              </p>
            </div>

            <div className="px-4 sm:px-0 mb-3">
              <p className="mt-1 text-sm text-gray-600">
              <span>
                <button
                    type="button"
                    onClick={() => setSettingForm('wordpress')}
                    className={settingform === 'wordpress' ? setTabClass(true) : setTabClass(false)}
                >
                    <LinkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Wordpress Settings
                </button>
                </span>
              </p>
            </div>

            {/*<div className="px-4 sm:px-0 mb-3">
              <p className="mt-1 text-sm text-gray-600">
              <span>
                <button
                    type="button"
                    onClick={() => setSettingForm('autosettlement')}
                    className={settingform === 'autosettlement' ? setTabClass(true) : setTabClass(false)}
                >
                    <CurrencyDollarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Autosettlement Settings
                </button>
                </span>
              </p>
            </div>*/}

            <div className="px-4 sm:px-0 mb-3">
              <p className="mt-1 text-sm text-gray-600">
              <span>
                <button
                    type="button"
                    onClick={() => setSettingForm('database')}
                    className={settingform === 'database' ? setTabClass(true) : setTabClass(false)}                
                >
                    <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Database Settings
                </button>
                </span>
              </p>
            </div>

            {/*<div className="px-4 sm:px-0 mb-3">
              <p className="mt-1 text-sm text-gray-600">
              <span>
                <button
                    type="button"
                    onClick={() => setSettingForm('notification')}
                    className={settingform === 'notification' ? setTabClass(true) : setTabClass(false)}                
                >
                    <CalendarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Notification Settings
                </button>
                </span>
              </p>
            </div>*/}

          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    {settingform === 'account' && <AccountForm register={register} /> }
                    {settingform === 'general' && <GeneralForm register={register} /> }
                    {settingform === 'wordpress' && <WordpressForm register={register} setValue={setValue} /> }
                    {/*settingform === 'autosettlement' && <AutosettlementForm register={register} />*/ }
                    {settingform === 'database' && <DatabaseForm register={register} /> }
                    {/*settingform === 'notification' && <NotificationForm register={register} />*/ }
                  </div>
                </div>
          </div>
          </div>
      </div>
      <div className="shadow overflow-hidden mt-6 sm:rounded-md">
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </div>
        </div>
        </form>
    );
}

export default FormSettings;