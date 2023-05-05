import { doc, setDoc } from "firebase/firestore";

import { createTheme } from "@nextui-org/react";
import { bitcoinToFiat, fiatToBitcoin } from "bitcoin-conversion";
import React, { useRef, useState, useEffect, useContext } from "react";
import { format } from "fecha";

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

//

export const lineRef = [
	{
		name: "Yesterday",
		uv: 4000,
		pv: 0,
		amt: 2400,
	},

	{
		name: "Today",
		uv: 2390,
		pv: 0,
		amt: 2500,
	},
];
export function ticketFilter(valueTickets) {
	if (valueTickets) {
		const arr = [];
		const arrConfirm = [];
		valueTickets.docs.map((doc) => arr.push(doc.data()));
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].status == "confirm") {
				arrConfirm.push(arr[i]);
			}
		}

		return arrConfirm;
	}
	return null;
}
export function sum(confirmTickets, mounth) {
	if (confirmTickets && mounth) {
		const lastMounth = getLastMounthDonates(confirmTickets, mounth);
		// console.log(lastMounth);
		if (lastMounth.length == 0) {
			return 0;
		}
		let sum = 0;
		if (lastMounth.length > 0) {
			// console.log(lastMounth);
			for (let i = 0; i < lastMounth.length; i++) {
				sum += Number(lastMounth[i].pv);
			}
		}

		return sum;
	}
	return 0;
}
export function countDonate(confirmTickets, mounth) {
	if (confirmTickets && mounth) {
		return confirmTickets.length;
	}
	return 0;
}

export function getLastMounthDonates(confirmTickets, mounth) {
	if (confirmTickets) {
		// console.log(confirmTickets, mounth);
		const arr = [];
		for (let i = 0; i < confirmTickets.length; i++) {
			const date = format(
				new Date(Number(confirmTickets[i].time) * 1000),
				"MMMM"
			);
			// console.log(date, mounth);
			if (date == mounth) {
				// console.log(date, mounth);

				arr.push(confirmTickets[i]);
			}
		}

		const stonksDays = [];

		for (let i = 0; i < arr.length; i++) {
			stonksDays.push(format(new Date(arr[i].time * 1000), "DD"));
		}
		const uniqueStonksDays = stonksDays.filter(function (item, pos) {
			return stonksDays.indexOf(item) == pos;
		});
		// console.log(uniqueStonksDays);
		function sumDay(day) {
			const thisDay = [];
			let sum = 0;
			for (let i = 0; i < arr.length; i++) {
				if (
					format(new Date(arr[i].time * 1000), "DD") ==
					uniqueStonksDays[day]
				) {
					sum = sum + Number(arr[i].usdAmount);
				}
			}
			// console.log(uniqueStonksDays);
			return { pv: sum, name: uniqueStonksDays[day] + " " + mounth };
		}
		const chartData = [];

		for (let i = 0; i < uniqueStonksDays.length; i++) {
			chartData.push(sumDay(i));
		}
		// console.log(chartData);
		return chartData;
	}
}
