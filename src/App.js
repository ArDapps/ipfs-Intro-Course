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
  },[])


  //Connect with contract
const [contract,setContract] = useState(null);
const [networkdata,setNetworkdata] = useState(true)
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
    setNetworkdata(true)

    } else {
      setNetworkdata(false)

      console.log("Our App connect with GANACHE Network Only")
    }



  }
  web3Api.web3  &&loadContract();
},[web3Api.web3])

//Create The setter and Getter My Account Address
const[account,setAccount]=useState(null);

useEffect(() => {
  const getAccount= async()=>{
    const accounts= await web3Api.web3.eth.getAccounts();
    setAccount(accounts[0]);
    console.log(accounts[0]);

  }
  web3Api.web3  && getAccount()
 
}, [web3Api.web3])


//Onchange Function save dta to ipfs
  const [urlFile,setUrlFile] = useState()

 async function onChange (e){

const file = e.target.files[0];

try{

  const addFile = await ipfsClient.add(file);

  // const url = `https://ipfs.infura.io/ipfs/${addFile.path}`;
  const hash = addFile.path
  setUrlFile(hash);


}catch(e){
  console.log("error",e);
}
}
//get and set the data at lockchain
const [cloudData,setCloudata]= useState("");

useEffect(() => {
  const loadData = async ()=>{

    const responseData =  await contract.methods.getData().call()
    setCloudata(responseData);
  }
  if(typeof web3Api.web3 !=='undefined'&& typeof contract!=='undefined'&& contract!== null && typeof account !=='undefined'){
    loadData();
  }
 
})

useEffect(() => {
  const savedata = async()=>{
    await contract.methods.saveData(urlFile).send({
      from:account
    })
    window.location.reload()


  }
  if(typeof web3Api.web3 !=='undefined'&& typeof contract!=='undefined'&& contract!== null && typeof account !=='undefined'){
    savedata();
  }}, [urlFile])









  return (
    <>
    {
      networkdata ?   
        <div className="Main">
      {/*Start The Nav bar */}

   <nav className="navbar navbar-dark bg-dark">
 <div className="container-fluid">
   <a className="navbar-brand"><h4><span className="text-warning">Ar</span> Dapps Uploader</h4></a>
   <form className="d-flex">
     {account? <button className="btn btn-warning" >My Account Address : {account}</button> :            <button className="btn btn-warning" >Please Connect with MetaMask</button>
}
   </form>
 </div>
     {/*End The Nav bar */}
</nav>

  {/*Start Info About System */}
  <div className="container p-3">
     <div class="card">
     <div class="card-header bg-dark text-warning">
       Atthention Please!!!!
     </div>
     <div class="card-body">
       <blockquote class="blockquote mb-0">
         <h3>Upload your image from your Local computer to IPFS(Blockchain Storage Network).</h3>
         <footer class="blockquote-footer">Save It <cite title="Source Title">ForEver</cite></footer>
       </blockquote>
     </div>
  </div>

{/*End Info About System */}
{/*Start Uploader */}
   <div class="input-group mt-2">
 <input type="file" class="form-control" id="inputGroupFile02" onChange = {onChange}/>
 <label class="input-group-text" for="inputGroupFile02">Upload To IPFS</label>
</div>

 {/*End Uploader */}
   {/*start Hash Address  */}
   <div className="pt-2">
  <div class="alert alert-danger d-flex align-items-center" role="alert">
  <svg class="svg-icon p-9 m-1" width="30" height="30" fill="CurrentColor" viewBox="0 0 20 20">
       <path d="M17.896,12.706v-0.005v-0.003L15.855,2.507c-0.046-0.24-0.255-0.413-0.5-0.413H4.899c-0.24,0-0.447,0.166-0.498,0.4L2.106,12.696c-0.008,0.035-0.013,0.071-0.013,0.107v4.593c0,0.28,0.229,0.51,0.51,0.51h14.792c0.28,0,0.51-0.229,0.51-0.51v-4.593C17.906,12.77,17.904,12.737,17.896,12.706 M5.31,3.114h9.625l1.842,9.179h-4.481c-0.28,0-0.51,0.229-0.51,0.511c0,0.703-1.081,1.546-1.785,1.546c-0.704,0-1.785-0.843-1.785-1.546c0-0.281-0.229-0.511-0.51-0.511H3.239L5.31,3.114zM16.886,16.886H3.114v-3.572H7.25c0.235,1.021,1.658,2.032,2.75,2.032c1.092,0,2.515-1.012,2.749-2.032h4.137V16.886z"></path>
     </svg>
     {
       cloudData ?  <div>
       Bloackchain Hash Is: {cloudData}
     </div> : <div>
     No data Saved In Blockchain Yet !!
   </div>
     }
  
 </div>
 </div>

             {/*End Hash Address  */}

                {/*start Selectd Ipfs hash   */}
   <div className="">
  <div className="alert alert-warning d-flex align-items-center" role="alert">
  <svg className="svg-icon m-1" width="30" height="30" fill="CurrentColor" viewBox="0 0 20 20">
       <path d="M16.469,8.924l-2.414,2.413c-0.156,0.156-0.408,0.156-0.564,0c-0.156-0.155-0.156-0.408,0-0.563l2.414-2.414c1.175-1.175,1.175-3.087,0-4.262c-0.57-0.569-1.326-0.883-2.132-0.883s-1.562,0.313-2.132,0.883L9.227,6.511c-1.175,1.175-1.175,3.087,0,4.263c0.288,0.288,0.624,0.511,0.997,0.662c0.204,0.083,0.303,0.315,0.22,0.52c-0.171,0.422-0.643,0.17-0.52,0.22c-0.473-0.191-0.898-0.474-1.262-0.838c-1.487-1.485-1.487-3.904,0-5.391l2.414-2.413c0.72-0.72,1.678-1.117,2.696-1.117s1.976,0.396,2.696,1.117C17.955,5.02,17.955,7.438,16.469,8.924 M10.076,7.825c-0.205-0.083-0.437,0.016-0.52,0.22c-0.083,0.205,0.016,0.437,0.22,0.52c0.374,0.151,0.709,0.374,0.997,0.662c1.176,1.176,1.176,3.088,0,4.263l-2.414,2.413c-0.569,0.569-1.326,0.883-2.131,0.883s-1.562-0.313-2.132-0.883c-1.175-1.175-1.175-3.087,0-4.262L6.51,9.227c0.156-0.155,0.156-0.408,0-0.564c-0.156-0.156-0.408-0.156-0.564,0l-2.414,2.414c-1.487,1.485-1.487,3.904,0,5.391c0.72,0.72,1.678,1.116,2.696,1.116s1.976-0.396,2.696-1.116l2.414-2.413c1.487-1.486,1.487-3.905,0-5.392C10.974,8.298,10.55,8.017,10.076,7.825"></path>
     </svg>            {
       urlFile ?  <div>
       IPFS Hash Is: {`https://ipfs.infura.io/ipfs/${urlFile}`}
     </div> : <div>
     Select Image to see the IPFS Hash !!
   </div>
     }
  
 </div>
 
 </div>

             {/*End Selectd Ipfs hash  */}
               {/*Start Image Preview  */}
  <div className="position-absolute top-0 start-0 translate-middle">
    {
      cloudData? <img src={`https://ipfs.infura.io/ipfs/${cloudData}`} className="img-fluid " width="80%" alt="ardapps.com"/>
:<img src="https://ardapps.com/wp-content/uploads/2021/11/placeholder.png" className="img-fluid" alt="ardapps.com"/>

    }
  </div>

            {/*End Image Preview  */}


             


  </div>




</div>


 
:
<div className ="conatiner">
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
  <h3>you are at The wrong Network, please connect with <strong className = "text-danger">Ropsten Test Net</strong></h3>
  </div>
  </div>
    }
</>
  );
}

export default App;
