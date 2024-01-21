"use client";

import { title } from "@/components/primitives";
import "@/styles/globals.css";
import { useState } from "react";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import config from "@/config"
import "@/styles/globals.css";
import { SwatchBook } from 'lucide-react';
import React from 'react';

export default function LoginPage() {
	// const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await fetch(`${config.API_URL}/login`, {
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
            // navigate('/editor')
			window.location.href = "/editor"
        }
    }

    return (
        <>
        {/* <Nav /> */}
            <section className="w-full h-full">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 w-full">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <SwatchBook size={40} />
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#070305] dark:border-white">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-left font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        {error && <p className="text-sm text-left text-red-800">{error}</p>}
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                            <div className="mb-2 block text-left">
								<Label htmlFor="username" value="Your username" />
								</div>
								<TextInput id="username" type="username" placeholder="Username" onChange={(event) => setUsername(event.target.value)} required
                                />
                            </div>
                            <div>
                            <div className="mb-2 block text-left">
								<Label htmlFor="password" value="Your password" />
								</div>
								<TextInput id="password" type="password" placeholder="••••••••" onChange={(event) => setPassword(event.target.value)} required />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button onClick={handleSubmit}  className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm text-left font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}
