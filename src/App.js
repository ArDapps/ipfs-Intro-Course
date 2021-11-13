import './App.css';
import {create} from "ipfs-http-client";
import { useState ,useEffect} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from "web3"

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

function App() {
  //Create web3 Object use Effect
  const[web3Api,setWeb3Api] = useState({
    provider:null,
    web3:null,
  })

  const providerChanged = (provider)=>{
    provider.on("chainChanged",_=>window.location.reload());
    provider.on("accountChanged",_=>window.location.reload());

  }

  useEffect(() => {
    
    const loadProvider = async()=>{
      const provider = await detectEthereumProvider();


      if(provider){
        providerChanged(provider);
        setWeb3Api({
          provider,
          web3:new Web3(provider)
        })


      }else{
        console.log("please Dwonlaod Metamask and install it")
      }

    }

  loadProvider()
  }, [])


  //Connect with contract
const [contract,setContract] = useState(null);
useEffect(()=>{
  const loadContract=  async()=>{
    const contractFile = await fetch('/abis/Cloud.json');
    const convertFileToJson = await contractFile.json();
    const networkId = await web3Api.web3.eth.net.getId();

    const netWorkData = convertFileToJson.networks[networkId];

    if(netWorkData){

    const abi = convertFileToJson.abi;

    const address = convertFileToJson.networks[networkId].address;
    const contract = await new web3Api.web3.eth.Contract(abi,address)
    setContract(contract)

    } else {

      window.alert("Our App connect with GANACHE Network Only")
    }



  }
  web3Api.web3 && loadContract();
},[web3Api.web3])

//Create The setter and Getter My Account Address
const[account,setAccount]=useState(null);

useEffect(() => {
  const getAccount= async()=>{
    const accounts= await web3Api.web3.eth.getAccounts();
    setAccount(accounts[0]);
    console.log(accounts[0]);

  }
  web3Api.web3 && getAccount()
 
}, [web3Api.web3])


//Onchange Function save dta to ipfs
  const [urlFile,setUrlFile] = useState('')

 async function onChange (e){

const file = e.target.files[0];

try{

  const addFile = await ipfsClient.add(file);

  const url = `https://ipfs.infura.io/ipfs/${addFile.path}`;
  setUrlFile(url);


}catch(e){
  console.log("error",e);
}
}
//get and set the data at lockchain
const [cloudData,setCloudata]= useState("");

useEffect(() => {
  const loadSavedata = async ()=>{

    await contract.methods.saveData("https://mrbebo.com").send({
      from:account
    })

    const responseData =  await contract.methods.getData().call()
    setCloudata(responseData);
  }
  if(typeof web3Api.web3 !=='undefined'&& typeof contract!=='undefined'&& contract!== null && typeof account !=='undefined'){
    loadSavedata();
  }
 
}, [])









  return (
    <div className="App">
      <header className="App-header">
      <div className="alert alert-danger" role="alert">
       iPFS UPloader
      </div>
      <div>
      <div classNameName="mb-3 ">
        <label for="formFile" className="form-label">Upload your File From Computer </label>
        <p>My Account Is : {account}</p>
        <p> data From Blockchain is :{cloudData}</p>
        <input className="form-control p-1 " type="file" id="formFile" onChange={onChange} />
        </div>
      </div>
      <img  className="pt-2 " src = {urlFile} width="300px"/>

      </header>
    </div>
  );
}

export default App;
