import { createPortal } from "react-dom";
import "./step.scss";
import map01 from "../assets/map01.png";
import map02 from "../assets/map02.png";
import { useMapContext } from "../contexts/MapContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Step() {
	// console.log("Step 組件 render");
	const { isShowStep, setIsShowStep } = useMapContext();
	const [currentMap, setCurrentMap] = useState<number>(1);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
	const [closeBtn, setCloseBtn] = useState<boolean>(false);
    const [Map1Loaded, setMap1Loaded] = useState<boolean>(false); // 新增狀態
    const [Map2Loaded, setMap2Loaded] = useState<boolean>(false); // 新增狀態
	const handleAnimationEnd = () => {
		setCurrentStepIndex((oldVal) => oldVal + 1);
	};
	const handleStepClose = () => {
		setIsShowStep(false);
		setCurrentStepIndex(0);
        setCurrentMap(1);
        setCloseBtn(false);
	};
    const handleMap1Load = () => {
        setMap1Loaded(true); // 圖片載入完成
    };
    const handleMap2Load = () => {
        setMap2Loaded(true); // 圖片載入完成
    };
	const steps1 = [
		{
			step: 1,
			s_position: { left: "75%", top: "1%" },
			desc: "請輸入地點名稱，並從下拉選單中選擇地點",
			d_position: { left: "48.5%", top: "3.5%" },
			delay: "0.5s",
		},
		{
			step: 2,
			s_position: { left: "52%", top: "50%" },
			desc: "搜尋框選擇後會顯示該地點，此時點\n選地圖上的已註冊地點，也可不用搜\n尋直接點選地圖已註冊地點",
			d_position: { left: "53.5%", top: "52%" },
			delay: "2.5s",
		},
		{
			step: 3,
			s_position: { left: "87%", top: "35%" },
			desc: "選擇地點",
			d_position: { left: "88.5%", top: "37.5%" },
			delay: "4.5s",
		},
		{
			step: 4,
			s_position: { left: "5%", top: "70%" },
			desc: "填寫完後送出",
			d_position: { left: "6.5%", top: "72.5%" },
			delay: "6.5s",
		},
	];
	const steps2 = [
		{
			step: 1,
			s_position: { left: "42%", top: "37%" },
			desc: "畫面會依據評分有不同圖釘，點選圖釘",
			d_position: { left: "43.5%", top: "39%" },
			delay: "0.5s",
		},
		{
			step: 2,
			s_position: { left: "55%", top: "55%" },
			desc: "即可操作編輯與刪除",
			d_position: { left: "56.5%", top: "57%" },
			delay: "2.5s",
		},
	];
	useEffect(() => {
		if (currentMap === 1 && currentStepIndex === steps1.length) {
			setTimeout(() => {
				setCurrentMap(2);
                setCurrentStepIndex(0);
			}, 1500);
		}
		if (currentMap === 2 && currentStepIndex === steps2.length) {
			setCloseBtn(true);
		}
	}, [currentStepIndex]);
	useEffect(() => {
		if (isShowStep) {
			setCurrentMap(1);
			setCurrentStepIndex(0);
		}
	}, [isShowStep, setCurrentMap]);
   

	useEffect(() => {}, [setIsShowStep]);
	return createPortal(
		isShowStep && (
			<div className="step_overlay" onClick={handleStepClose}>
				<div className="step_container" onClick={(e) => e.stopPropagation()}>
					<AnimatePresence>
						{currentMap == 1 && (
							<motion.div
								className="step_1"
								initial={{ opacity: 0 }} // 初始狀態
								animate={{ opacity: 1 }} // 顯示時的動畫
								exit={{ opacity: 0 }} // 隱藏時的動畫
								transition={{ duration: 0.5 }}
							>
								{ <img src={map01} onLoad={handleMap1Load}  alt="步驟圖片1" />}
								{Map1Loaded && steps1.map((item) => {
									return (
										<div key={item.step} onAnimationEnd={handleAnimationEnd} className="step_content " style={{ animationDelay: item.delay }}>
											<div className="step_num" style={{ left: item.s_position.left, top: item.s_position.top }}>
												{item.step}
											</div>
											<div className="step_desc" style={{ left: item.d_position.left, top: item.d_position.top, whiteSpace: "pre-line" }}>
												{item.desc}
											</div>
										</div>
									);
								})}
							</motion.div>
						)}
					</AnimatePresence>
					{currentMap == 2 && (
						<div className="step_2">
							{<img src={map02}  onLoad={handleMap2Load} alt="步驟圖片2" />}
							{Map2Loaded && steps2.map((item) => {
								return (
									<div key={item.step} onAnimationEnd={handleAnimationEnd} className="step_content " style={{ animationDelay: item.delay }}>
										<div className="step_num" style={{ left: item.s_position.left, top: item.s_position.top }}>
											{item.step}
										</div>
										<div className="step_desc" style={{ left: item.d_position.left, top: item.d_position.top, whiteSpace: "pre-line" }}>
											{item.desc}
										</div>
									</div>
								);
							})}
							{closeBtn && <button onClick={() => setIsShowStep(false)}>關閉步驟教學</button>}
						</div>
					)}
				</div>
			</div>
		),
		document.body
	);
}

export default Step;
