import { createContext, useContext, useState } from "react";
import { ICoordData, Coordinate, Cate } from "../types/type";

// type Coordinate = { lat: number; lng: number };
interface MapContextProps {
	cateArr: Cate[];
    map:google.maps.Map | null
    setMap:React.Dispatch<React.SetStateAction<google.maps.Map | null>>

	coordinate: Coordinate;
	setCoordinate: (coord: Coordinate) => void;
	zoom: number;
	setZoom: (zoom: number) => void;

	isShowMarker: boolean;
	setIsShowMarker: React.Dispatch<React.SetStateAction<boolean>>;
	isSidebarOpen: boolean;
	setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isShowModel: boolean;
	setIsShowModel: React.Dispatch<React.SetStateAction<boolean>>;
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
	msg: string;
	setMsg: (desc: string) => void;

	isDelMode: boolean;
	setIsDelMode: React.Dispatch<React.SetStateAction<boolean>>;
	isShowStep: boolean;
	setIsShowStep: React.Dispatch<React.SetStateAction<boolean>>;

	targetToDelete: ICoordData | null;
	setTargetToDelete: (coord: ICoordData | null) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
	const cateArr: Cate[] = [
        { key: "restaurant", value: "餐廳" },
        { key: "cafe", value: "咖啡 / 飲料" }, 
        { key: "attraction", value: "景點" },
        { key: "shopping", value: "逛街購物" },
        { key: "hotel", value: "住宿" },
        { key: "park", value: "公園 / 自然" },
        { key: "transport", value: "交通" },
        { key: "activity", value: "活動 / 展覽" },
        { key: "other", value: "其他" },
	];
	const [map, setMap] = useState<google.maps.Map | null>(null);

	const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().slice(0, 10));
	const [category, setCategory] = useState<string>("restaurant");
	const [rating, setRating] = useState<number>(0);
	const [desc, setDesc] = useState<string>("");
	const [coordinate, setCoordinate] = useState<Coordinate>({ lat: 23.6978, lng: 120.9605 });
	const [zoom, setZoom] = useState<number>(8);
    const [isShowMarker, setIsShowMarker] = useState<boolean>(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [isShowModel, setIsShowModel] = useState<boolean>(false);
	const [isDelMode, setIsDelMode] = useState<boolean>(false);
	const [msg, setMsg] = useState<string>("");
	const [targetToDelete, setTargetToDelete] = useState<ICoordData | null>(null);
	const [coordArr, setCoordArr] = useState<ICoordData[]>(() => {
		const savedCoord = localStorage.getItem("coord");
		return savedCoord ? JSON.parse(savedCoord) : [];
	});
	const [editCoord, setEditCoord] = useState<ICoordData | null>(null);
	const [isShowStep, setIsShowStep] = useState<boolean>(false);
	return <MapContext.Provider value={{ map, setMap,coordinate, setCoordinate, zoom, setZoom,isShowMarker, setIsShowMarker, msg, setMsg, isSidebarOpen, setIsSidebarOpen, isShowModel, setIsShowModel, coordArr, setCoordArr, editCoord, setEditCoord, cateArr, visitDate, setVisitDate, category, setCategory, rating, setRating, desc, setDesc, isDelMode, setIsDelMode, targetToDelete, setTargetToDelete,isShowStep, setIsShowStep }}>{children}</MapContext.Provider>;
};

// 自定義 Hook 用來使用 MapContext
export const useMapContext = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMapContext 必須在 MapProvider 中使用");
	}
	return context;
};
