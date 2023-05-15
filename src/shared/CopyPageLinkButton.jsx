import React, { useRef, useState, useEffect, useContext } from "react";
import Copy from "@spectrum-icons/workflow/Copy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Tooltip } from "@nextui-org/react";
import { useStore } from "../store";

export function CopyPageLinkButton() {
	let [copiedPageLink, setCopiedPageLink] = useState(false);
	const user = useStore((state) => state.user);
	useEffect(() => {
		if (copiedPageLink) {
			setTimeout(() => {
				setCopiedPageLink(false);
			}, 2000);
		}
	}, [copiedPageLink]);
	return (
		user &&
		user.uid && (
			<>
				<CopyToClipboard
					text={"http://cryptodonate.space/user/" + user.uid}
					onCopy={() => setCopiedPageLink(true)}>
					{copiedPageLink ? (
						<Button color='success' flat auto size='xs'>
							<Copy marginEnd={"size-100"} />
							Copied!
						</Button>
					) : (
						<Tooltip
							color='invert'
							placement='bottom'
							content={"Don't forget to share this link"}>
							<Button color={"secondary"} auto size='xs'>
								<Copy marginEnd={"size-100"} />
								Profile Link
							</Button>
						</Tooltip>
					)}
				</CopyToClipboard>
			</>
		)
	);
}
