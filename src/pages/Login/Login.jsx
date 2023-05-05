import React, { useRef, useState, useEffect } from "react";
import { Text, Link, NextUIProvider, createTheme } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Page } from "./components/Page";

const darkThemeNext = createTheme({
	type: "dark",
	theme: {
		colors: {}, // optional
	},
});
export default function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const fromPage = location.state?.from?.pathname || "/";

	return (
		<>
			<NextUIProvider theme={darkThemeNext} />
			<Page />
		</>
	);
}
