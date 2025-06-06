"use client";

import React from "react";
import BoxLoading from "./BoxLoadind";

export interface ButtonCustomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	textContent: string;
	loading?: boolean;
}

const Button = (props: ButtonCustomProps) => {
	const { textContent, loading = false, ...buttonProps } = props;
	return (
		<button
			{...buttonProps}
			className={` ${buttonProps.className} w-full xl:w-[50%] min-h-[3rem] h-max p-[1.6rem_2rem] bg-slate-900 flex gap-[1rem] items-center justify-center text-white  rounded-md text-[1.4rem]`}
		>
			{textContent}
			{loading && <BoxLoading />}
		</button>
	);
};

export default Button;
