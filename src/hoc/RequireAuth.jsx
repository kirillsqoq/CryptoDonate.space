import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Context } from "../index";
import { useAuthState } from "react-firebase-hooks/auth";
export const RequireAuth = ({ children }) => {
	const location = useLocation();
	const { auth } = useContext(Context);
	const [user] = useAuthState(auth);
	console.log("проверка авторизации");

	if (!user) {
		console.log(user);
		console.log("Пользователь не авторизован, переадрессация на Login");

		return <Navigate to={"/"} state={location} />;
	}

	return children;
};
