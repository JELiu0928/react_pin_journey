import { createContext, useContext, useState } from "react";
import { ICoordData, Coordinate, Cate } from "../types/type";

// type Coordinate = { lat: number; lng: number };
interface MapContextProps {
	cateArr: Cate[];
	coordinate: Coordinate;
	setCoordinate: (coord: Coordinate) => void;
	zoom: number;
	setZoom: (zoom: number) => void;
	isSidebarOpen: boolean;
	setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	coordArr: ICoordData[];
	setCoordArr: (newCoordArr: ICoordData[] | ((prevState: ICoordData[]) => ICoordData[])) => void;
	editCoord: ICoordData | null;
	setEditCoord: (coord: ICoordData | null) => void;
	visitDate: string;
	setVisitDate: (date: string) => void;
	category: string;
	setCategory: (cate: string) => void;
	rating: number;
	setRating: (rating: number) => void;
	desc: string;
	setDesc: (desc: string) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
	const cateArr: Cate[] = [
		{
			key: "restaurant",
			value: "餐廳",
		},
		{
			key: "attraction",
			value: "景點",
		},
		{
			key: "shop",
			value: "商店",
		},
		{
			key: "hotel",
			value: "住宿",
		},
		{
			key: "other",
			value: "其他",
		},
	];
	const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().slice(0, 10));
	const [category, setCategory] = useState<string>("restaurant");
	const [rating, setRating] = useState<number>(0);
	const [desc, setDesc] = useState<string>("");
	const [coordinate, setCoordinate] = useState<Coordinate>({ lat: 23.6978, lng: 120.9605 });
	const [zoom, setZoom] = useState<number>(8);
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [coordArr, setCoordArr] = useState<ICoordData[]>(() => {
		const savedCoord = localStorage.getItem("coord");
		// 如果有資料，就解析並設置為初始值，否則設置為空陣列
		return savedCoord ? JSON.parse(savedCoord) : [];
	});
	const [editCoord, setEditCoord] = useState<ICoordData | null>(null);

	return <MapContext.Provider value={{ coordinate, setCoordinate, zoom, setZoom, isSidebarOpen, setIsSidebarOpen, coordArr, setCoordArr, editCoord, setEditCoord, cateArr, visitDate, setVisitDate, category, setCategory, rating, setRating, desc, setDesc }}>{children}</MapContext.Provider>;
};

// 自定義 Hook 用來使用 MapContext
export const useMapContext = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMapContext 必須在 MapProvider 中使用");
	}
	return context;
};
