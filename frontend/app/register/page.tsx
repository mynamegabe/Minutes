"use client";

import { title } from "@/components/primitives";
import "@/styles/globals.css";
import { useState } from "react";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import config from "@/config"

export default function RegisterPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
  
	async function handleRegister(e) {
	  e.preventDefault()
	  const res = await fetch(`${config.API_URL}/register`, {
		  method: 'POST',
		  credentials: 'include',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ username, password })
	  })
	  const data = await res.json()
	  console.log(data)
	  if (data.status === "error") {
		  setError(data.msg)
	  } else {
		  setError('')
		//   navigate('/login')
		window.location.href = "/login"
	  }
  }
	return (
	  <section className="">
	<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
		  Minutes    
		</a>
		<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
			<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
					Create an account
				</h1>
				{error && <span className="text-sm text-red-800">{error}</span>}
				<form className="space-y-4 md:space-y-6" action="#">
					<div>
					<div className="mb-2 block">
			<Label htmlFor="username" value="Your username" />
		  </div>
		  <TextInput id="username" type="username" placeholder="Username" onChange={(event) => setUsername(event.target.value)} required />
					</div>
					<div>
					<div className="mb-2 block">
			<Label htmlFor="username" value="Your password" />
		  </div>
		  <TextInput id="password" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} required />
					</div>
				  
				  
					<button onClick={handleRegister} className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
					<p className="text-sm font-light text-gray-500 dark:text-gray-400">
						Already have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
					</p>
				</form>
			</div>
		</div>
	</div>
  </section>
	)
}
