export type LocalInfo = { name: string; address: string };
export type Coordinate = { lat: number; lng: number };
export type Cate = {
	id: number;
	cate_name: string;
	cate_title: string;
};

export interface ICoordData {
	id?: number | null;
	coordinate: { lat: number; lng: number };
	visitDate: string;
	category: string;
	rating: number;
	description: string;
	name: string;
	address: string;
}


export interface ApiResponse {
    success: boolean;
    msg?: string;
    logs?: ICoordData[];
    error?: string;
}