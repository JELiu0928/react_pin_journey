import "./model.scss";
import correctIcon from "../assets/correct.png";
import errorIcon from "../assets/error.png";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion"; // 引入 framer-motion

interface ModelProps {
	msg: string;
	// :React.Dispatch<React.SetStateAction<boolean>>可以定義時hover，vscode有提示
	setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setShowMarker: React.Dispatch<React.SetStateAction<boolean>>;
	showModel: {
		isShowModel: boolean;
		setIsShowModel: React.Dispatch<React.SetStateAction<boolean>>;
	};
	isCorrect: boolean;
}

function model({ msg, setIsSidebarOpen, setShowMarker, showModel: { isShowModel, setIsShowModel }, isCorrect }: ModelProps) {
	const handleClose = () => {
		setIsShowModel(false);
		setShowMarker(false);
		if (isCorrect) {
			setIsSidebarOpen(false);
		}
	};
	// return isShowModel
	// 	? createPortal(
	// 			<div className="overlay">
	// 				<div className="model">
	// 					<div className="model_icon">
	// 						<img src={isCorrect ? correctIcon : errorIcon} alt="" />
	// 					</div>
	// 					{/* <div>{props.msg}</div> */}
	// 					<div className="msg">{msg}</div>
	// 					<button onClick={handleClose}>OK</button>
	// 				</div>
	// 			</div>,
	// 			document.body // 渲染到 body 元素下
	// 	  )
	// 	: null;
	return createPortal(
		<AnimatePresence>
			{isShowModel && (
				<div className="overlay">
					<motion.div className="model" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} transition={{ duration: 0.3 }}>
						<div className="model_icon">
							<img src={isCorrect ? correctIcon : errorIcon} alt="" />
						</div>
						<div className="msg">{msg}</div>
						<button onClick={handleClose}>OK</button>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body // 渲染到body
	);
}

export default model;
