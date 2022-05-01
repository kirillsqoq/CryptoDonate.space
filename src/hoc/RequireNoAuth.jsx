import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Context } from "../index";
import { useAuthState } from "react-firebase-hooks/auth";
export const RequireNoAuth = ({ children }) => {
	const location = useLocation();
	const { auth } = useContext(Context);
	const [user] = useAuthState(auth);
	console.log("проверка отсуствия авторизации");

	if (user) {
		console.log(user);
		console.log("Пользователь  авторизован, переадрессация на WorkSpace");

		return <Navigate to={"/workspace"} state={location} />;
	}

	return children;
};
