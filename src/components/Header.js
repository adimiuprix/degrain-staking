import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { GlobalContext } from "./../context/GlobalContext";
import StakeABI from './../abi/staking.json'
import tokenABI from './../abi/token.json'
import CONFIG from "./../abi/config";
import MobileMenu from "./MobileMenu";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

import logo from './../assets/logo.png'

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, 
    options: {
      appName: "Degrain Staking",
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID 
    }
  }, 
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
    }
  }
};

const Header = ({ setError, setErrMsg }) => {
  const { account, web3Provider, updateAccount, updateStakedBalance, updateRewardBalance, updateTokenBalance, updateWeb3Provider, fetchAccountData } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false)

  const handleWalletConnect = async () => {
    console.log('asdada')
    const web3modal = new Web3Modal({
      providerOptions
    });
    const instance = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    updateWeb3Provider(provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    updateAccount(address);
    const network = await provider.getNetwork();
    console.log(network)
    if (network.chainId !== CONFIG.chainId) {
      setError(true)
      setErrMsg(`Contract is not deployed on current network. please choose ${CONFIG.networkName}`)
    } else {
      setError(false)
      setErrMsg('')
      fetchAccountData(provider)
      // loadAccountData(signer, address)
    }
  };

  const disconnectWallet = () => {
    updateAccount(null)
    updateStakedBalance({
      plan0: null,
      plan1: null,
      plan2: null,
      plan3: null,
      plan4: null
    })
    updateRewardBalance({
      plan0: null,
      plan1: null,
      plan2: null,
      plan3: null,
      plan4: null
    })
    updateTokenBalance(null)
    updateWeb3Provider(null)
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        updateAccount(accounts[0])
        fetchAccountData(web3Provider)
      })
      window.ethereum.on('chainChanged', chainId => {
        window.location.reload();
      })
    }
  }, [account]);

  return (
    <div className="container mx-auto md:max-w-5xl px-4 font-Poppins">
      {/* <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} account={account} setError={setError} setErrMsg={setErrMsg} loadAccountData={fetchAccountData} /> */}
      <div className="header flex items-center justify-between space-x-20 min-h-[8rem]">
        <div className="w-32 p-4 pl-0">
          <img
            src={logo}
            alt="Degrain"
          />
        </div>
        <div className="hidden md:flex">
          {account ? (
            <button
              className="py-2 px-6 ml-4 text-white border border-white rounded-lg truncate font-medium transition ease-in-out duration-300 hover:border-[#ed329b]"
              onClick={disconnectWallet}
            >
              {account.slice(0, 5) + '...' + account.slice(37, 42)}
          
            </button>
          ) : (
            <button
              className="py-2 px-6 ml-4 text-white border border-white rounded-lg truncate font-medium transition ease-in-out duration-300 hover:border-[#ed329b]"
              onClick={handleWalletConnect}
            >
              Connect Wallet

            </button>
          )}
        </div>
        <div className="flex md:hidden" >
          {account ? (
            <button onClick={disconnectWallet}>
              <div>
              <svg className="w-8 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"/></svg>
              </div>
            </button>
          ) : (
            <button onClick={handleWalletConnect}>
              <div>
                <svg
                  className="w-8 fill-white transition ease-in-out duration-300 group-hover:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M448 32C465.7 32 480 46.33 480 64C480 81.67 465.7 96 448 96H80C71.16 96 64 103.2 64 112C64 120.8 71.16 128 80 128H448C483.3 128 512 156.7 512 192V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H448zM416 336C433.7 336 448 321.7 448 304C448 286.3 433.7 272 416 272C398.3 272 384 286.3 384 304C384 321.7 398.3 336 416 336z" />
                </svg>
              </div>
            </button>
          )}
        </div>


      </div>
    </div>
  );
};

export default Header;
