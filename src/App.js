  import './App.css';
  import {create} from "ipfs-http-client";
  import { useState } from 'react';

  const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

  function App() {
    const [urlFile,setUrlFile] = useState('')

   async function onChange (e){

  const file = e.target.files[0];

  try{

    const addFile = await ipfsClient.add(file);

    const url = `https://ipfs.infura.io/ipfs/${addFile.path}`;
    setUrlFile(url);
    console.log(url)


  }catch(e){
    console.log("error",e);
  }
  }

    return (
      <div className="App">
        <header className="App-header">
        <div className="alert alert-danger" role="alert">
         iPFS UPloader
        </div>
        <div>
        <div classNameName="mb-3 ">
    <label for="formFile" className="form-label">Upload your File From Computer</label>
    <input className="form-control p-1 " type="file" id="formFile" onChange={onChange} />
    </div>
        </div>
        <img src = {urlFile} width="300px"/>

        </header>
      </div>
    );
  }

  export default App;
