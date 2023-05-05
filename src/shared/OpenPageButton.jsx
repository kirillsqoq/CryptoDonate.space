import React, { useRef, useState, useEffect, useContext } from "react";
import { Button } from "@nextui-org/react";
import GlobeOutline from "@spectrum-icons/workflow/GlobeOutline";
import { useStore } from "../store";

export function OpenPageButton() {
	const user = useStore((state) => state.user);
	return (
		<Button
			onClick={() =>
				window.open("http://cryptodonate.space/user/" + user.uid)
			}
			css={{
				marginRight: "$9",
			}}
			color={"gradient"}
			auto
			size='xs'>
			<GlobeOutline marginEnd={"size-100"} />
			Go to Donate Page
		</Button>
	);
}
