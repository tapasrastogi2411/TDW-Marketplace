import logo from './logo.svg';
import './App.css';
import {signInToApp, signOutOfApp} from './service/auth';
import {googleProvider} from './config/authMethods'; 

function App() {
  const handleSignIn = async (provider) => { 
    const res = await signInToApp(provider); 
    console.log(res); 
  }; 

  const handleSignOut = async () => { 
    const res = await signOutOfApp(); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleSignIn(googleProvider)}>Google</button> 
        <button onClick={() => handleSignOut()}>Sign Out</button> 
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
