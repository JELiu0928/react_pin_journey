import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Map from "./components/Map";
import "./App.scss";
import Header from "./components/Header";
import Home from "./components/Home";
import { MapProvider } from "./contexts/MapContext";
import { LoadScript } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // 環境變數中的 Google Maps API 金鑰
function App() {
	return (
		<LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
			<MapProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/map"
							element={
								<>
									<Header />
									<Map />
								</>
							}
						/>
					</Routes>
				</Router>
			</MapProvider>
		</LoadScript>
	);
}

export default App;
