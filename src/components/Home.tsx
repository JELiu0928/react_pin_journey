// import React from "react";
import { gsap } from "gsap";
import "./Home.scss";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "gsap/SplitText";
import Logo from "./Logo";
import Step from "./Step";

import { useGSAP } from "@gsap/react";
import { useMapContext } from "../contexts/MapContext";
// 註冊插件
gsap.registerPlugin(SplitText);

const Home = () => {
	const { setIsShowStep } = useMapContext();
	const homeRef = useRef(null);
	const welcomeTextRef = useRef(null);
	const btnsRef = useRef(null);
	const navi = useNavigate();
	const overlaysRef = useRef(null);
	const splitRef = useRef<SplitText | null>(null);
	useGSAP(
		() => {
			if (welcomeTextRef.current) {
				splitRef.current = new SplitText(welcomeTextRef.current, { type: "chars" });

				// 初始化時設定 opacity: 0
				gsap.set(
					splitRef.current.chars,

					{
						filter: gsap.utils.wrap(["blur(10px)", "blur(15px)", "blur(5px)"]),
						y: gsap.utils.wrap([30, -15, 50]),
						opacity: 0,
					}
				);
				gsap.set(btnsRef.current, { opacity: 0, y: 100, scale: 1.5 });
			}
		},
		{ scope: homeRef }
	);

	const goToMap = () => {
		gsap.context(() => {
			const tl = gsap.timeline();
			tl.to(welcomeTextRef.current, {
				display: "none",
				opacity: 0,
			}).to(
				btnsRef.current,
				{
					opacity: 0,
					display: "none",
				},
				0
			);
			tl.to(homeRef.current, {
				duration: 0.3,
				onComplete: () => {
					// console.log("onComplete");
					navi("./map", { state: { fromHome: true } });
				},
			});
		}, overlaysRef);
	};

	const handleLogoEnd = () => {
		if (!splitRef.current || !btnsRef.current) return;

		const tl = gsap.timeline();

		tl.to(splitRef.current.chars, {
			filter: "blur(0px)",
			y: 0,
			duration: 0.4,
			opacity: 1,
			ease: "power2.out",
			stagger: 0.1,
		}).to(
			btnsRef.current,
			{
				opacity: 1,
				y: 0,
				scale: 1,
			},
			"-=.5"
		);
	};

	return (
		<>
			<div ref={homeRef} className="home__container">
				<div className="home__content">
					<div className="home__logo">
						<Logo onComplete={handleLogoEnd} />
					</div>
					<h1 ref={welcomeTextRef}>歡迎來到專屬旅行地圖（臺灣版）</h1>
					<div className="btn_group" ref={btnsRef}>
						<button
							className="btn"
							onClick={() => {
								setIsShowStep(true);
							}}
						>
							教學
						</button>
						<button className="btn" onClick={goToMap}>
							開始
						</button>
					</div>
				</div>
			</div>
			<Step />
		</>
	);
};

export default Home;
