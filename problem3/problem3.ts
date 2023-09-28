// Computational inefficiencies and anti-patterns found in the original code block:
// 1. Empty dependency array in useEffect hook, this causes the effect to only run once when the component mounts.
//      This approach is inefficient if we are intended to update the prices periodically.
// 2. The formattedBalances array is redundant.
//      We can format the balances in the rows array instead.
// 3. The sort function in the useMemo hook does not return a value when the priorities are equal.
//      This means that the order of balances with the same priority is not guaranteed.
//      We can fix this issue by simply subtracting the priorities.
// 4. Typo in some lines
//      "console.err" should be "console.error"
//      "lhsPriority" should be "balancePriority"

// Below is the refactored code block with the above issues addressed.
interface WalletBalance {
    currency: string
    amount: number
}
interface FormattedWalletBalance {
    currency: string
    amount: number
    formatted: string
}

class Datasource {
    // TODO: Implement datasource class
    url: string

    constructor(private url: string) {
        this.url = url
    }

    async getPrices(): Promise<any> {
        const response = await fetch(this.url)
        const prices = await response.json()
        return prices
    }
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props
    const balances = useWalletBalances()
    const [prices, setPrices] = useState({})

    useEffect(() => {
        const datasource = new Datasource(
            "https://interview.switcheo.com/prices.json"
        )
        datasource
            .getPrices()
            .then((prices) => {
                setPrices(prices)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case "Osmosis":
                return 100
            case "Ethereum":
                return 50
            case "Arbitrum":
                return 30
            case "Zilliqa":
                return 20
            case "Neo":
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain)
                if (balancePriority > -99) {
                    if (balance.amount <= 0) {
                        return true
                    }
                }
                return false
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                return getPriority(lhs.blockchain) - getPriority(rhs.blockchain)
            })
    }, [balances, prices])

    const rows = sortedBalances.map(
        (balance: FormattedWalletBalance, index: number) => {
            const usdValue = prices[balance.currency] * balance.amount
            return (
                <WalletRow
                    className={classes.row}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.amount.toFixed()}
                />
            )
        }
    )

    return <div {...rest}>{rows}</div>
}
