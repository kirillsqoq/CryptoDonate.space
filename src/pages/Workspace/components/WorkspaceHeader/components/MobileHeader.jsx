import React, { useRef, useState, useEffect, useContext } from "react";
import { View, Flex, ActionButton } from "@adobe/react-spectrum";
import { Link, Container } from "@nextui-org/react";
import { SignOutButton } from "../../../../../shared/SignOutButton";
import { Logo } from "../../../../../shared/Logo";

export function MobileHeader() {
	return (
		<>
			<Container
				css={{
					width: "98%",
					backgroundColor: "$accents1",
					borderRadius: "$lg",
					padding: "$2",
				}}
				color={"default"}>
				<Flex
					direction={"row-reverse"}
					alignItems='center'
					justifyContent={"space-between"}
					marginY={"size-100"}
					marginStart='size-200'
					marginEnd='size-200'>
					<View>
						<Flex>
							<SignOutButton />
						</Flex>
					</View>
					<Flex direction={"row"} justifyContent='center'>
						<View justifySelf={"center"}>
							<Logo fontSize={25} pageLink={true} />
						</View>
					</Flex>
				</Flex>
			</Container>
		</>
	);
}
