import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="alert alert-danger" role="alert">
      iPFS UPloader
      </div>
      <div>
      <div classNameName="mb-3 ">
  <label for="formFile" className="form-label">Upload your File From Computer</label>
  <input className="form-control p-1 " type="file" id="formFile" onChange={_=>console.log("dsdfs")}/>
  </div>
      </div>
      <div  className="mt-2">
      <button   type="button" className="btn btn-success">Upload To IPFS</button>

      </div>

      </header>
    </div>
  );
}

export default App;
