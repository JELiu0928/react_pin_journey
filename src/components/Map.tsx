// src/components/Map.tsx
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMapContext } from "../contexts/MapContext";
import { useCallback, useState, Fragment, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Info from "./Info";
import pin01 from "../assets/pin01.png";
import pin02 from "../assets/pin02.png";
import pin03 from "../assets/pin03.png";
import { ICoordData, LocalInfo } from "../types/type";
import "./Map.scss";
import { MapOverlayPortal } from "./MapOverlayPortal";
import { motion, AnimatePresence } from "framer-motion"; // 引入 framer-motion
import gsap from "gsap";

import Logo from "./Logo";
import { useGSAP } from "@gsap/react";
import { useLocation, useNavigate } from "react-router-dom";
// 新增的地點選擇類型
type PlaceItem = {
	place_id: string;
	name: string;
	vicinity: string;
};
const Map = () => {
	const { map, setMap, coordinate, setCoordinate, zoom, isShowMarker, setIsShowMarker, isSidebarOpen, setIsSidebarOpen, coordArr, setVisitDate, setCategory, setRating, setDesc } = useMapContext();
	const [localInfo, setLocalInfo] = useState<LocalInfo>({ name: "", address: "" });
	const [isTaiwan, setIsTaiwan] = useState<boolean>(true);
	// const [isShowMarker, setShowMarker] = useState<boolean>(false);
	const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
	const [selectedCoordId, setSelectedCoordId] = useState<string | null>(null);
	// 顯示點選附近地點列表
	const [nearbyPlaces, setNearbyPlaces] = useState<PlaceItem[]>([]);
	const [showPlacesList, setShowPlacesList] = useState<boolean>(false);
	const overlaysRef = useRef(null);
	// 設定台灣的 bounds (經緯度範圍)
	const taiwanBounds = {
		north: 25.4971, // 北部
		south: 20.4546, // 南部
		east: 122.5, // 東部
		west: 118.0, // 西部
	};

	const mapLogoRef = useRef(null);
	const location = useLocation();
	const navi = useNavigate();
	const fromHome = location.state?.fromHome;
	useGSAP(
		() => {
			if (!fromHome) {
				gsap.set(overlaysRef.current, { display: "none" });
				return;
			}
			gsap.set(overlaysRef.current, { display: "flex" });
			const tl = gsap.timeline();
			tl.to(mapLogoRef.current, {
				delay: 1.5,
				duration: 1,
				width: 115,
				left: 0,
				top: 0,
				padding: "0.5rem",
				transform: "none",
				yPercent: 50,
				xPercent: 50,
				opacity: 0.8,
			})
				.to(mapLogoRef.current, { opacity: 0 })
				.fromTo(
					".overlay",
					{ opacity: 1, y: 0 },
					{
						duration: 0.8,
						yPercent: -100,
						stagger: 0.5,
						ease: "power2.out",
						onComplete: () => {
							gsap.set(overlaysRef.current, {
								display: "none",
							});
						},
					},
					"-=1"
				);
		},
		{ scope: overlaysRef }
	);
	useEffect(() => {
		if (location.state?.fromHome) {
			// 在動畫播放後，將狀態重置，避免刷新後重複動畫
			navi(location.pathname, { replace: true, state: {} });
		}
	}, [location, navi]);
	//地圖點擊
	const onMapClick = useCallback(
		(e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				const lat = e.latLng.lat();
				const lng = e.latLng.lng();
				const clickCoord = { lat, lng };
				setCoordinate(clickCoord); // 更新地圖中心點的座標
				setIsShowInfo(false);
				// 使用 Geocoder 查詢地址或名稱
				const geocoder = new window.google.maps.Geocoder();
				geocoder.geocode({ location: clickCoord }, (results, status) => {
					if (status === "OK" && results && results.length > 0) {
						// console.log(results[0].formatted_address);
						if (!results[0].formatted_address.includes("台灣") && !results[0].formatted_address.includes("臺灣")) {
							setIsTaiwan(false);
						} else {
							setIsTaiwan(true);

							// 只有在台灣範圍內，才查詢附近地點
							// 使用 Places API 查詢附近地點
							const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
							placesService.nearbySearch(
								{
									location: clickCoord,
									radius: 50, // 半徑（m）
								},
								(places, placeStatus) => {
									if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK && places && places.length > 0) {
										// console.log("places", places);
										// console.log(" places.length > 0", places.length > 0);
										// 過濾掉沒有名稱或地址的結果，最多顯示5個
										// : place is PlaceItem 型別守衛語法（type predicate）：如果回傳 true，那這個 place 就是 PlaceItem 型別
										// !!place.name用來把任何值「轉成布林值」
										const filteredPlaces = places
											.filter((place): place is PlaceItem => !!place.name && !!place.vicinity)
											.slice(0, 5)
											.map((place) => ({
												place_id: place.place_id,
												name: place.name,
												vicinity: place.vicinity,
											}));

										setNearbyPlaces(filteredPlaces);
										setShowPlacesList(true);

										// 默認選擇第一個地點
										if (filteredPlaces.length > 0) {
											setIsShowMarker(true);

											setLocalInfo({
												name: filteredPlaces[0].name,
												address: filteredPlaces[0].vicinity,
											});
										}
									} else {
										setIsShowMarker(false);

										// 如果沒有找到附近地點，則使用原來的 getDetails 方法
										const placeId = results[0].place_id;
										const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
										placesService.getDetails({ placeId }, (placeDetails, status) => {
											if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
												const name = placeDetails.name || "查無名稱";
												const address = placeDetails.formatted_address || "查無地址";
												setLocalInfo({ name, address });
											}
										});
									}
								}
							);
						}
					} else {
						console.warn("找不到對應的地址");
					}
				});
			}
		},
		[setCoordinate, setIsSidebarOpen]
	);

	// 選擇地點
	const nearPlaceSelect = (place: PlaceItem) => {
		// console.log('1...',place)

		// 選擇後獲取更詳細的地址資訊
		const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
		placesService.getDetails(
			{
				placeId: place.place_id,
				fields: ["name", "formatted_address", "geometry"],
			},
			(placeDetails, status) => {
				if (status === window.google.maps.places.PlacesServiceStatus.OK && placeDetails) {
					// console.log("2...", placeDetails);
					// user選擇後 set名稱和地址
					setLocalInfo({
						name: placeDetails.name || place.name,
						address: placeDetails.formatted_address || place.vicinity,
					});
				}
			}
		);
		setVisitDate("");
		setCategory("");
		setRating(0);
		setDesc("");
		// 隱藏選擇列表
		setShowPlacesList(false);
		setIsSidebarOpen(true);
	};

	const handleShowInfo = (id: string) => {
		setSelectedCoordId(id);
		setIsShowInfo(true);
		setShowPlacesList(false);
		setIsSidebarOpen(false);
	};

	const getIconUrl = (rating: number): string => {
		switch (rating) {
			case 1:
				return pin01;
			case 2:
				return pin02;
			default:
				return pin03;
		}
	};
	return (
		<>
			<div className="map_content-container">
				<div className="map__overlays" ref={overlaysRef}>
					<div className="overlay"></div>
					<div className="overlay"></div>
					<div className="overlay"></div>
					<div className="overlay"></div>
					<div className="map__logo" ref={mapLogoRef}>
						<Logo />
					</div>
				</div>
				<div className={`map_content-sidebar ${isSidebarOpen ? "open" : ""}`}>
					<Sidebar localInfo={localInfo} setLocalInfo={setLocalInfo} />
				</div>
				<div className="map_content-map">
					{coordinate && (
						<GoogleMap
							options={{
								restriction: {
									latLngBounds: taiwanBounds,
									strictBounds: false, // 不強制限制到台灣範圍
								},
							}}
							center={coordinate}
							zoom={zoom}
							mapContainerStyle={{ width: "100%", height: "100%" }}
							onClick={onMapClick}
							onLoad={(mapInstance) => setMap(mapInstance)} // 保存 map 實例
						>
							{isTaiwan && isShowMarker ? <Marker position={coordinate} /> : null}

							{coordArr.length > 0 &&
								coordArr.map((coord: ICoordData) => (
									<Fragment key={coord.id}>
										<Marker
											icon={{
												url: getIconUrl(coord.rating),
												scaledSize: new google.maps.Size(35, 35),
											}}
											position={{ lat: coord.coordinate.lat, lng: coord.coordinate.lng }}
											onClick={() => handleShowInfo(coord.id)}
										/>

										{isShowInfo && selectedCoordId == coord.id && map && (
											<MapOverlayPortal map={map} position={coord.coordinate}>
												<Info coord={coord} setIsShowInfo={setIsShowInfo} />
											</MapOverlayPortal>
										)}
									</Fragment>
								))}
						</GoogleMap>
					)}

					{/* 附近地點選擇列表 */}
					{/* AnimatePresence 需要包裹的元素是會在條件變化時添加或移除的元素 */}
					<AnimatePresence>
						{showPlacesList && nearbyPlaces.length > 0 && (
							<motion.div
								className="panel_nearby"
								initial={{ opacity: 0, y: 0 }} // 初始狀態
								animate={{ opacity: 1, y: 100 }} // 顯示時的動畫
								exit={{ opacity: 0, y: 0 }} // 隱藏時的動畫
								transition={{ duration: 0.3 }} // 設置過渡時間
							>
								<h3>選擇地點</h3>
								<p>點擊地圖後，找到以下地點：</p>
								<ul className="place_list">
									{nearbyPlaces.map((place) => (
										<li key={place.place_id} className={`place_item ${localInfo.name === place.name ? "selected" : ""}`} onClick={() => nearPlaceSelect(place)}>
											<div className="place_name">{place.name}</div>
											<div className="place_address">{place.vicinity}</div>
										</li>
									))}
								</ul>
								<div className="panel_btn">
									<button onClick={() => setShowPlacesList(false)}>取消</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</>
	);
};

export default Map;
