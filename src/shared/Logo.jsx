import React, { useRef, useState, useEffect, useContext } from "react";
import { View, Flex, ActionButton } from "@adobe/react-spectrum";
import GlobeOutline from "@spectrum-icons/workflow/GlobeOutline";
import { Link, Container } from "@nextui-org/react";
import { useStore } from "../store";

export function Logo(props) {
	const user = useStore((state) => state.user);

	return (
		<Flex direction={"row"} justifyContent='center'>
			<View justifySelf={"center"}>
				<Link
					color={"error"}
					css={{
						fontSize: props.fontSize,
						fontWeight: "$bold",
					}}>
					CryptoDonate
				</Link>
			</View>
			{props.pageLink && (
				<>
					<ActionButton
						marginStart={"size-125"}
						isQuiet
						onPress={() =>
							window.open(
								"http://cryptodonate.space/user/" + user.uid
							)
						}>
						<GlobeOutline />
					</ActionButton>
				</>
			)}
		</Flex>
	);
}
