"use client";

import { FieldError, UseFormRegister } from "react-hook-form";
import { FormData } from "@/Schema/Schema";

type InputProps = {
  name: keyof FormData;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  register: UseFormRegister<FormData>;
  error?: FieldError;
};

const Input = ({
  name,
  type = "text",
  placeholder,
  icon,
  register,
  error,
}: InputProps) => {
  return (
    <div>
      <div className="w-[95%] mx-auto bg-[#292C35] rounded-lg flex items-center gap-2 text-gray-100 p-3">
        {icon}
        <input
          type={type}
          {...register(name)}
          className="w-full outline-none bg-transparent"
          placeholder={placeholder}
        />
      </div>

      {error && (
        <p className="text-red-400 text-[11px] ml-3">{error.message}</p>
      )}
    </div>
  );
};

export default Input;
