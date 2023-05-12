import { doc, setDoc } from "firebase/firestore";
import { createTheme } from "@nextui-org/react";
import { bitcoinToFiat, fiatToBitcoin } from "bitcoin-conversion";

import { validate, getAddressInfo } from "bitcoin-address-validation";

export async function USDtoBTC(usd) {
	if (usd == "") {
		return 0;
	}
	const paymentInBtcFromUsd = await fiatToBitcoin(usd, "USD");

	return paymentInBtcFromUsd;
}

export const darkThemeNext = createTheme({
	type: "dark",
	theme: {
		colors: {
			// background: "rgba(255, 255, 255, 0)",
		},
	},
});

export function createTicket(
	name,
	amount,
	usdAmount,
	msg,
	id,
	ts,
	ticketId,
	db
) {
	console.log(db);
	setDoc(doc(db, "users", id, "tickets/" + ts), {
		statusColor: "notice",
		status: "search",
		recipientID: id,
		name: name,
		amount: amount,
		usdAmount: usdAmount.toString(),
		msg: msg,
		time: ts,
		show: false,
		id: ticketId,
	});
}

export function updateUsername(db, user, username) {
	setDoc(
		doc(db, "users", user.uid),
		{
			username: username,
		},
		{ merge: true }
	);
}
export function updateWallet(db, user, wallet) {
	if (validate(wallet)) {
		setDoc(
			doc(db, "users", user.uid),
			{
				wallet: wallet,
			},
			{ merge: true }
		);
	}
}

export function updateSetting(db, user, selected, value) {
	if (value && value._document != null) {
		setDoc(
			doc(db, "users", user.uid),
			{
				showMessage: selected,
			},
			{ merge: true }
		);
	}
}

export const qrCodeDownload = () => {
	const svg = document.getElementById("QRCode");
	const svgData = new XMLSerializer().serializeToString(svg);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();
	img.onload = () => {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		const pngFile = canvas.toDataURL("image/png");
		const downloadLink = document.createElement("a");
		downloadLink.download = "QRCode";
		downloadLink.href = `${pngFile}`;
		downloadLink.click();
	};
	img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
};

export function updateShowMessageSetting(db, user, selected, value) {
	if (selected !== "") {
		if (value && value._document != null) {
			setDoc(
				doc(db, "users", user.uid),
				{
					showMessage: selected,
				},
				{ merge: true }
			);
		}
	}
}

export function updateAlertSetting(db, user, alertValue, value) {
	if (alertValue !== "") {
		if (value && value._document != null) {
			setDoc(
				doc(db, "users", user.uid),
				{
					alert: alertValue,
				},
				{ merge: true }
			);
		}
	}
}

export function createUserData(db, user, username, wallet) {
	if (validate(wallet)) {
		setDoc(doc(db, "users", user.uid), {
			id: user.uid,
			username: username,
			wallet: wallet,
			showMessage: true,
			alert: true,
		});
	}
}
