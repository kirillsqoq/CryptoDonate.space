import React, { useRef, useState, useEffect, useContext } from "react";

import { Flex, View } from "@adobe/react-spectrum";
import {
	Button,
	Switch,
	Card,
	Text,
	Checkbox,
	Spacer,
} from "@nextui-org/react";

import QRCode from "react-qr-code";
import { CopyOverlayLinkButton } from "../../../../../shared/CopyOverlayLinkButton";
import { useStore } from "../../../../../store";

import {
	qrCodeDownload,
	updateShowMessageSetting,
	updateAlertSetting,
} from "../../../../../utils/utils";

export function OverlayTab(props) {
	return (
		<>
			<Flex justifyContent={"left"}>
				<AlertsSwitch />
				<QrCodeCard />
			</Flex>
			<Flex justifyContent={"center"} alignItems='center'></Flex>
		</>
	);
}

export function AlertsSwitch() {
	const [copied, setCopied] = useState(false);
	const [selected, setSelected] = useState("");
	const [obsAlert, setObsAlert] = useState("");
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);
	useEffect(() => {
		updateAlertSetting(db, user, obsAlert, user_value);
	}, [obsAlert]);
	useEffect(() => {
		updateShowMessageSetting(db, user, selected, user_value);
	}, [selected]);
	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	}, [copied]);
	return (
		<>
			<Card
				css={{
					maxWidth: "fit-content",

					margin: "$10",
					backgroundColor: "$accents3",
				}}>
				<Flex
					justifyContent='center'
					alignItems='center'
					gap={"size-200"}
					orientation='horizontal'>
					<Switch
						size={"sm"}
						color='success'
						shadow
						initialChecked={user_value && user_value.data().alert}
						onChange={(e) =>
							setObsAlert(e.target.checked)
						}></Switch>
					<Text h3>Alerts</Text>
				</Flex>
				<Spacer />
				<Flex
					direction={"column"}
					justifyContent='center'
					alignItems='center'>
					<Card>
						{/* <Text color='primary'>{doc.status}</Text> */}
						<Flex>
							<Text
								h2
								css={{
									marginRight: "$10",
									textGradient:
										"0deg, $black -20%, $white 60%",
								}}
								weight='bold'>
								Username
							</Text>
							<Text
								h3
								css={{
									marginTop: "$6",
									textGradient:
										"45deg, #7FFF00 -20%, #7FFF00 50%",
								}}
								weight='bold'>
								$100
							</Text>
						</Flex>
						{user_value &&
							user_value.data().showMessage == true && (
								<>
									<Text h5>Message example</Text>
								</>
							)}
					</Card>
				</Flex>
				<Spacer />

				<Flex
					direction={"column"}
					justifyContent='center'
					alignItems='center'>
					<Card
						css={{
							backgroundColor: "$accents2",
						}}>
						{/* <Text>Size</Text> */}

						<Checkbox
							initialChecked={
								user_value && user_value.data().showMessage
							}
							onChange={setSelected}>
							Show message
						</Checkbox>
					</Card>
					<Spacer y={1.5} />
					<View marginStart={"size-400"}>
						<CopyOverlayLinkButton size='md' />
					</View>

					<Spacer y={0.5} />
				</Flex>
			</Card>
		</>
	);
}

export function QrCodeCard() {
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);
	return (
		<Card
			css={{
				maxWidth: "fit-content",

				margin: "$10",
				backgroundColor: "$accents2",
				height: "fit-content",
			}}>
			<Flex
				justifyContent='center'
				alignItems='center'
				gap={"size-200"}
				orientation='horizontal'>
				<Text h3>QR Code</Text>
			</Flex>
			<Spacer />

			<Flex
				direction={"column"}
				justifyContent='center'
				alignItems='center'>
				<QRCode
					id='QRCode'
					size={170}
					value={"http://cryptodonate.space/user/" + user.uid}
				/>
			</Flex>
			<Spacer y={1.5} />
			<Flex
				direction={"column"}
				justifyContent='center'
				alignItems='center'>
				<Button
					size={"md"}
					onClick={() => qrCodeDownload()}
					flat
					color={"success"}>
					Download QR Code
				</Button>

				<Spacer y={0.5} />
			</Flex>
		</Card>
	);
}
