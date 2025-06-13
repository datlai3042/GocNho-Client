"use client";
import React, { ReactNode, useId, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import InputPassword from "./InputPassword";

type TProps<FormType extends FieldValues> = {
  FieldKey: Path<FormType>;
  error: FieldErrors<FormType>;
  placeholder: string;
  type: InputType;
  register: UseFormRegister<FormType>;
  watch: UseFormWatch<FormType>;
  style?: React.CSSProperties;
};

const InputText = <FormType extends FieldValues>(props: TProps<FormType>) => {
  const {
    FieldKey,
    error,
    placeholder,
    type,
    register,
    watch,
    style = {},
  } = props;
  const id = useId();
  const [focus, setFocus] = useState(false);
  if (type === "password") {
    return <InputPassword {...props} />;
  }
  return (
    <div
      style={style}
      className="flex flex-col w-full  min-h-[8rem] h-max gap-[.6rem] "
    >
      <label
        style={{
          color: focus ? "var(--color-main)" : "",
          fontWeight: focus ? 700 : "",
        }}
        htmlFor={`${FieldKey}-${id}`}
        className="first-letter:uppercase text-[#3d4f58]  font-semibold text-[1.4rem]"
      >
        {placeholder}
      </label>
      <input
        value={watch(FieldKey)}
        id={`${FieldKey}-${id}`}
        {...register(FieldKey, {
          onBlur: (event) => {
            setFocus(false);
          },
        })}
        onFocus={() => setFocus(true)}
        className="inline-block  input-form w-full min-h-[4.4rem] p-[.6rem_1.2rem] text-[1.4rem] border-[.1rem] border-[rgb(136, 147, 151)] bg-[#fff] opacity-100 rounded-[.6rem] text-text-theme  placeholder:text-[1.3rem] outline outline-[.2rem] focus:font-semibold outline-transparent focus:outline-[#8090ce] focus:border-transparent placeholder:opacity-100 focus:outline-3"
        placeholder={`Nhập ${placeholder} của bạn`}
      />

      {error && error[FieldKey]?.message && (
        <div className="md:pl-[.1rem] mb-[1rem] min-h-[1rem] text-[1.2rem] text-red-400 font-bold my-[.1rem]">
          {<p>{error[FieldKey]?.message as ReactNode}</p>}
        </div>
      )}
      {/* {watch(FieldKey) && <p>{watch(FieldKey)}</p>} */}
    </div>
  );
};

export default InputText;
