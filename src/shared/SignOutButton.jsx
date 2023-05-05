import React, { useRef, useState, useEffect, useContext } from "react";
import { signOut } from "firebase/auth";
import { Button } from "@nextui-org/react";
import { useStore } from "../store";

export function SignOutButton() {
	const { auth, user, setUser } = useStore((state) => state);
	console.log(auth);

	return (
		<>
			<Button
				css={{
					marginLeft: "$10",
				}}
				flat
				color='error'
				auto
				size={"xs"}
				variant='cta'
				onPress={() => [signOut(auth), window.location.reload(false)]}>
				Sign Out
			</Button>
		</>
	);
}
