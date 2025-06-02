import "./Model.scss";
import correctIcon from "../assets/correct.png";
import errorIcon from "../assets/error.png";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion"; // 引入 framer-motion
import { useMapContext } from "../contexts/MapContext";

interface ModelProps {
	msg: string;
	// :React.Dispatch<React.SetStateAction<boolean>>可以定義時hover，vscode有提示
	setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isCorrect: boolean;
}

function Model({ msg, setIsSidebarOpen, isCorrect }: ModelProps) {
	const { setMsg,setIsShowMarker, isShowModel, setIsShowModel, isDelMode, setIsDelMode, setCoordArr, targetToDelete } = useMapContext();
	const handleClose = () => {
		setIsShowModel(false);
		setIsShowMarker(false);
		if (isCorrect) {
			setIsSidebarOpen(false);
		}
	};
	const handleDelCancel = () => {
		setIsShowModel(false);
		setIsDelMode(false);
	};
	const handleDelConfirm = () => {
		if (!targetToDelete) return;
		const baseUrl = import.meta.env.VITE_API_BASE_URL;

		fetch(`${baseUrl}/api/travel-logs/${targetToDelete!.id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			// body: JSON.stringify({ id: targetToDelete.id }),
		})
			.then((res) => {
				if (!res.ok) {
					if(res.status === 404) {
                        return res.json().then((data) => {
                            setMsg(data.error || "找不到該紀錄，可能已被刪除。");
                        })
                    }
                    throw new Error("網路錯誤，請稍後再試。");
				}
				return res.json();
			})
			.then((data) => {
                // console.log('handleDelConfirm data',data)
                setIsDelMode(false)
                setMsg(data.msg)
				setCoordArr(data.logs);
                return
			})
			.catch((error) => console.error(error));

		
	};
	return createPortal(
		<AnimatePresence>
			{isShowModel && (
				<div className="model_overlay">
					<motion.div className="model" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} transition={{ duration: 0.3 }}>
						<div className="model_icon">
							<img src={isCorrect ? correctIcon : errorIcon} alt={isCorrect ? "正確圖片" : "錯誤圖片"} />
						</div>
						<div className="msg">{msg}</div>
						<div className="btn_group">
							{isDelMode ? (
								<>
									<button onClick={handleDelConfirm}>確定</button>
									<button className="" onClick={handleDelCancel}>
										取消
									</button>
								</>
							) : (
								<button onClick={handleClose}>OK</button>
							)}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body // 渲染到body
	);
}

export default Model;
