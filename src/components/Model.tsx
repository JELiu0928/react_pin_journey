import "./model.scss";
import correctIcon from "../assets/correct.png";
import errorIcon from "../assets/error.png";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion"; // 引入 framer-motion
import { useMapContext } from "../contexts/MapContext";

interface ModelProps {
	msg: string;
	// :React.Dispatch<React.SetStateAction<boolean>>可以定義時hover，vscode有提示
	setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	// setShowMarker: React.Dispatch<React.SetStateAction<boolean>>;
	isCorrect: boolean;
}

function Model({ msg, setIsSidebarOpen, isCorrect }: ModelProps) {
	const {setIsShowMarker, isShowModel, setIsShowModel, isDelMode, setIsDelMode, setCoordArr, targetToDelete, setTargetToDelete } = useMapContext();
	const handleClose = () => {
		setIsShowModel(false);
		setIsShowMarker(false);
		if (isCorrect) {
			setIsSidebarOpen(false);
		}
	};
	const handleDelCancer = () => {
		// setIsDel(false)
		setIsShowModel(false);
		setIsDelMode(false);
	};
	const handleDelConfirm = () => {
		if (!targetToDelete) return;
		// setIsDel(true)
		setCoordArr((prev) => prev.filter((item) => item.id !== targetToDelete.id));
		setIsShowModel(false);
		setIsDelMode(false);
		setTargetToDelete(null);
	};
	return createPortal(
		<AnimatePresence>
			{isShowModel && (
				<div className="overlay">
					<motion.div className="model" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} transition={{ duration: 0.3 }}>
						<div className="model_icon">
							<img src={isCorrect ? correctIcon : errorIcon} alt="" />
						</div>
						<div className="msg">{msg}</div>
						<div className="btn_group">
							{isDelMode ? (
								<>
									<button onClick={handleDelCancer}>取消</button>
									<button onClick={handleDelConfirm}>確定</button>
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
