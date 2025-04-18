import logoLarge from "/logo_large.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./header.scss";
import { useEffect, useRef } from "react";
import { useMapContext } from "../contexts/MapContext";
import Step from "./Step";

const Header = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { setIsShowMarker,setCoordinate, setZoom, setIsSidebarOpen, setIsShowStep } = useMapContext();

	useEffect(() => {
		if (!window.google || !inputRef.current) return;

		const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
			fields: ["geometry"], // 地理資訊（geometry），例如座標
			componentRestrictions: { country: "TW" }, // 限制搜尋範圍為台灣
		});
		// 選擇地點後，place_changed會觸發
		autoComplete.addListener("place_changed", () => {
			// setIsSidebarOpen(true);
			setZoom(15);

			const place = autoComplete.getPlace();
			if (place.geometry?.location) {
				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();
				setCoordinate({ lat, lng });
                setIsShowMarker(true)
			}
		});
	}, [setCoordinate, setZoom, setIsSidebarOpen]);
	return (
		<>
			<header>
				<nav>
					<img src={logoLarge} alt="logo" />
					<div className="search_input">
						<FontAwesomeIcon className="search_input-icon" icon={faSearch} />
						<input type="text" ref={inputRef} placeholder="請輸入關鍵字後點選地點..." />
					</div>
					<button
						className="info_btn"
						onClick={() => {
							setIsShowStep(true);
						}}
					>
						<FontAwesomeIcon icon={faCircleInfo} />
					</button>
				</nav>
			</header>
            <Step/>
		</>
	);
};
export default Header;
