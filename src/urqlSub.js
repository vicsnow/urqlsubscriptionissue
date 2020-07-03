import React, {useState} from "react";
import {useSubscription} from "urql";
import gql from "graphql-tag";

const sb1 = gql`
	subscription {
		driveWindowChanged(page: 1, count: 30) {
			Mnemonic
			Position
		}
	}
`;
const sb2 = gql`
	subscription {
		driveWindowChanged(page: 1, count: 60) {
			Mnemonic
			Position
		}
	}
`;
const sb3 = gql`
	subscription {
		driveWindowChanged(page: 1, count: 120) {
			Mnemonic
			Position
		}
	}
`;
const subCount = `
	subscription {
		debug
	}
`;
function Window({q}) {
	const [res] = useSubscription({query: q});

	const data = res.data;
	if (!data) {
		return "Error or loading";
	}

	// console.log(data);

	return data.driveWindowChanged ? (
		<div style={{border: "1px solid black"}}>
			{data.driveWindowChanged.length}
		</div>
	) : (
		"nil"
	);
}

export default () => {
	const [q, setq] = useState([sb1, sb1, sb3]);
	const [res] = useSubscription({query: subCount});
	return (
		<div style={{display: "flex", flexDirection: "row"}}>
			{res.data && `subCount: ${res.data.debug}`}
			<button onClick={() => setq([sb1, sb2, sb3])}>q123</button>
			<button onClick={() => setq([sb2, sb2, sb3])}>q223</button>
			<button onClick={() => setq([sb3, sb1, sb1])}>q311</button>
			<button onClick={() => setq([sb1, sb1, sb3])}>q113</button>
			<button onClick={() => setq([sb1, sb1, sb1])}>q111</button>
			<div style={{display: "flex", flexDirection: "column"}}>
				{q.map((o) => (
					<Window q={o} />
				))}
			</div>
		</div>
	);
};
