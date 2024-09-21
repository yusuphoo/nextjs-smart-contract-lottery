import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3enable } = useMoralis()
    const chainId = perseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee, //,
    })

    const { runContractFunction: getEntraceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}, //,
    })

    const { runContractFunction: getNumberOfplayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}, //,
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}, //,
    })

    async function updateUI() {
        const entranceFeeFromCall = await getEntraceFee().toString()
        const numPlayersFromcall = await getNumberOfplayers().toString()
        const recentWinnerFromcall = await getNumberOfplayers()
        setEntranceFee(entranceFeeFromCall, "ether")
        setNumPlayers(numPlayersFromcall)
        setRecentWinner(recentWinnerFromcall)
    }

    useEffect(() => {
        if (isWeb3enable) updateUI
    }, [isWeb3enable])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return
    ;<div className="p-5">
        Hi from lottery Entrance
        {raffleAddress ? (
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async function () {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                        })
                    }}
                    disabled={isFetching || isLoading}
                >
                    {isFetching || isLoading ? (
                        <div animate-spin spinner-bodder h-8 w-8 bordr-2 rounded-full></div>
                    ) : (
                        <div> Enter Raffle</div>
                    )}
                </button>
                <div> Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                <div>Number of Players: {numPlayers}</div>
                <div>Recent Winner: {recentWinner}</div>
            </div>
        ) : (
            <div>No raffleAddress Detected</div>
        )}
    </div>
}
