import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { ReactComponent as SVG } from "../images/icon-arrow.svg";
import patternBgDesktop from '../images/pattern-bg-desktop.png';
import patternBgMobile from '../images/pattern-bg-mobile.png';

export default function Dashboard() {
  const [apiKey] = useState(process.env.REACT_APP_MAPSAPI);
  const [mapID] = useState(process.env.REACT_APP_MAPID);
  const [position, setPosition] = useState({ lat: -7.796275454959813, lng: 110.3726123424664 });
  const [IPAddressVar, setIPAddress] = useState('');
  const [Location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('');
  const [Currency, setCurrency] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [Centered, setIsCentered] = useState(false);

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false,
  };

  const handleInputChange = (event) => { 
    const charCode = event.target.value.length === 0 ? 0 : event.target.value.charCodeAt(event.target.value.length - 1);
    if ((charCode > 48 && charCode < 57) || charCode === 46 || charCode === 0) {
      setInputValue(event.target.value);
    }
  };

  const handleButtonClick = () => {
    setIsCentered(true);
    fetch(`https://freeipapi.com/api/json/${inputValue.trim()}`, {
      method: "GET"
    })  
      .then(response => response.json())
      .then((data) => {
        if (data.latitude === '') {
          alert("Invalid IP Address");
          setIsCentered(false);
          return
        }
        
        setPosition({lat: data.latitude, lng: data.longitude});
        setIPAddress(data.ipAddress);
        setLocation(`${data.countryName}, ${data.regionName}, ${data.cityName}`);
        setTimezone(`${data.timeZones[0]} ${data.timeZone}`);
        setCurrency(`${data.currency.code}, ${data.currency.name}`);
        setIsCentered(false);
      })
      .catch(error => console.error(error));
  };

  return (
    <>
      <div className="h-dvh w-screen flex justify-center items-center">

        {/* relative */}
        <div className="flex flex-col w-full h-full lg:w-[80vw] lg:h-[85vh] overflow-hidden shadow-lg relative">
          <div className="absolute w-full lg:w-[80vw] lg:h-[30vh] text-center z-10 top-0">
            <div className="flex items-center flex-col">
              <h1 className="font-semibold mt-2 lg:mt-5 text-3xl text-white">IP Address Tracker</h1>
              <div className="flex justify-center w-10/12 lg:w-[24rem] mt-2 lg:mt-5">
                <input
                  type="text"
                  className="w-full h-10 rounded-l-md pl-4"
                  placeholder="Search for any IP Address"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyUp={(event) => {if (event.key === 'Enter') handleButtonClick()}}
                />
                <button
                  className="h-10 bg-black text-white rounded-r-md px-5"
                  onClick={handleButtonClick}
                >
                  <SVG />
                </button>
              </div>
            </div>
            <div className="flex justify-center text-left lg:h-[12rem] mt-3 lg:mt-10">
              <div className="grid   lg:grid-cols-4 lg:divide-x bg-white w-10/12 rounded-3xl">
                <div className="pt-2 lg:p-5 h-full">
                  <p className="text-xs lg:text-lg text-black text-center lg:text-left">IP Address</p>
                  <p className="text-center lg:text-left text-black text-sm px-4 py-2 lg:pt-3 lg:text-lg break-all font-semibold">{IPAddressVar}</p>
                </div>
                <div className="pt-1 lg:p-5 h-full">
                  <p className="text-xs lg:text-lg text-black text-center lg:text-left">Location</p>
                  <p className="text-center lg:text-left text-black text-sm px-4 py-2 lg:pt-3 lg:text-lg break-all font-semibold">{Location}</p>
                </div>
                <div className="pt-1 lg:p-5 h-full">
                  <p className="text-xs lg:text-lg text-black text-center lg:text-left">Timezone</p>
                  <p className="text-center lg:text-left text-black text-sm px-4 py-2 lg:pt-3 lg:text-lg break-all font-semibold">{timezone}</p>
                </div>
                <div className="lg:border-t-transparent pt-1 lg:p-5 h-full">
                  <p className="text-xs lg:text-lg text-black text-center lg:text-left">Currency</p>
                  <p className="text-center lg:text-left text-black text-sm px-4 py-2 lg:pt-3 lg:text-lg break-all font-semibold">{Currency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* main */}
          <div>
            <img src={patternBgDesktop} alt="background" className="hidden lg:block h-[15.5rem] w-full object-fill" />
            <img src={patternBgMobile} alt="background" className="lg:hidden h-[13.5rem] w-full object-fill" />
          </div>
          <APIProvider apiKey={apiKey}>
            <div className="w-full h-full" id="map">
              {(!Centered &&
                <Map defaultZoom={10} defaultCenter={position} options={mapOptions} mapId={mapID} on>
                  <AdvancedMarker position={position} />
                </Map>
              )|| (Centered && 
                <div className="text-center mt-[20rem] lg:mt-[10rem]">
                  <p>loading...</p>
                </div>
              )}
            </div>
          </APIProvider>
        </div>
      </div>
    </>
  );
}