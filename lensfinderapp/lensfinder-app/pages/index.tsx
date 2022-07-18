import React, { useState, useEffect } from "react";
import {
  client, getProfiles
} from './api/api'
import commonNamesWords from '../public/common-names-and-words.json' assert {type: 'json'};

export default function LensFinder() {

  const amountOfRandomHandles = 6

  const validHandleRegex = RegExp(
    '([a-z\-\_0-9])'
  );

  const [lenshandle, setLenshandle] = useState('');
  const [lensAvailable, setLensAvailable] = useState(Boolean)
  const [randomAvailableHandles, setRandomAvailableHandles] = useState([])
  const [errors, setErrors] = useState({
    inputMessage: ''
  })
  const [searchError, setSearchError] = useState('')
  const [searchSuccess, setSearchSuccess] = useState('')
  const [refreshEffect, setRefreshEffect] = useState(false)
  const [loadingRandomHandles, setLoadingRandomHandles] = useState(true)

  useEffect(() => {
    getRandomLensHandles(amountOfRandomHandles);
  }, []);

  const isHandleAvailable = async (input: string) => {
    const handle = input + '.lens';
    try {
      const response = await client.query(getProfiles, { handle }).toPromise()
      if (response.data.profile===null) {
        return true;
      } else {
        return false;
      }
    } catch (err) {

    }
  }

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    const inputHandle = event.currentTarget.value.toLowerCase()
    // Validate that there are no invalid characters
    setLenshandle(inputHandle);
    if(inputHandle.length!==0) {
      errors.inputMessage = validHandleRegex.test(inputHandle) 
      ? ''
      : 'Handle only supports lower case characters, numbers, - and _.';
    } else {
      errors.inputMessage = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // alert('A name was submitted: ' + lenshandle);
    // Prevent page from reloading
    event.preventDefault();

    // Input validation
    if( lenshandle.length < 5 || lenshandle.length > 31 ) {
      // alert("Invalid Handle! Handle must be minimum of 5 length and maximum of 31 length") 
      setLensAvailable(false)
      setSearchError("Whoa buddy.. Handle must be minimum of 5 length and maximum of 31 length")
    } else {
      // Query lens
      let response = await isHandleAvailable(lenshandle)
      if (response) {
        setSearchError('')
        setLensAvailable(true)
        setSearchSuccess('Hey! '+lenshandle+'.lens is Available!')
        // alert("This handle is available!")
      } else {
        setSearchSuccess('')
        setLensAvailable(false)
        setSearchError("Bummer... " + lenshandle + ".lens is not available.");
        // alert("This handle is not available :(")
      }
    }
  } 

  const getRandomLensHandles = async (amount: number) => {
    setLoadingRandomHandles(true)
    let randomNames : String[] = []
    let max = commonNamesWords.commonNamesAndWords.length;
    let count = 0;
    while(count < amount) {
      let random = Math.floor(Math.random() * (max - 0) + 0);
      let name = commonNamesWords.commonNamesAndWords[random].toLowerCase();
      const response = await isHandleAvailable(name);
      if(response) {
        randomNames.push(name);
        count++;
      }
    }
    setRandomAvailableHandles(randomNames);
    setLoadingRandomHandles(false)
  }

  const refreshClick = async () => {
    setRefreshEffect(true)
    getRandomLensHandles(amountOfRandomHandles)
    await new Promise(r => setTimeout(r, 1500));
    setRefreshEffect(false)
  }

  return (
    <div>
      <div className="bg-violet-900">
        <div className="flex flex-wrap justify-center p-4">
          <div className="px-4 align-center ">
            <img src="/Lensfinder.png" alt="..." className="shadow rounded max-w-md h-40 align-center border-none" />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col justify-center overflow-hidden bg-gray-50 py-1 sm:py-2 ">
        <div className="mx-auto max-w-lg">
          <div className="text-center pt-10">
            <span className="font-sans text-xl font-semi-bold">Find an available lens handle:</span>
          </div>
          <form className="w-full max-w-lg pt-3" onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-green-500 py-2">
              <label>
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 leading-tight focus:outline-none text-right lowercase" 
                  type="text" value={lenshandle} placeholder="vitalik"
                  onChange={handleChange} />
              </label>
              <span className="flex-shrink-0 text-md font-bold py-1 pr-10">.lens</span>
              <button className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-4 rounded" type="submit" >
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </div>
            {errors.inputMessage.length > 0 && 
              <span className='error mt-2 text-sm text-red-600 dark:text-red-500'>{errors.inputMessage}</span>}
          </form>
        </div>
        <div className="mx-auto max-w-lg p-4">
          { searchSuccess.length > 0 &&
            <div className="p-4 mb-4 text-lg tracking-wide	text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
              {searchSuccess}
            </div>
          }
          {
           searchError.length>0 &&
            <div className="p-4 mb-4 text-lg tracking-wide text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800">
              {searchError}
            </div>
          }
        </div>
      </div>
      <div className="relative flex flex-col justify-center overflow-hidden bg-gray-50 py-2 sm:py-2">
        <div className="mx-auto max-w-md">
          <div className="divide-y divide-gray-300/50">
            <span className="p-4">Here's some random handles available:</span>
            <button type="button" onClick={refreshClick}
                className={`${loadingRandomHandles && 'invisible'} inline-flex items-center justify-center w-auto px-3 py-2 space-x-2 text-sm font-small text-white transition 
                  bg-violet-700 border border-violet-700 rounded appearance-none cursor-pointer select-none hover:border-violet-800 
                  hover:bg-violet-800 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 
                  disabled:pointer-events-none disabled:opacity-75`}>
                <span>Refresh</span>
            </button>
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
            {
              loadingRandomHandles && 
              <div className="flex justify-center items-center">
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            }
              <ul className={`${loadingRandomHandles && `hidden`} grid grid-cols-2 gap-2`}>
                  {randomAvailableHandles.map((item:string, index:number) => 
                      <li className="flex items-center p-5 max-w-sm rounded overflow-hidden shadow-lg" key={index}>
                        <svg className="h-6 w-6 flex-none fill-green-100 stroke-green-500 stroke-2 animate-pulse" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="11" />
                          <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                        </svg>
                        <p className="ml-4">
                          {item}<span className="text-md font-bold text-gray-900">.lens</span>
                        </p>
                      </li>
                      
                  )}
              </ul>          
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}