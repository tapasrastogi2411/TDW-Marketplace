import Header from '../components/Header.js'
import Listing from '../components/Listing.js'
import { Link } from "react-router-dom";


function Main() {
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
      <Header />
      <div className="flex w-11/12 ml-auto mr-auto items-center mt-5 mb-8">
        <div className="font-semibold	text-2xl	tracking-widest">Search for items on marketplace</div>
        <div className="ml-auto">
          
          <Link to="listing/new" className="bg-pink-300	py-2 px-5 rounded-md">Have an item to list?</Link>
        </div>
      </div>
      <Listing details={exampleListing} />
      <Listing details={exampleListing} />
      <Listing details={exampleListing} />
    </div>
  );
}

export default Main;
