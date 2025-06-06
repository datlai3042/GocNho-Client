import { validateEmail } from "@/app/core/Components/Form/form.util";
import * as z from "zod";

export const registerSchema = z.object({
	user_first_name: z.string().min(1, { message: "Họ là bắt buộc" }),
	user_last_name: z.string().min(1, { message: "Tên là bắt buộc" }),
	user_email: z
		.string()
		.min(1, { message: "Email là bắt buộc" })
		.refine((e) => validateEmail(e), { message: "Email không hợp lệ" }),
	user_password: z.string().min(5, { message: "Ít nhất 5 kí tự" }),
	confirm_password: z.string().min(5, { message: "Xác nhận mật khẩu phải 5 kí tự" }),
});
// .refine((form) => form.password === form.confirm_password, {
// 	message: "Mật khẩu không khớp",
// 	path: ["confirm_password"],
// });

export type RegisterType = z.infer<typeof registerSchema>;
