import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { abi } from "../constants/abi";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const injected = new InjectedConnector();

export default function Home() {
  const [hasMetamask, setHasMetamask] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  const {
    active,
    activate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }
  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    //listen for transaction to finish
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReciept) => {
        console.log(
          `Completed with ${transactionReciept.confirmations} confirmations`
        );
        resolve();
      });
    });
  }

  async function buyNFT() {
    if (active) {
      const signer = provider.getSigner();
      const contractAddress = ""; //Please enter contract address here;
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const transactionResponse = await contract.buyNFT({});
        //listen for tx to be mined
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Done!");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      {hasMetamask ? (
        active ? (
          "Connected! "
        ) : (
          <button onClick={() => connect()}>Connect</button>
        )
      ) : (
        "Please install metamask"
      )}

      {active ? <button onClick={() => buyNFT()}>mint</button> : ""}
    </div>
  );
}
