import React from "react";

type TProps = {
	color?: string;
	hoverColor?: string;
};

const BoxLoading = (props: TProps) => {
	const { color, hoverColor } = props;

	const styleEffect = {
		color: color ? color : "text-[#ffffff]",
		hoverColor: hoverColor ? hoverColor : "",
	};

	return (
		<span
			className={`${styleEffect.color} ${styleEffect.hoverColor} inline-block h-[25px] w-[25px]  animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] `}
			role="status"
		></span>
	);
};

export default BoxLoading;
