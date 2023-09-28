import React, { useState } from "react"
import { useEffect } from "react"
import Modal from "react-modal"
import CloseButton from "./CloseButton"

Modal.setAppElement("#root")

const SwapForm = () => {
    const [isInnerOpen, setIsInnerOpen] = useState(false)
    const [rate, setRate] = useState([])
    const [currencyImage, setCurrencyImage] = useState([])
    const [filteredCurrencyImage, setFilteredCurrencyImage] = useState([])
    const [inputCurrency, setInputCurrency] = useState("USD")
    const [outputCurrency, setOutputCurrency] = useState("USD")
    const [inputClick, setInputClick] = useState(false)
    const [outputClick, setOutputClick] = useState(false)
    const [inputAmount, setInputAmount] = useState(0)
    const [outputAmount, setOutputAmount] = useState(0)
    const [inputAmountModify, setInputAmountModify] = useState(false)
    const [outputAmountModify, setOutputAmountModify] = useState(false)
    const [inputCurrencyModify, setInputCurrencyModify] = useState(false)
    const [outputCurrencyModify, setOutputCurrencyModify] = useState(false)
    const [isBusy, setIsBusy] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        setIsBusy(true)
        let url = "https://interview.switcheo.com/prices.json"
        const fetchData = async () => {
            try {
                const response = await fetch(url)
                const rateData = await response.json()
                setRate(rateData)

                const currencyList = [
                    ...new Set(rateData.map((x) => x.currency)),
                ]

                const fetchPromises = currencyList.map(async (x) => {
                    try {
                        const currencyResponse = await fetch(
                            `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${x}.svg`
                        )
                        const currencySvg = await currencyResponse.text()
                        setCurrencyImage((prev) => [...prev, [currencySvg, x]])
                        setFilteredCurrencyImage((prev) => [
                            ...prev,
                            [currencySvg, x],
                        ])
                    } catch (error) {
                        console.error("Error fetching currency SVG:", error)
                    }
                })

                await Promise.all(fetchPromises)
                setIsBusy(false)
            } catch (error) {
                console.error("Error fetching prices:", error)
                setIsBusy(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (inputAmount != 0) {
            setOutputAmount(
                (
                    (inputAmount /
                        rate.filter((x) => x.currency == inputCurrency)[0]
                            .price) *
                    rate.filter((x) => x.currency == outputCurrency)[0].price
                ).toFixed()
            )
        } else {
            setOutputAmount(0)
        }
    }, [inputAmountModify, inputCurrencyModify])

    useEffect(() => {
        if (outputAmount != 0) {
            setInputAmount(
                (
                    (outputAmount /
                        rate.filter((x) => x.currency == outputCurrency)[0]
                            .price) *
                    rate.filter((x) => x.currency == inputCurrency)[0].price
                ).toFixed()
            )
        } else {
            setInputAmount(0)
        }
    }, [outputAmountModify, outputCurrencyModify])


    useEffect(() => {
        if (searchTerm == "") {
            setFilteredCurrencyImage(currencyImage)
        } else {
            search(searchTerm)
        }
    }, [searchTerm])

    function toggleModal() {
        setFilteredCurrencyImage(currencyImage)
        setIsInnerOpen(!isInnerOpen)
    }

    function search(value) {
        const start = value
        const end = start.replace(/.$/, (c) =>
            String.fromCharCode(c.charCodeAt(0) + 1)
        )
        let temp = currencyImage
            .filter((currency) => currency[1] >= start && currency[1] < end)
            .sort((a, b) => a[1].localeCompare(b[1]))
        setFilteredCurrencyImage(temp)
    }

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col">
                    <div className="flex flex-row border rounded-xl p-2 mb-4 mt-2 items-center justify-between bg-pink-300">
                        <div className="flex flex-col items-start">
                            <label for="input-amount" className="font-bold">
                                You pay
                            </label>
                            <input
                                className="transparant-input h-14 text-3xl w-72"
                                placeholder="0"
                                type="text"
                                value={inputAmount}
                                onChange={(e) => {
                                    setInputAmount(e.target.value)
                                    setInputAmountModify(!inputAmountModify)
                                }}
                            />
                            {isBusy ? (
                                <text>Loading</text>
                            ) : (
                                <text className="font-medium">
                                    $
                                    {(
                                        inputAmount /
                                        rate.filter(
                                            (x) => x.currency == inputCurrency
                                        )[0].price
                                    ).toFixed(2)}
                                </text>
                            )}
                        </div>
                        <div className="border rounded-full hover:bg-sky-900 hover:text-white bg-pink-400">
                            <button
                                onClick={(e) => {
                                    setInputClick(true)
                                    toggleModal()
                                }}
                                className="flex flex-row items-center"
                            >
                                {isBusy ? (
                                    <text>Loading</text>
                                ) : currencyImage.filter(
                                      (x) => x[1] == inputCurrency
                                  )[0][0] === "404: Not Found" ? (
                                    <text className="p-2">&nbsp;</text>
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: currencyImage.filter(
                                                (x) => x[1] == inputCurrency
                                            )[0][0],
                                        }}
                                        className="p-2"
                                    />
                                )}
                                <text className="pr-2 font-bold">
                                    {inputCurrency} ↓
                                </text>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-row border rounded-xl p-2 my-4 items-center justify-between bg-pink-300">
                        <div className="flex flex-col items-start">
                            <label for="output-amount" className="font-bold">
                                You receive
                            </label>
                            <input
                                className="transparant-input h-14 text-3xl w-72"
                                placeholder="0"
                                type="text"
                                value={outputAmount}
                                onChange={(e) => {
                                    setOutputAmount(e.target.value)
                                    setOutputAmountModify(!outputAmountModify)
                                }}
                            />
                            {isBusy ? (
                                <text>Loading</text>
                            ) : (
                                <text className="font-medium">
                                    $
                                    {(
                                        outputAmount /
                                        rate.filter(
                                            (x) => x.currency == outputCurrency
                                        )[0].price
                                    ).toFixed(2)}
                                </text>
                            )}
                        </div>
                        <div className="border rounded-full hover:bg-sky-900 hover:text-white bg-pink-400">
                            <button
                                onClick={(e) => {
                                    setOutputClick(true)
                                    toggleModal()
                                }}
                                className="flex flex-row items-center"
                            >
                                {isBusy ? (
                                    <text>Loading</text>
                                ) : currencyImage.filter(
                                      (x) => x[1] == outputCurrency
                                  )[0][0] === "404: Not Found" ? (
                                    <text className="p-2">&nbsp;</text>
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: currencyImage.filter(
                                                (x) => x[1] == outputCurrency
                                            )[0][0],
                                        }}
                                        className="p-2"
                                    />
                                )}
                                <text className="pr-2 font-bold">
                                    {outputCurrency} ↓
                                </text>
                            </button>
                        </div>
                    </div>
                    <button>CONFIRM SWAP</button>
                </div>
            </div>
            <Modal
                isOpen={isInnerOpen}
                onRequestClose={toggleModal}
                shouldCloseOnOverlayClick={false}
                style={{
                    overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        zIndex: "999",
                    },
                    content: {
                        position: "absolute",
                        top: "100px",
                        left: "500px",
                        right: "500px",
                        bottom: "100px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: "4px",
                        outline: "none",
                        padding: "20px",
                    },
                }}
            >
                <div className="flex flex-row justify-between pb-4">
                    <text className="font-extrabold text-2xl">
                        Select a token
                    </text>
                    <CloseButton func={toggleModal} />
                </div>
                <div className="w-full border border-black rounded-full flex flex-row">
                    <input
                        className="w-full h-14 rounded-full border border-white px-3"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        placeholder="Search name"
                    />
                </div>

                {filteredCurrencyImage.map((x) => (
                    <button
                        className="flex flex-row items-center hover:bg-gray-500 w-full m-1"
                        onClick={(e) => {
                            if (inputClick) {
                                setInputCurrency(x[1])
                                setInputClick(false)
                                setInputCurrencyModify(!inputCurrencyModify)
                            } else if (outputClick) {
                                setOutputCurrency(x[1])
                                setOutputClick(false)
                                setOutputCurrencyModify(!outputCurrencyModify)
                            }
                            toggleModal()
                        }}
                    >
                        {x[0] == "404: Not Found" ? (
                            <div className="p-2">{x[1]}</div>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{ __html: x[0] }}
                                className="p-2"
                            />
                        )}
                        <text className="font-bold text-lg">{x[1]}</text>
                    </button>
                ))}
            </Modal>
        </>
    )
}

export default SwapForm
