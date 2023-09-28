import React, { useState } from "react"
import Header from "../components/Header"
import SwapForm from "../components/SwapForm"

const MainPage = () => {
    const [page, setPage] = useState("Swap")
    return (
        <div className="background">
            <Header />
            <div className="flex w-full justify-center">
                <div className="flex flex-col w-[30%] h-[40vh] mt-48 p-2 justify-start items-center border rounded-xl bg-pink-600">
                    <div className="flex flex-row w-full">
                        <button
                            onClick={(e) => setPage("Swap")}
                            className={`px-4 py-1 mx-3 font-extrabold text-2xl border rounded-full hover:text-white ${
                                page === "Swap" ? "bg-sky-700 text-white" : "hover:bg-sky-900"
                            }`}
                        >
                            Swap
                        </button>
                        <button
                            onClick={(e) => setPage("Buy")}
                            className={`px-4 py-1 font-extrabold text-2xl border rounded-full hover:text-white ${
                                page === "Buy" ? "bg-sky-700 text-white" : "hover:bg-sky-900 bg-white"
                            }`}
                        >
                            Buy
                        </button>
                    </div>
                    {page === "Swap" ? <SwapForm /> : <div>Wallet</div>}
                </div>
            </div>
        </div>
    )
}

export default MainPage
