// import { useState } from "react";
import Map from "./components/Map";
import "./App.scss";
import Header from "./components/Header";
import { MapProvider } from "./contexts/MapContext";
import { LoadScript } from "@react-google-maps/api";

function App() {
	const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // 環境變數中的 Google Maps API 金鑰

	return (
		<>
			<LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
				<MapProvider>
					<Header />
					<Map />
				</MapProvider>
			</LoadScript>
		</>
	);
}

export default App;
