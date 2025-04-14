export type LocalInfo = { name: string; address: string };
export type Coordinate = { lat: number; lng: number };
export type Cate = { key: string; value: string };

export interface ICoordData {
	id: string;
	coordinate: { lat: number; lng: number };
	visitDate: string;
	category: string;
	rating: number;
	desc: string;
	name: string;
	address: string;
}

