"use client";

import { toastError } from "@components/CustomToast";
import { L1_NETWORK_ID } from "@constants/index";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Address } from "viem";

const useEthers = () => {
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [chainName, setChainName] = useState<string | undefined>(undefined);
  const [account, setAccount] = useState<Address | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState<boolean>(false);
  const [ethBalance, setEthBalance] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (typeof window.ethereum === "undefined") {
        toastError("Ethereum not detected. Please install MetaMask or a compatible wallet.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        setChainName(network.name);
        // Check if accounts are available
        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          const address = accounts[0];
          setIsConnected(true);
          setAccount(address);
          signer
            .getBalance()
            .then((balance) => {
              console.log("Account Balance:", ethers.utils.formatEther(balance));
              setEthBalance(ethers.utils.formatEther(balance));
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setIsConnected(false);
          setAccount(null);
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
      }
    })();

    // Listen for changes in connected accounts
    const handleAccountsChanged = (newAccounts: string[]) => {
      if (newAccounts.length > 0) {
        const address = newAccounts[0] as Address;
        setIsConnected(true);
        setAccount(address);
      } else {
        setIsConnected(false);
        setAccount(null);
      }
    };

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum?.on("chainChanged", handleAccountsChanged);
    }

    return () => {
      // Cleanup event listener on component unmount
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleAccountsChanged);
      }
    };
  }, []);

  const connect = async () => {
    setLoadingConnect(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setIsConnected(true);
      setAccount(address);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
    setLoadingConnect(false);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
  };

  return {
    chainId,
    chainName,
    account,
    connect,
    isConnected,
    loadingConnect,
    disconnect,
    ethBalance,
    isWrongChain: chainId !== +L1_NETWORK_ID,
  };
};

export default useEthers;
