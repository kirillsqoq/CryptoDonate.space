import React, { useRef, useState, useEffect, useContext } from "react";
import { doc, setDoc } from "firebase/firestore";
import { Flex } from "@adobe/react-spectrum";
import { Button, Card, Collapse, Spacer, Input } from "@nextui-org/react";
import { validate, getAddressInfo } from "bitcoin-address-validation";
import { useStore } from "../../../../../store";
import {
	updateUsername,
	updateSetting,
	updateWallet,
} from "../../../../../utils/utils";

export function SettingsTab(props) {
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);
	const [changeName, setChangeName] = useState(true);
	const [changeBTC, setChangeBTC] = useState(true);
	const [name2, setName2] = useState("");
	const [BTCWallet2, setBTCWallet2] = useState("");
	const [selected, setSelected] = useState("");
	return (
		<>
			<Flex justifyContent={"left"} alignItems={"center"}>
				<Card
					css={{
						margin: "$10",
						backgroundColor: "$accents3",
						width: "fit-content",
					}}>
					<Collapse.Group splitted>
						<Collapse
							title='Name'
							subtitle='Displayed on your donation page'>
							{changeName ? (
								<>
									<Input
										value={
											user_value &&
											user_value.data().username
										}
										disabled
										readOnly
										css={{
											width: "400px",
										}}
									/>
									<Spacer />

									<Button
										onClick={() => setChangeName(false)}
										size={"xs"}>
										Change
									</Button>
								</>
							) : (
								<>
									<Input
										value={name2}
										onChange={(e) =>
											setName2(e.target.value)
										}
										status='success'
										css={{
											width: "400px",
										}}
									/>
									<Spacer />
									<Button
										size={"xs"}
										color={"success"}
										onClick={() => [
											updateUsername(db, user, name2),
											setChangeName(true),
										]}>
										Save
									</Button>
								</>
							)}
						</Collapse>
						<Collapse
							title='Bitcon adress'
							subtitle='	You receive donations to your personal
													bitcoin wallet'>
							{changeBTC ? (
								<>
									<Input
										value={
											user_value &&
											user_value.data().wallet
										}
										disabled
										readOnly
										css={{
											width: "400px",
										}}
									/>
									<Spacer />

									<Button
										onClick={() => setChangeBTC(false)}
										size={"xs"}>
										Change
									</Button>
								</>
							) : (
								<>
									<Input
										status='success'
										css={{
											width: "400px",
										}}
										value={BTCWallet2}
										onChange={(e) =>
											setBTCWallet2(e.target.value)
										}
									/>
									<Spacer />
									<Button
										color={"success"}
										onClick={() => [
											updateWallet(db, user, BTCWallet2),
											setChangeBTC(true),
										]}
										size={"xs"}>
										Save
									</Button>
								</>
							)}
						</Collapse>
					</Collapse.Group>
				</Card>
			</Flex>
		</>
	);
}
