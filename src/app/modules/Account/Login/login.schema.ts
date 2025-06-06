import { validateEmail } from "@/app/core/Components/Form/form.util";
import * as z from "zod";

export const loginSchema = z.object({
	user_email: z
		.string()
		.min(1, { message: "Email là bắt buộc" })
		.refine((e) => validateEmail(e), { message: "Email không hợp lệ" }),
	user_password: z.string().min(5, { message: "Ít nhất 5 kí tự" }),
});

export type LoginType = z.infer<typeof loginSchema>;