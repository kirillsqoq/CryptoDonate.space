import React, { useRef, useState, useEffect, useContext } from "react";

import Copy from "@spectrum-icons/workflow/Copy";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Tooltip } from "@nextui-org/react";
import { useStore } from "../store";

export function CopyOverlayLinkButton(props) {
	const user = useStore((state) => state.user);
	let [copiedOverlayLink, setCopiedOverlayLink] = useState(false);
	useEffect(() => {
		if (copiedOverlayLink) {
			setTimeout(() => {
				setCopiedOverlayLink(false);
			}, 2000);
		}
	}, [copiedOverlayLink]);
	return (
		user &&
		user.uid && (
			<>
				<CopyToClipboard
					text={"http://cryptodonate.space/overlay/" + user.uid}
					onCopy={() => setCopiedOverlayLink(true)}>
					{copiedOverlayLink ? (
						<Button
							css={{
								marginRight: "$10",
							}}
							flat
							color='success'
							auto
							size={props.size}>
							<Copy marginEnd={"size-100"} />
							Copied!
						</Button>
					) : (
						<Tooltip
							color='invert'
							placement='bottom'
							content={
								"Use this link as browser source in OBS Studio."
							}>
							<Button
								css={{
									marginRight: "$10",
								}}
								color='secondary'
								auto
								size={props.size}>
								<Copy marginX={"size-100"} />
								Overlay Link
							</Button>
						</Tooltip>
					)}
				</CopyToClipboard>
			</>
		)
	);
}
