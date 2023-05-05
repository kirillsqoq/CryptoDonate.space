import React, { useRef, useState, useEffect, useContext } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { View, Flex, ActionButton, Heading } from "@adobe/react-spectrum";
import { Text, Container, Spacer, Button } from "@nextui-org/react";
import Delete from "@spectrum-icons/workflow/Delete";
import { format } from "fecha";
import { useStore } from "../../../store";
import { CopyOverlayLinkButton } from "../../../shared/CopyOverlayLinkButton";
import { CopyPageLinkButton } from "../../../shared/CopyPageLinkButton";
import { OpenPageButton } from "../../../shared/OpenPageButton";
// import useSound from "use-sound";
// import beep from "../../public/coins.mp3";
function getLastInputs(adress, value, wallet) {
	if (adress == wallet) {
		return value;
	}
}

function getConfirmationTickets(ticket, lastInputs, db) {
	if (ticket.amount == (lastInputs / 100000000).toString()) {
		setDoc(
			doc(db, "users", ticket.recipientID, "tickets/" + ticket.time),

			{
				status: "confirm",
				statusColor: "positive",
				show: true,
			},
			{ merge: true }
		);
	}
}

function comparer(lastInputs, tickets, db) {
	tickets &&
		tickets.docs.map((doc) =>
			getConfirmationTickets(doc.data(), lastInputs, db)
		);
}

function changeStatus(value, tickets, db) {
	//
	if (value) {
		value.data().myAddressTxsMempool.map((v) => {
			v.vout.map((vout) =>
				comparer(
					getLastInputs(
						vout.scriptpubkey_address,
						vout.value,
						value.data().wallet
					),
					tickets,
					db
				)
			);
		});
	}
	return null;
}

async function delDoc(doc) {
	await deleteDoc(doc.ref);
}
function ticketFilter(valueTickets) {
	if (valueTickets) {
		const arr = [];
		const arrConfirm = [];
		valueTickets.docs.map((doc) => arr.push(doc));
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].data().status == "confirm") {
				arrConfirm.push(arr[i]);
			}
		}

		return arrConfirm;
	}
	return null;
}

function convertDate(t) {
	const dateIn = new Date(Number(t) * 1000);

	return dateIn;
}
export function Donations() {
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);

	const confirmTickets = ticketFilter(tickets_value);
	let [copied, setCopied] = useState(false);
	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	}, [copied]);
	let [copied2, setCopied2] = useState(false);

	useEffect(() => {
		if (copied2) {
			setTimeout(() => {
				setCopied2(false);
			}, 2000);
		}
	}, [copied2]);
	// const [play] = useSound(beep, { interrupt: true });
	const [countDonations, setCountDonations] = useState(0);

	useEffect(() => {
		if (confirmTickets && confirmTickets.length) {
			setCountDonations(confirmTickets.length);
		} else setCountDonations(0);
	}, [confirmTickets]);

	useEffect(() => {
		// play();
	}, [countDonations]);

	return (
		<>
			<View
				// borderWidth='thin'
				// borderColor='dark'
				borderRadius='large'
				gridArea='toc'>
				<Container css={{ backgroundColor: "rgba(0,0,0,0)" }}>
					{confirmTickets && confirmTickets.length == 0 && (
						<div id='donations'>
							<Flex
								direction='column'
								justifyContent={"center"}
								alignItems='center'>
								<Container
									css={{
										padding: "$6",
										width: "92%",
										borderRadius: "$lg",
										backgroundColor: "$accents1",
										margin: "$5",
									}}>
									<Spacer y={1} />
									<Flex justifyContent='center'>
										<Text h3>
											You haven't recived donated yet
										</Text>
									</Flex>
									<Spacer y={1} />

									<Flex justifyContent='center'>
										<Text color='warning' h5>
											Don't forget to share this link with
											your followers
										</Text>
									</Flex>
									<Flex
										direction={"column"}
										alignItems='center'
										justifyContent='center'>
										<Spacer y={1.5} />
										<CopyPageLinkButton />
										<Spacer y={1.5} />
										<View marginStart={"size-300"}>
											<OpenPageButton />
										</View>

										<Spacer />
									</Flex>
								</Container>
								<Container
									css={{
										padding: "$6",
										width: "92%",
										borderRadius: "$lg",
										backgroundColor: "$accents1",
										margin: "$5",
									}}>
									<Spacer y={1} />
									<Flex justifyContent='center'>
										<Text h3>
											Donation alerts in OBS Studio
										</Text>
									</Flex>
									<Spacer y={0.8} />

									<Flex justifyContent='center'>
										<Text css={{ color: "$accents6" }} h5>
											Use this link as browser source in
											OBS Studio
										</Text>
									</Flex>
									<Flex
										direction={"column"}
										alignItems='center'
										justifyContent='center'>
										<Spacer y={1.5} />
										<CopyOverlayLinkButton size='xs' />

										<Spacer />
									</Flex>
								</Container>
							</Flex>
						</div>
					)}
					{tickets_value && (
						<div id='donations'>
							<Flex direction={"column-reverse"}>
								{confirmTickets.map((doc) => (
									<React.Fragment key={doc.data().id}>
										<Container
											css={{
												padding: "$6",
												width: "92%",
												borderRadius: "$lg",
												backgroundColor: "$accents1",
												margin: "$5",
											}}>
											<Flex
												alignItems={"center"}
												justifyContent={"space-around"}>
												<Flex direction='row'>
													<Text
														color='success'
														h5
														weight='bold'
														css={{
															marginTop: 8,
														}}>
														${doc.data().usdAmount}
													</Text>
												</Flex>
												<Text h4 weight={"bold"}>
													{doc.data().name}
												</Text>

												<ActionButton
													onPress={() => delDoc(doc)}
													isQuiet>
													<Delete />
												</ActionButton>
											</Flex>
											<Container
												css={{ marginTop: "$5" }}
												padding={"size-0"}>
												<Text>{doc.data().msg}</Text>
											</Container>
											<Flex
												justifyContent='end'
												alignItems={"center"}>
												<Text
													css={{
														color: "$accents4",
													}}>
													{format(
														convertDate(
															doc.data().time
														),
														"mediumDate"
													)}
												</Text>
												<Spacer />
												<Text
													css={{
														color: "$accents4",
													}}>
													{format(
														convertDate(
															doc.data().time
														),
														"shortTime"
													)}
												</Text>
												<Spacer />
											</Flex>
										</Container>
									</React.Fragment>
								))}
							</Flex>
						</div>
					)}

					<View borderRadius='large' gridArea='nav'>
						<Heading></Heading>

						{tickets_value &&
							confirmTickets.map((doc) => (
								<Text key={doc.data().id}>
									{doc.data().staus}
								</Text>
							))}
					</View>
				</Container>
			</View>
		</>
	);
}
