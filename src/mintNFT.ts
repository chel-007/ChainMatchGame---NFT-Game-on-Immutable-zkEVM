import './Game.css';
import { Provider, TransactionResponse } from '@ethersproject/providers';
import passportInstance from './connectPassport';
import { getDefaultProvider, Wallet } from 'ethers';
import { ERC721MintByIDClient } from '@imtbl/contracts';
import { ethers } from 'ethers';
import web3 from 'web3';



var userWallet = window.localStorage.getItem("userWalletAddress");

async function mintNFT()  {

const CONTRACT_ADDRESS = '0x7A6AAbd5cD770822287D2b46019Ef33c8A6d5aB3';
const PRIVATE_KEY = '6c0db95a49f823e7bb99de6b214c95bd7dc163907280a36a32abed1932cc07f0';

// Specify who we want to receive the minted token
const RECIPIENT = '0x7448ECCBaA2299298d3B4148B52e91C55CDD9dE8';

// Choose an ID for the new token
const TOKEN_ID = 2;

const providerPass = passportInstance.connectEvm();
const passportProvider = passportInstance.connectEvm();

const provider = new ethers.providers.Web3Provider(passportProvider);

//const provider = passportInstance.connectEvm();
//const accounts =  await provider._getAddress().then((result) => result[0])

//const provider = getDefaultProvider('https://rpc.testnet.immutable.com');

// const mint = async (provider: Provider): Promise<TransactionResponse> => {
  // Bound contract instance
  const contract = new ERC721MintByIDClient(CONTRACT_ADDRESS);
  // The wallet of the intended signer of the mint request
  const wallet = new Wallet(PRIVATE_KEY, provider);
  // We can use the read function hasRole to check if the intended signer
  // has sufficient permissions to mint before we send the transaction
  const minterRole = await contract.MINTER_ROLE(provider);
  const hasMinterRole = await contract.hasRole(
    provider,
    minterRole,
    wallet.address
  );

  if (!hasMinterRole) {
    // Handle scenario without permissions...
    console.log('Account doesnt have permissions to mint.');
     Promise.reject(
      new Error('Account doesnt have permissions to mint.')
    );
  }

  // Rather than be executed directly, contract write functions on the SDK client are returned
  // as populated transactions so that users can implement their own transaction signing logic.
  const populatedTransaction = await contract.populateMint(RECIPIENT, TOKEN_ID);
  const accounts =  await providerPass.request({ method: "eth_requestAccounts" }).then((result) => result[0])
  const transactionHash = await providerPass.request({
    method: 'eth_sendTransaction',
    params: [
      {
        to: CONTRACT_ADDRESS,
        data: populatedTransaction,
      }
    ]
  });
  // const result = await wallet.sendTransaction(populatedTransaction);
  console.log(transactionHash); 
  
} 

export default mintNFT;

// To get the TransactionResponse value
  //return transactionHash;
// };

//mint(provider);

// async function mintNFT (token_id: number, provider: Provider) {

//   //const passportProvider = passportInstance.connectEvm();

//   const providers = new ethers.providers.Web3Provider(provider);

//   const signer = providers.getSigner();
//   const address = await signer.getAddress();

// const userAddress = '0x7448ECCBaA2299298d3B4148B52e91C55CDD9dE8'
// const toAddress = address;
// const erc721ContractAddress = '0x7A6AAbd5cD770822287D2b46019Ef33c8A6d5aB3';
// //const tokenId = 2;

// // Construct the contract interface using the ABI
// const contract = new ethers.Contract(
//   erc721ContractAddress,
//   [
//     `function safeTransferFrom(address from, address to, uint256 tokenId)`,
//   ],
//   signer,
// );

// const tx = await contract.safeTransferFrom(
//   userAddress,
//   toAddress,
//   token_id,
// );
// await tx.wait();

// }

// export default mintNFT;