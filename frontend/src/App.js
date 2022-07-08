import logo from './logo.svg';
import './App.css';

import Header from './components/Header.js'
import Listing from './components/Listing.js'


function App() {
  // TODO: remove mock data
  const exampleListing = {
    "imageUrl": "https://media.kijiji.ca/api/v1/ca-prod-fsbo-ads/images/b9/b96ec292-db9e-4b93-ad61-7c486e54cad2?rule=kijijica-640-webp",
    "itemName": "Rounded wooden table",
    "itemDescription": "very round and cool looking table with enough room for atleast 4 chairs",
    "startingBid": "$50",
    "dateOfBid": "July 31, 2022 | 5 pm EST"
  }
  
  return (
    <div className="App">
      <Header></Header>
      <Listing details={exampleListing}></Listing>
      <Listing details={exampleListing}></Listing>
      <Listing details={exampleListing}></Listing>
      {/* <header className="App-header">
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
      </header> */}
    </div>
  );
}

export default App;
