import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	doc,
	setDoc,
	Timestamp,
} from "firebase/firestore";
import {
	useCollectionData,
	useCollection,
	useDocument,
} from "react-firebase-hooks/firestore";

import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";
import {
	Progress,
	Text,
	Card,
	Input,
	Grid,
	Textarea,
	Button,
	createTheme,
	NextUIProvider,
	Container,
	Modal,
	Spacer,
	Loading,
	Link,
	useModal,
	Row,
	useInput,
	Radio,
} from "@nextui-org/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Flex } from "@adobe/react-spectrum";
import { useDonationPageStore, useStore } from "../../store";
import { TwitterLink } from "../../shared/TwitterLink";
import { CryptoDonateLink } from "../../shared/CryptoDonateLink";
import { darkThemeNext, USDtoBTC, createTicket } from "../../utils/utils";

function DonateCard() {
	const {
		usdAmount,
		valueFirestore,
		amount,
		status,
		btcAmount,
		currentTicket,
		setBtcAmount,
	} = useDonationPageStore((state) => state);

	useEffect(() => {
		amount && amount.then((v) => setBtcAmount(v.toFixed(6)));
	}, [amount]);

	if (!valueFirestore) {
		return (
			<>
				<Flex
					justifyContent={"center"}
					alignItems='center'
					height={"100vh"}
					direction='column'>
					<Loading size='md' />
				</Flex>
			</>
		);
	}

	if (valueFirestore.data() != undefined) {
		if (status) {
			if (currentTicket) {
				return <PaidTiket />;
			}
		}
		return <DonateForm />;
	}

	return (
		<Flex
			justifyContent={"center"}
			gap='size-1000'
			alignItems='center'
			height={"90vh"}>
			<h1>User not found</h1>
		</Flex>
	);
}
function DonateForm(props) {
	const db = useStore((state) => state.db);
	const {
		valueFirestore,
		ts,
		btcAmount,
		usdAmount,
		ticketId,
		name,
		msg,
		setName,
		setMsg,
		setStatus,
		setAmount,
	} = useDonationPageStore((state) => state);
	const { setVisible, bindings } = useModal();
	return (
		<>
			<Flex
				justifyContent={"center"}
				alignItems='center'
				height={"90vh"}
				direction='column'
				gap='size-1000'>
				<Flex direction='column'>
					<Container
						css={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Header />
						<Spacer y={0.2} />
						<CurrencySelection />
					</Container>
					<Spacer y={0.2} />
				</Flex>

				<Spacer y={1.8} />

				<NameInput />
				<Spacer y={1.5} />

				<AmountInput />
				<Spacer y={1.5} />

				<MessageInput />
				<Spacer y={2} />

				<Flex direction={"column"} justifyContent='center'>
					<Button
						css={{
							width: "200px",
						}}
						auto
						flat
						onClick={() => [setVisible(true)]}>
						Send
					</Button>

					<Modal
						closeButton
						width='600px'
						blur
						aria-labelledby='modal-title'
						aria-describedby='modal-description'
						{...bindings}>
						<Modal.Header></Modal.Header>
						<Modal.Body>
							<Flex
								direction={"column"}
								alignItems='center'
								justifyContent='center'>
								<Text h3 id='modal-description'>
									Send
								</Text>
								<Spacer y={0.2} />

								<CopyAmountToClipboard />

								<Spacer y={1} />

								<Text h3 id='modal-description'>
									to Bitcoin adress
								</Text>
								<Spacer y={0.3} />
								<CopyWalletToClipboard />
								<Card
									css={{
										width: "min-content",
										marginTop: "$4",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<QRCode
										size={100}
										value={valueFirestore.data().wallet}
									/>
								</Card>
							</Flex>
						</Modal.Body>
						<Modal.Footer>
							<Button
								flat
								auto
								color='error'
								onClick={() => setVisible(false)}>
								Refuse
							</Button>
							<Button
								onClick={() => [
									setVisible(false),
									setStatus(true),
									createTicket(
										name,
										btcAmount,
										usdAmount,
										msg,
										valueFirestore.id,
										ts,
										ticketId,
										db
									),
								]}
								size={"sm"}>
								I`ve paid
							</Button>
						</Modal.Footer>
					</Modal>
				</Flex>

				<Spacer />
				<Spacer />

				<CryptoDonateLink />
				<Spacer y={0} />
				<TwitterLink />
			</Flex>
		</>
	);
}
function PaidTiket(props) {
	const {
		valueFirestore,
		valueTickets,
		currentTicket,
		ts,
		setBtcAmount,
		setStatus,
		setAmount,
		setTicketId,
		reset,
	} = useDonationPageStore((state) => state);

	return (
		<>
			<Flex
				height={"100vh"}
				justifyContent='center'
				alignItems={"center"}
				direction='column'>
				<Text
					h1
					size={45}
					css={{
						padding: "20px",
						textGradient: "45deg, $blue500 -20%, $pink500 50%",
					}}
					weight='bold'>
					Donate to {valueFirestore.data().username}
				</Text>
				<Spacer y={3} />
				{currentTicket.show ? (
					<>
						<Text h2 color='success'>
							Transaction detected!
						</Text>
					</>
				) : (
					<>
						<Progress
							css={{
								marginTop: "$10",
								minWidth: "30%",
								maxWidth: "50%",
							}}
							shadow
							indeterminated
							color='gradient'
							status='secondary'
						/>
						<Spacer y={3} />
						<Text h2 color='text'>
							search transaction...
						</Text>
					</>
				)}

				<Spacer y={3} />
				<Button
					onClick={
						() => reset()
						// 	[
						// 	setStatus(false),
						// 	setTicketId(uuidv4()),
						// 	setAmount(0),
						// 	setBtcAmount(0),
						// ]
					}
					css={{ marginTop: "$10" }}>
					Send another donation
				</Button>
				<Spacer />
				<Spacer />
				<CryptoDonateLink />
				<Spacer y={0} />
				<TwitterLink />
				<Spacer />
			</Flex>
		</>
	);
}
function CopyWalletToClipboard() {
	let [copied, setCopied] = useState(false);
	const { valueFirestore } = useDonationPageStore((state) => state);

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	}, [copied]);

	return (
		<CopyToClipboard
			text={valueFirestore.data().wallet}
			onCopy={() => setCopied(true)}>
			{copied ? (
				<Link block color='warning'>
					Copied!
				</Link>
			) : (
				<Link
					css={{
						scale: 0.9,
					}}
					block
					color='warning'
					//  href='http://localhost:3000/'
				>
					{valueFirestore.data().wallet}
				</Link>
			)}
		</CopyToClipboard>
	);
}
function CopyAmountToClipboard() {
	let [copied, setCopied] = useState(false);
	const { btcAmount } = useDonationPageStore((state) => state);
	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	}, [copied]);

	return (
		<CopyToClipboard text={btcAmount} onCopy={() => setCopied(true)}>
			{copied ? (
				<Link block color='success'>
					Copied!
				</Link>
			) : (
				<Link
					block
					color='success'
					//  href='http://localhost:3000/'
				>
					{btcAmount}
				</Link>
			)}
		</CopyToClipboard>
	);
}
function CurrencySelection() {
	return (
		<Radio.Group size={"sm"} value='btc'>
			<Container
				css={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "$10",
				}}>
				<Radio color={"success"} value={"btc"}>
					BTC
				</Radio>
				<Radio disabled color={"success"} value={"eth"}>
					ETH
				</Radio>
				<Radio disabled color='success' value={"usdt"}>
					USDT
				</Radio>
			</Container>
		</Radio.Group>
	);
}
function Header() {
	const { valueFirestore } = useDonationPageStore((state) => state);
	return (
		<Text
			h1
			size={50}
			css={{
				marginRight: "$5",
				marginTop: "$10",
				alignItems: "center",
				textGradient: "45deg, $blue500 -20%, $pink500 50%",
			}}
			weight='bold'>
			Donate to {valueFirestore.data().username}
		</Text>
	);
}
function NameInput() {
	const { setName } = useDonationPageStore((state) => state);
	return (
		<Input
			onChange={(e) => setName(e.target.value)}
			size='md'
			width='300px'
			type={"text"}
			labelLeft={<Text>Name</Text>}
		/>
	);
}
function AmountInput() {
	const { setAmount, setUsdAmount } = useDonationPageStore((state) => state);
	return (
		<Input
			onChange={(e) => [
				setAmount(USDtoBTC(e.target.value)),
				setUsdAmount(e.target.value),
			]}
			size='md'
			width='300px'
			type={"number"}
			labelLeft={<Text>$</Text>}
		/>
	);
}
function MessageInput() {
	const { setMsg } = useDonationPageStore((state) => state);
	return (
		<Textarea
			onChange={(e) => setMsg(e.target.value)}
			width='300px'
			placeholder='write your message'
			minRows={3}
			maxRows={6}
		/>
	);
}
export function DonationPage() {
	const app = useStore((state) => state.app);
	const {
		setValueFirestore,
		setValueTickets,
		setCurrentTicket,
		currentTicket,
	} = useDonationPageStore((state) => state);
	const { id } = useParams();
	const [valueFirestore, loading, error] = useDocument(
		doc(getFirestore(app), "users", id)
	);
	const [valueTickets, loadingTickets, errorTickets] = useCollection(
		collection(getFirestore(app), "users", id, "tickets/"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	useEffect(() => {
		setValueFirestore(valueFirestore);
		setValueTickets(valueTickets);
		setCurrentTicket();
		fetch("https://server-express-tpo4.onrender.com/", { mode: "no-cors" });
	}, [valueTickets]);

	useEffect(() => {
		console.log(currentTicket);
	}, [currentTicket]);

	return (
		<>
			<NextUIProvider theme={darkThemeNext}>
				<div>
					<DonateCard />
				</div>
			</NextUIProvider>
		</>
	);
}
