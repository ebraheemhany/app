"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpData } from "@/Schema/Schema";
import Input from "@/component/items/Input";
import { User, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { signUp } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpData) => {
    try {
      const response = await signUp(data.email, data.password, data.username);
      // حفظ ال token في cookies
      if (response.user?.id) {
        document.cookie = `auth_token=${response.user.id}; path=/; max-age=604800`;
      }
      toast.success("Sign Up Successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Sign Up Failed");
    }
  };

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* username */}
          <Input
            name="username"
            placeholder="Full Name"
            icon={<User className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.username}
          />

          {/* email */}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.email}
          />

          {/* password */}
          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon={<ShieldAlert className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.password}
          />

          {/* rest password */}
          <Input
            name="restpassword"
            type="password"
            placeholder="Rest Password"
            icon={<ShieldAlert className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.restpassword}
          />

          <div className="flex items-center justify-center">
            <button className="bg-blue-800 text-white py-2 mx-3 rounded w-[100%] cursor-pointer  ">
              Create Account
            </button>
          </div>
          <p className="text-white text-[16px] mb-3 ml-3 ">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="text-blue-700 cursor-pointer ">
              [Sign in]
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
