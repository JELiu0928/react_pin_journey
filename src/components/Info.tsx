import React, { Fragment } from "react";
import "./Info.scss";
import { useMapContext } from "../contexts/MapContext";
import { ICoordData } from "../types/type";

interface InfoProps {
	coord: ICoordData;
	setIsShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function Info({ coord, setIsShowInfo }: InfoProps) {
	const { setEditCoord, cateArr, setIsShowModel, setMsg, setIsDelMode, setTargetToDelete } = useMapContext();


	const handleEdit = (e: React.MouseEvent, coord: ICoordData) => {
		e.stopPropagation();
		setEditCoord(coord);
	};
	const handleDel = (e: React.MouseEvent, coord: ICoordData) => {
		e.stopPropagation();
		setIsShowModel(true);
		setTargetToDelete(coord);
		setMsg("確定要刪除嗎?");
		setIsDelMode(true);
	};
	const handleInfoShow = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsShowInfo(false);
	};
	const cate = cateArr.find((item) => item.key === coord.category);
	return (
		<div className="info">
			<div>
				<span>名稱：</span>
				<span className="">{coord.name}</span>
			</div>
			<div>
				<span>地址：</span>
				<span className="">{coord.address}</span>
			</div>
			<div>
				<span>到訪日期：</span>
				<span className="visit_date">{coord.visitDate}</span>
			</div>
			<div>
				<span>類別：</span>
				<span className="category">{cate?.value}</span>
			</div>
			<div>
				<span>評分：</span>
				<span className="rating">
					{Array.from({ length: coord.rating ?? 0 }, () => {
						return (
							<Fragment key={coord.id}>
								<div className="rating">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M13.1612 5.57573L11.5421 2.55751L11.5382 2.5502C11.3124 2.12933 11.138 1.80415 10.9816 1.56737C10.8251 1.33046 10.6725 1.15904 10.4808 1.07082C10.1757 0.930354 9.82433 0.930354 9.51916 1.07082C9.32749 1.15904 9.17487 1.33046 9.01839 1.56737C8.86199 1.80415 8.68756 2.12933 8.46179 2.5502L8.45787 2.55751L6.83882 5.57573C6.70067 5.83326 6.64388 5.93644 6.56742 6.01649C6.49676 6.09048 6.41333 6.15109 6.32113 6.19543C6.22137 6.24341 6.10569 6.26554 5.81808 6.31735L2.44726 6.92447L2.43909 6.92594C1.96905 7.0106 1.60589 7.07601 1.33237 7.15159C1.0587 7.2272 0.848508 7.31939 0.705375 7.47441C0.477482 7.72124 0.368914 8.05538 0.408202 8.38902C0.432877 8.59857 0.548747 8.79669 0.725699 9.01872C0.902562 9.24064 1.15792 9.50702 1.48844 9.8518L1.49417 9.85778L3.86436 12.3303C4.06659 12.5412 4.14717 12.6271 4.19968 12.7246C4.2482 12.8147 4.28007 12.9127 4.29375 13.0141C4.30855 13.1238 4.29386 13.2407 4.25425 13.5302L3.79002 16.9237L3.78889 16.9319C3.72416 17.4051 3.67414 17.7707 3.6615 18.0542C3.64885 18.3378 3.67156 18.5662 3.77477 18.7502C3.93909 19.0433 4.22333 19.2498 4.55278 19.3155C4.7597 19.3568 4.98393 19.3078 5.24978 19.2081C5.51549 19.1085 5.84776 18.948 6.27781 18.7402L6.28524 18.7366L9.36915 17.2464C9.63228 17.1193 9.73887 17.0692 9.84779 17.0494C9.94843 17.031 10.0516 17.031 10.1522 17.0494C10.2611 17.0692 10.3677 17.1193 10.6309 17.2464L13.7148 18.7366L13.7222 18.7402C14.1522 18.948 14.4845 19.1085 14.7502 19.2081C15.0161 19.3078 15.2403 19.3568 15.4472 19.3155C15.7767 19.2498 16.0609 19.0433 16.2252 18.7502C16.3284 18.5662 16.3512 18.3378 16.3385 18.0542C16.3259 17.7707 16.2758 17.4051 16.2111 16.9319L16.21 16.9237L15.7458 13.5302C15.7061 13.2407 15.6914 13.1238 15.7062 13.0141C15.7199 12.9127 15.7518 12.8147 15.8003 12.7246C15.8528 12.6271 15.9334 12.5412 16.1356 12.3303L18.5058 9.85778L18.5116 9.85177C18.8421 9.50701 19.0974 9.24063 19.2743 9.01872C19.4513 8.79669 19.5671 8.59857 19.5918 8.38902C19.6311 8.05538 19.5225 7.72124 19.2946 7.47441C19.1515 7.31939 18.9413 7.2272 18.6676 7.15159C18.3941 7.07601 18.0309 7.0106 17.5609 6.92594L17.5527 6.92447L14.1819 6.31735C13.8943 6.26554 13.7786 6.24341 13.6789 6.19543C13.5867 6.15109 13.5032 6.09048 13.4326 6.01649C13.3561 5.93644 13.2993 5.83326 13.1612 5.57573Z"
											fill="#ffdd54"
											stroke="#5A7D68"
											strokeWidth="0.3"
										/>
									</svg>
								</div>
							</Fragment>
						);
					})}
				</span>
			</div>
			<div>
				<span>回憶碎片：</span>
				<span className="text_zone">{coord.desc}</span>
			</div>
			<div className="btn_group">
				<button onClick={(e) => handleEdit(e, coord)}>編輯</button>
				<button onClick={(e) => handleDel(e, coord)} className="btn_delete">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_89_2)">
							<g clipPath="url(#clip1_89_2)">
								<path d="M3.375 3.75V16.5H14.625V3.75H3.375Z" stroke="#5D4037" strokeWidth="1.125" strokeLinejoin="round" />
								<path d="M7.5 7.5V12.375" stroke="#5D4037" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M10.5 7.5V12.375" stroke="#5D4037" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M1.5 3.75H16.5" stroke="#5D4037" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M6 3.75L7.23337 1.5H10.7914L12 3.75H6Z" stroke="#AAAAAA" strokeWidth="1.125" strokeLinejoin="round" />
								<path d="M6 3.75L7.23337 1.5H10.7914L12 3.75H6Z" stroke="#5D4037" strokeWidth="1.125" strokeLinejoin="round" />
							</g>
						</g>
					</svg>
				</button>
				<button onClick={(e) => handleInfoShow(e)}>關閉</button>
			</div>
		</div>
	);
}

export default Info;
