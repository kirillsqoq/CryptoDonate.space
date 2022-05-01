import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
// eslint-disable-next-line
import "swiper/css/bundle";
import "./styles.css";

import Login from "./pages/Login.jsx";
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import WorkSpace from "./pages/WorkSpace";

import { RequireAuth } from "./hoc/RequireAuth";
import { RequireNoAuth } from "./hoc/RequireNoAuth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Donat3D } from "./components/Donat3D";
const firebaseConfig = {
	apiKey: "AIzaSyAfxteKn2ks9t0VahryPrCDK9HUNDZ7nNQ",
	authDomain: "cryptodonat-9b4c7.firebaseapp.com",
	projectId: "cryptodonat-9b4c7",
	storageBucket: "cryptodonat-9b4c7.appspot.com",
	messagingSenderId: "740701682510",
	appId: "1:740701682510:web:c5262c59bc5138b8e4fc1f",
	measurementId: "G-NMWD3CD7WW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export const db = getFirestore(app);
console.log(db);

export const Context = React.createContext(null);

function Overlay() {
	return <Donat3D />;
}
function App() {
	const [user] = useAuthState(auth);

	return (
		<Context.Provider value={{ app, auth, db }}>
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
							<RequireAuth>
								<WorkSpace />
							</RequireAuth>
						}
					/>
					<Route path={"/:id/overlay"} element={<Overlay />} />
				</Routes>
			</BrowserRouter>
		</Context.Provider>
	);
}
ReactDOM.render(<App />, document.getElementById("app"));
