import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getFirestore } from "firebase/firestore";
import Favicon from "react-favicon";
// eslint-disable-next-line
import "./styles.css";
import { useStore } from "./store";
import Login from "./pages/Login/Login.jsx";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import WorkSpace from "./pages/Workspace/Workspace";
import { RequireAuth } from "./shared/RequireAuth";
import { RequireNoAuth } from "./shared/RequireNoAuth";
import { useAuthState } from "react-firebase-hooks/auth";
import { DonationPage } from "./pages/Donation/DonationPage";
import Overlay from "./pages/Overlay/Overlay";
import icon from "../public/Favicon.ico";
import { InitStore } from "./shared/InitStore";
import { firebaseConfig } from "../config";
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

function App() {
	const [user] = useAuthState(auth);
	console.log(user);

	return (
		<>
			<Favicon url={icon} />
			{user && <InitStore user={user} />}
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={
							<RequireNoAuth>
								<Login />
							</RequireNoAuth>
						}
					/>

					<Route
						path='/workspace'
						element={
							<RequireAuth>{user && <WorkSpace />}</RequireAuth>
						}
					/>
					<Route path='user/:id' element={<DonationPage />} />
					<Route
						path='overlay/:id'
						element={
							<div id='overlay'>
								<Overlay />
							</div>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}
ReactDOM.render(<App />, document.getElementById("app"));
