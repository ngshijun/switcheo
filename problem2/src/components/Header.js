import React from "react"
import logo from "../assets/images/switcheo-logo.png"

const Header = () => {
    return (
        <div className="flex justify-between h-16 w-full">
            <img className="p-2 items-center" src={logo} alt="Switcheo" />
            <div className="p-2 items-center flex">
                <div className="w-32 p-3 border rounded-full items-center mx-2 bg-slate-600 hover:bg-slate-700">
                    <button className="font-extrabold text-white text-lg">Swap</button>
                </div>
                <div className="w-32 p-3 border rounded-full items-center mx-2 bg-slate-600 hover:bg-slate-700">
                    <button className="font-extrabold text-white text-lg">Wallet</button>
                </div>
                <div className="w-32 p-3 border rounded-full items-center mx-2 bg-slate-600 hover:bg-slate-700">
                    <button className="font-extrabold text-white text-lg">Connect</button>
                </div>
            </div>
        </div>
    )
}

export default Header
