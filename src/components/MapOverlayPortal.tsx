import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface OverlayProps{
    map: google.maps.Map
    position:{
        lat: number;
        lng: number;
      }
    children: React.ReactNode;
}

export function MapOverlayPortal({ map, position, children }:OverlayProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const overlayRef = useRef<google.maps.OverlayView | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!map) return;

		// 建立容器和OverlayView
		containerRef.current = document.createElement("div");
		overlayRef.current = new window.google.maps.OverlayView();

		overlayRef.current.onAdd = () => {
			// Google Maps 的 OverlayView 會提供幾個「DOM 層級」（panes）
			const panes = overlayRef.current?.getPanes();
			// overlayMouseTarget 是滑鼠事件
			panes?.overlayMouseTarget.appendChild(containerRef.current!);
		};

		overlayRef.current.draw = () => {
			// getProjection() 是 OverlayView 的方法，用來取得地圖的投影工具。
			const projection = overlayRef.current?.getProjection();
			if (!projection || !position || !containerRef.current) return;

			// fromLatLngToDivPixel() 是這個投影工具的方法，用來將 LatLng 轉換成畫面上的 pixel 座標
			const point = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(position.lat, position.lng));

			if (point) {
				containerRef.current.style.position = "absolute";
				containerRef.current.style.left = `${point.x}px`;
				containerRef.current.style.top = `${point.y}px`;
			}
		};

		overlayRef.current.onRemove = () => {
			if (containerRef.current?.parentNode) {
				containerRef.current.parentNode.removeChild(containerRef.current);
			}
		};

		overlayRef.current.setMap(map);
		setReady(true);

		return () => {
			overlayRef.current?.setMap(null);
		};
	}, [map, position]);

	return ready && containerRef.current ? createPortal(children, containerRef.current) : null;
}
