import { Link } from "@nextui-org/react";
import React, { useRef, useState, useContext, useEffect } from "react";

export function TwitterLink() {
	return (
		<Link
			css={{}}
			icon
			block
			color='primary'
			onClick={() => window.open("https://twitter.com/_cryptodonate_")}>
			Twitter
		</Link>
	);
}
