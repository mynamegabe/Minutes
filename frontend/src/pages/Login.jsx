import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { Nav } from '../components/Navbar'
import config from '../config'

export function Login() {
    const navigate = useNavigate()
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
            navigate('/editor')
        }
    }

    return (
        <>
        {/* <Nav /> */}
            <section className="">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Minutes    
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
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
                    <Label htmlFor="password" value="Your password" />
                    </div>
                    <TextInput id="password" type="password" placeholder="••••••••" onChange={(event) => setPassword(event.target.value)} required />

                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label for="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button onClick={handleSubmit}  className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
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