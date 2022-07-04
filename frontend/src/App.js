import logo from './logo.svg';
import './App.css';
import socialMediaAuth from './service/auth';
import {googleProvider} from './config/authMethods'; 

function App() {
  const handleOnClick = async (provider) => { 
    const res = await socialMediaAuth(provider); 
    console.log(res); 
  }; 

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleOnClick(googleProvider)}>Google</button> 
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
