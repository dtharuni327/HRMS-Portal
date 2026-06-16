import React from "react";

type Props = {
	title: string;
	subtitle?: string;
	stretch?: boolean; // when true, shift left to start near sidebar and extend to right
};

const ClientHeader: React.FC<Props> = ({ title, subtitle, stretch = false }) => {
	const style: React.CSSProperties | undefined = stretch
		? {
				position: "relative",
				left: "-292px",
				width: "calc(100vw - 120px)",
			}
		: undefined;

	return (
		<div className="mb-6">
			<div style={style} className="rounded-3xl bg-[#0f2438] p-8 shadow-lg">
				<h1 className="text-3xl font-black text-white">{title}</h1>
				{subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
			</div>
		</div>
	);
};

export default ClientHeader;

