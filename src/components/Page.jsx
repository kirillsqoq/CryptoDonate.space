import React, { useRef, useState, useContext, useEffect } from "react";
// Import Swiper React components
// import { Link } from "react-router-dom";
import { useLocation, Navigate } from "react-router-dom";

import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Context } from "../index";
export function Page() {
	console.log("render Page");

	const { auth } = useContext(Context);
	const [count, setCount] = useState("");

	useEffect(() => {
		// console.log(auth);
	}, [auth]);
	const login = async () => {
		console.log("нажата кнопка Sign in with Google");
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth, provider);
		if (user) {
			console.log(user);
			console.log(
				"Пользователь  авторизован, переадрессация на WorkSpace"
			);
		}
		console.log("получение пользователя");
		//после входа получаем юзера и выводим в консоль
		console.log(user);
	};
	return (
		<>
			<div id='page'>
				{/* <h1>Bookkeeper</h1> */}
				{/* <nav>
					<Link to='/signin'>Sign In</Link>
					<Link to='/signup'>Sign Up</Link>
				</nav> */}
				<button
					onClick={login}
					id='go'
					className='login-with-google-btn'>
					{count}
					{/* <Link to='/signin'>Sign in with Google</Link> */}
					Sign in with Google
				</button>
				<div id='footerlogin'></div>
			</div>
		</>
	);
}
