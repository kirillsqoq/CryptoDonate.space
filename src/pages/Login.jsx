// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css/effect-fade";
// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../styles.css";

// // import required modules
// import {
// 	Pagination,
// 	Navigation,
// 	Keyboard,
// 	Mousewheel,
// 	EffectFade,
// } from "swiper";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { App3D } from "../components/App3D";

import { Page } from "../components/Page";

export default function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const fromPage = location.state?.from?.pathname || "/";

	return (
		<>
			<App3D />
			<Page />
		</>
	);
}
