import React, { useRef, useState, useEffect, useContext } from "react";

import { doc, setDoc } from "firebase/firestore";
import { useStore } from "../../../../../store";
import {
	TabList,
	Tabs,
	TabPanels,
	Item,
	View,
	Flex,
	Heading,
} from "@adobe/react-spectrum";
import {
	Button,
	Switch,
	Card,
	Text,
	Collapse,
	Checkbox,
	Container,
	Spacer,
	Input,
} from "@nextui-org/react";

import { validate, getAddressInfo } from "bitcoin-address-validation";
import { createUserData } from "../../../../../utils/utils";

export function WelcomeWindow() {
	const [name, setName] = useState("");
	const [BTCWallet, setBTCWallet] = useState("");
	const [validateBTC, setValidate] = useState(true);
	const { db, user } = useStore((state) => state);
	return (
		<View
			height={"88vh"}
			margin={"size-100"}
			borderRadius='large'
			gridArea='content'>
			<Container
				css={{
					borderRadius: "$lg",
					backgroundColor: "$accents1",
					marginLeft: "$10",
					height: "100%",
				}}>
				<Flex
					justifyContent={"center"}
					alignItems='center'
					direction='column'>
					<Card
						css={{
							marginTop: "$20",
							width: "fit-content",
							backgroundColor: "$accents2",
						}}>
						<Spacer />
						<Flex justifyContent='center'>
							<Text
								h2
								css={{
									fontWeight: "$bold",
									textGradient:
										"0deg, $pink800 -40%, $pink500 50%",
								}}>
								Welcome
							</Text>
						</Flex>
						<Spacer />

						<Spacer y={0.7} />

						<Flex justifyContent='center'>
							<Input
								width='300px'
								status='default'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Flex>
						<Spacer y={1} />

						{validateBTC && (
							<Flex justifyContent={"center"}>
								<Input
									width='300px'
									placeholder='Bitcoin adress'
									value={BTCWallet}
									onChange={(e) =>
										setBTCWallet(e.target.value)
									}
								/>
							</Flex>
						)}
						{validate(BTCWallet) && (
							<Flex justifyContent={"center"}>
								{validateBTC ? (
									<></>
								) : (
									<Input
										status='success'
										width='300px'
										placeholder='Bitcoin adress'
										value={BTCWallet}
										onChange={(e) =>
											setBTCWallet(e.target.value)
										}
									/>
								)}
							</Flex>
						)}
						{!validateBTC && (
							<Flex justifyContent={"center"}>
								{!validate(BTCWallet) && (
									<Input
										status='error'
										width='300px'
										placeholder='Bitcoin adress'
										value={BTCWallet}
										onChange={(e) =>
											setBTCWallet(e.target.value)
										}
									/>
								)}
							</Flex>
						)}

						<Spacer y={0.5} />

						<Spacer y={1} />
						<Flex justifyContent={"center"}>
							<Button
								css={{ width: "fit-content" }}
								onClick={() => [
									setValidate(validate(BTCWallet)),
									createUserData(db, user, name, BTCWallet),
								]}>
								Continue
							</Button>
						</Flex>
						<Spacer y={0.5} />
					</Card>
				</Flex>
			</Container>
		</View>
	);
}
