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
    const[account,setAccount]=useState(null);

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
const [contract,setContract]= useState();
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
      setContract(contract);
      } else {

        window.alert("Our App connect with GANACHE Network Only")
      }



    }
    loadContract();

  },[web3Api.web3,account,web3Api.provider])

  //Create The setter and Getter My Account Address
 

  useEffect(() => {
    const getAccount= async()=>{
      const accounts= await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);

    }
    web3Api.web3 && getAccount()
   
  }, [web3Api.web3])

//ONchange Function
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
 // Get And Set Data From Blockchain
  const [cloudvalue,setCloudValue]= useState('');
  useEffect(() => {
    const loadData = async()=>{
     

     await contract.methods.saveData("Ali").send({from:account});
      //getdata
      const response = await contract.methods.getData().call();
      setCloudValue(response);
    }

    if(typeof web3Api.web3!=='undefined' && typeof account!=='undefined' && typeof contract!=='undefined' &&  contract!==null){
      loadData()
    }
    console.log(cloudvalue);
   
  }, [web3Api.web3Api])

  useEffect(() => {

    const test = async ()=>{
      console.log(web3Api.web3);
      console.log(contract);
      console.log(account);

    }
   web3Api.web3&&test();
  }, [web3Api.web3,account])
    return (
      <div className="App">
        <header className="App-header">
        <div className="alert alert-danger" role="alert">
         iPFS UPloader
        </div>
        <div>
        <div className="mb-3 ">
          <label  className="form-label">Upload your File From Computer </label>
          <p>My Account Is : {account}</p>
          <p>My Data From Network is :{cloudvalue}</p>

          <input className="form-control p-1 " type="file" id="formFile" onChange={onChange} />
          </div>
        </div>
        <img  className="pt-2 " src = {urlFile} width="300px"/>

        <form>
          <button type="submit">Save</button>
        </form>

        </header>
      </div>
    );
  }

  export default App;
