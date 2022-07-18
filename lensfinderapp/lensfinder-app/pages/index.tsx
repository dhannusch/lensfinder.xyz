import React, { useState, useEffect } from "react";
import {
  client, getProfiles
} from './api/api'
import commonNamesWords from '../public/common-names-and-words.json' assert {type: 'json'};

export default function LensFinder() {

  const amountOfRandomHandles = 10

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

  useEffect(() => {
    getRandomLensHandles(amountOfRandomHandles);
  }, []);

  const isHandleAvailable = async (handle: string) => {
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
      let response = await isHandleAvailable(lenshandle+'.lens')
      if (response) {
        setSearchError('')
        setLensAvailable(true)
        setSearchSuccess('Hey! '+lenshandle+'.lens is Available!')
        // alert("This handle is available!")
      } else {
        setLensAvailable(false)
        setSearchError("Bummer... " + lenshandle + ".lens is not available.");
        // alert("This handle is not available :(")
      }
    }
  } 

  const getRandomLensHandles = (amount: number) => {
    let randomNames : String[] = []
    let max = commonNamesWords.commonNamesAndWords.length;
    let count = 0;
    let checkcount = 1;
    while(count < amount) {
      let random = Math.floor(Math.random() * (max - 0) + 0);
      let name = commonNamesWords.commonNamesAndWords[random].toLowerCase();
      const response = isHandleAvailable(name);
      if(response) {
        randomNames.push(name);
        count++;
      }
    }
    setRandomAvailableHandles(randomNames);
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
          <form className="w-full max-w-lg pt-10" onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-green-500 py-2">
              <label>
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 leading-tight focus:outline-none text-right lowercase" 
                  type="text" value={lenshandle} placeholder="Find your lens handle   "
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
                className="inline-flex items-center justify-center w-auto px-3 py-2 space-x-2 text-sm font-medium text-white transition 
                  bg-violet-700 border border-violet-700 rounded appearance-none cursor-pointer select-none hover:border-violet-800 
                  hover:bg-violet-800 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 
                  disabled:pointer-events-none disabled:opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" className={`${refreshEffect && 'animate-spin'} w-5 h-5`} onAnimationEnd={() => setRefreshEffect(false)} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd" />
                </svg>
                <span>Refresh</span>
            </button>
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
              <ul className="grid grid-cols-2 gap-2">
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