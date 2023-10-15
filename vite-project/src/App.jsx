import { useState, useEffect } from "react";
import "./App.css";
import BanList from "./components/BanList";
import SeenList from "./components/SeenList";
import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
// console.log("API KEY:", API_KEY);

function App() {
  const [info, setInfo] = useState([]); //note: info will be the entire query search (accounting for filtered, such as breeds), index will select specific instance.
  const [index, setIndex] = useState(-1); //note: index is randomized in App.jsx
  const [banList, setBanList] = useState([]); //note: banList will be deleted in the banList.jsx component, added to in App.jsx component.
  const [seenList, setSeenList] = useState([]); //note: seenList will be added to in App.jsx

  let query = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`; //pulls entire array (unfiltered, added to via filtered query string at end?)

  const vowels = new Set(["A", "E", "I", "O", "U"]);
  useEffect(() => {
    const preLoad = async () => {
      const response = await axios.get(query);
      setInfo(response.data);
    };

    preLoad();
  }, [query]); // fine, query never changes, will only fetch on page reload.

  const handleClick = async () => {
    setIndex(Math.floor(Math.random() * info.length));
    let attempts = 0;

    while (attempts < 5000) {
      const randomIndex = Math.floor(Math.random() * info.length);
      const currentDog = info[randomIndex];

      if (
        !banList.includes(currentDog["name"]) &&
        !banList.includes(currentDog["weight"]["imperial"]) &&
        !banList.includes(currentDog["temperament"].split(/[ ,]+/)[0]) &&
        !banList.includes(currentDog["height"]["imperial"])
      ) {
        // Valid dog found
        setIndex(randomIndex);
        const article = vowels.has(currentDog["name"].toUpperCase().charAt(0))
          ? "An"
          : "A";
        setSeenList([
          ...seenList,
          [
            currentDog["image"]["url"],
            `${article} ${currentDog["name"]} doggo.`,
          ],
        ]);
        break; // Exit the loop
      }

      attempts += 1;
    }

    if (attempts === 5000) {
      console.log("Cannot find a valid dog based on the current ban list.");
    }
  };

  const addBanList1 = () => {
    setBanList((prevBanList) => [...prevBanList, info[index]["name"]]);
  };

  const addBanList2 = () => {
    setBanList((prevBanList) => [
      ...prevBanList,
      info[index]["weight"]["imperial"],
    ]);
  };

  const addBanList3 = () => {
    setBanList((prevBanList) => [
      ...prevBanList,
      info[index]["temperament"].split(/[ ,]+/)[0],
    ]);
  };

  const addBanList4 = () => {
    setBanList((prevBanList) => [
      ...prevBanList,
      info[index]["height"]["imperial"],
    ]);
  };

  const removeBanListItem = (itemToRemove) => {
    setBanList((prevBanList) =>
      prevBanList.filter((item) => item !== itemToRemove)
    );
  };

  return (
    <div className="main">
      <SeenList array={seenList} />
      <div className="hero">
        <h1 className="title">Doggo Catcher 🐶</h1>
        <h2>Discover and catch all types of doggos!</h2>
        <h3>Note: click on query attributes to prevent future search.</h3>
        {index !== -1 && (
          <div>
            <h2>Here is your doggo:</h2>
            <div className="inline-div">
              <button className="ban-btn" onClick={addBanList1}>
                {info[index]["name"]}
              </button>
              <button className="ban-btn" onClick={addBanList2}>
                {info[index]["weight"]["imperial"]} lbs
              </button>
              <button className="ban-btn" onClick={addBanList3}>
                {info[index]["temperament"].split(/[ ,]+/)[0]}
              </button>
              <button className="ban-btn" onClick={addBanList4}>
                {info[index]["height"]["imperial"]} in
              </button>
            </div>
            <img
              src={info[index]["image"]["url"]}
              alt="dog picture"
              className="doggo-img"
            />
          </div>
        )}
        <button onClick={handleClick}>Discover 🔀</button>
      </div>
      <BanList
        array={banList}
        onRemove={removeBanListItem}
        className="banlist"
      />
    </div>
  );
}

export default App;
