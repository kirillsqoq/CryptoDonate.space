import React, { useRef, useState, useEffect, useContext } from "react";

import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useLocation, Navigate } from "react-router-dom";
import { collection, getFirestore, doc } from "firebase/firestore";
import { Provider, darkTheme, Grid } from "@adobe/react-spectrum";
import { Donations } from "./components/Donations";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { useStore } from "../../store";
import { WorkSpaceTabs } from "./components/Tabs/WorkspaceTabs";
import { WorkspaceHeader } from "./components/WorkspaceHeader/WorkspaceHeader";

import { darkThemeNext } from "../../utils/utils";

export default function WorkSpace() {
	let [BTCWallet, setBTCWallet] = useState();
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);
	useEffect(() => {
		console.log(user);
	}, [user]);

	const [updateProfile, updatingProfile, errorProfile] =
		useUpdateProfile(auth);

	useEffect(() => {
		async () => {
			await updateProfile({ displayName, photoURL });
			console.log("update profile");
			console.log(user);
		};
	}, []);

	let [isValid, setValid] = useState(false);
	useEffect(() => {
		if (BTCWallet == "") {
			setValid(true);
		}
	}, []);

	if (user) {
		if (tickets_value) {
			// tickets_value.docs.map((doc) => console.log(doc.data()));
		}

		return (
			<>
				<Provider theme={darkTheme}>
					<Grid
						areas={{
							base: ["headermini", "content", "toc"],
							S: [
								"headermini headermini",
								"content    content",
								"toc toc",
							],
							L: [
								"header header  header",
								"content    content toc",
							],
						}}
						columns={{
							base: ["1fr"],
							S: ["1fr", "1fr", "1fr"],
							L: ["1fr", "1fr", "1fr"],
						}}>
						<WorkspaceHeader />
						<WorkSpaceTabs />
						<Donations />
						<NextUIProvider theme={darkThemeNext}></NextUIProvider>
					</Grid>
				</Provider>
			</>
		);
	} else {
		return <Navigate to={"/"} />;
	}
}
