import { nanoid } from "nanoid";
import "./Sidebar.scss";
import { Fragment, useEffect, useState } from "react";
import { useMapContext } from "../contexts/MapContext";
import Model from "./Model";
import { ICoordData, LocalInfo } from "../types/type";

interface SidebarProps {
	localInfo: LocalInfo;
	setLocalInfo: React.Dispatch<React.SetStateAction<LocalInfo>>;
	// setShowMarker: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ localInfo: { name, address }, setLocalInfo }: SidebarProps) => {
	const { cateArr, coordinate, setCoordinate, coordArr, setCoordArr, msg, setMsg, isSidebarOpen, setIsSidebarOpen, setIsShowModel, editCoord, setEditCoord, visitDate, setVisitDate, category, setCategory, rating, setRating, desc, setDesc } = useMapContext();
	const [isCorrect, setIsCorrect] = useState<boolean>(true);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const coord = {
		id: nanoid(),
		coordinate,
		visitDate,
		category,
		rating,
		desc,
		name,
		address,
	};
	useEffect(() => {
		if (editCoord) {
			setIsSidebarOpen(true);
			setVisitDate(editCoord.visitDate);
			setCategory(editCoord.category);
			setRating(editCoord.rating);
			setDesc(editCoord.desc);
			setCoordinate(editCoord.coordinate);
			setLocalInfo({ name: editCoord.name, address: editCoord.address });
			// console.log('Sidebar editCoord',editCoord)
			setIsEdit(true);
		}
	}, [editCoord]);
	// console.log("rating====", rating);
	useEffect(() => {
		localStorage.setItem("coord", JSON.stringify(coordArr));
	}, [coordArr]);

	const validateForm = (): { valid: boolean; message?: string } => {
		const missingFields = [];
		if (!visitDate) missingFields.push("到訪日期");
		if (!category) missingFields.push("類別");
		if (!rating) missingFields.push("評分");
		if (!desc) missingFields.push("回憶碎片");
		if (!name) missingFields.push("名稱");
		if (!address) missingFields.push("地址");

		if (missingFields.length > 0) {
			return {
				valid: false,
				message: `請填寫：${missingFields.join("、")}`,
			};
		}
		return { valid: true };
	};
	const handleSubmit = (coord: ICoordData) => {
		const { valid, message } = validateForm();
		if (!valid) {
			setIsCorrect(false);
			setMsg(message!);
			setIsShowModel(true);
			return;
		}
		if (isEdit && editCoord) {
			setCoordArr((oldVal) => {
				return oldVal.map((item) => (item.id === editCoord.id ? coord : item));
			});
			setMsg("編輯成功~");
		} else {
			setCoordArr((oldval) => [...oldval, coord]);
			setMsg("新增成功~");
		}
		setIsCorrect(true);
		setIsShowModel(true);

		handleClear();
	};
	const handleClose = () => {
		setIsSidebarOpen(false);
		setEditCoord(null);
		setIsEdit(false);
	};
	const handleClear = () => {
		setVisitDate("");
		setCategory("");
		setRating(0);
		setDesc("");
		setLocalInfo({ name: "", address: "" });
	};

	return (
		<>
			<form action="" className="sidebar">
				<div className="form-row">
					<span>名稱</span>
					<span>{name}</span>
				</div>
				<div className="form-row">
					<span>地址</span>
					<span>{address}</span>
				</div>
				<div className="form-row">
					<label htmlFor="visit_date">到訪日期</label>
					<input type="date" required name="visitDate" id="visit_date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
				</div>

				<div className="form-row">
					<label htmlFor="category">類別</label>

					<select id="category" name="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">選擇類別</option>
						{cateArr.map((cate) => {
							return (
								<Fragment key={cate.key}>
									<option value={cate.key}>{cate.value}</option>
								</Fragment>
							);
						})}
					</select>
				</div>
				<div className="form-row rating_zone">
					<div className="rating_text">評分</div>
					<div className="rating_star">
						{[3, 2, 1].map((value) => {
							return (
								<Fragment key={value}>
									<input type="radio" name="rating" id={`like${value}`} checked={rating === value} value={value} onChange={(e) => setRating(parseInt(e.target.value))} />
									<label className="rating" htmlFor={`like${value}`}>
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M13.1612 5.57573L11.5421 2.55751L11.5382 2.5502C11.3124 2.12933 11.138 1.80415 10.9816 1.56737C10.8251 1.33046 10.6725 1.15904 10.4808 1.07082C10.1757 0.930354 9.82433 0.930354 9.51916 1.07082C9.32749 1.15904 9.17487 1.33046 9.01839 1.56737C8.86199 1.80415 8.68756 2.12933 8.46179 2.5502L8.45787 2.55751L6.83882 5.57573C6.70067 5.83326 6.64388 5.93644 6.56742 6.01649C6.49676 6.09048 6.41333 6.15109 6.32113 6.19543C6.22137 6.24341 6.10569 6.26554 5.81808 6.31735L2.44726 6.92447L2.43909 6.92594C1.96905 7.0106 1.60589 7.07601 1.33237 7.15159C1.0587 7.2272 0.848508 7.31939 0.705375 7.47441C0.477482 7.72124 0.368914 8.05538 0.408202 8.38902C0.432877 8.59857 0.548747 8.79669 0.725699 9.01872C0.902562 9.24064 1.15792 9.50702 1.48844 9.8518L1.49417 9.85778L3.86436 12.3303C4.06659 12.5412 4.14717 12.6271 4.19968 12.7246C4.2482 12.8147 4.28007 12.9127 4.29375 13.0141C4.30855 13.1238 4.29386 13.2407 4.25425 13.5302L3.79002 16.9237L3.78889 16.9319C3.72416 17.4051 3.67414 17.7707 3.6615 18.0542C3.64885 18.3378 3.67156 18.5662 3.77477 18.7502C3.93909 19.0433 4.22333 19.2498 4.55278 19.3155C4.7597 19.3568 4.98393 19.3078 5.24978 19.2081C5.51549 19.1085 5.84776 18.948 6.27781 18.7402L6.28524 18.7366L9.36915 17.2464C9.63228 17.1193 9.73887 17.0692 9.84779 17.0494C9.94843 17.031 10.0516 17.031 10.1522 17.0494C10.2611 17.0692 10.3677 17.1193 10.6309 17.2464L13.7148 18.7366L13.7222 18.7402C14.1522 18.948 14.4845 19.1085 14.7502 19.2081C15.0161 19.3078 15.2403 19.3568 15.4472 19.3155C15.7767 19.2498 16.0609 19.0433 16.2252 18.7502C16.3284 18.5662 16.3512 18.3378 16.3385 18.0542C16.3259 17.7707 16.2758 17.4051 16.2111 16.9319L16.21 16.9237L15.7458 13.5302C15.7061 13.2407 15.6914 13.1238 15.7062 13.0141C15.7199 12.9127 15.7518 12.8147 15.8003 12.7246C15.8528 12.6271 15.9334 12.5412 16.1356 12.3303L18.5058 9.85778L18.5116 9.85177C18.8421 9.50701 19.0974 9.24063 19.2743 9.01872C19.4513 8.79669 19.5671 8.59857 19.5918 8.38902C19.6311 8.05538 19.5225 7.72124 19.2946 7.47441C19.1515 7.31939 18.9413 7.2272 18.6676 7.15159C18.3941 7.07601 18.0309 7.0106 17.5609 6.92594L17.5527 6.92447L14.1819 6.31735C13.8943 6.26554 13.7786 6.24341 13.6789 6.19543C13.5867 6.15109 13.5032 6.09048 13.4326 6.01649C13.3561 5.93644 13.2993 5.83326 13.1612 5.57573Z"
												fill="white"
												stroke="#5A7D68"
												strokeWidth="0.3"
											/>
										</svg>
									</label>
								</Fragment>
							);
						})}
					</div>
				</div>

				<div className="text_area">
					<label htmlFor="text_zone">回憶碎片</label>
					<textarea name="desc" required value={desc} onChange={(e) => setDesc(e.target.value)} id="text_zone" rows={8}></textarea>
				</div>
				<div className="btn_group">
					<button type="button" className="btn_clear" onClick={() => handleClear()}>
						清除
					</button>
					<button className="btn_submit"  type="button" onClick={() => handleSubmit(coord)}>
						{isEdit ? "編輯" : "送出"}
					</button>
					{isSidebarOpen && (
						<button type="button" className="sidebar_close" onClick={() => handleClose()}>
							<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M17 9C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7L17 9ZM0.292893 7.29289C-0.097631 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34314C8.46159 1.95262 8.46159 1.31946 8.07107 0.928931C7.68054 0.538407 7.04738 0.538407 6.65685 0.928931L0.292893 7.29289ZM17 7L1 7L1 9L17 9L17 7Z" fill="white" />
							</svg>
						</button>
					)}
				</div>
			</form>
			<Model msg={msg} isCorrect={isCorrect} setIsSidebarOpen={setIsSidebarOpen} />
		</>
	);
};
export default Sidebar;
