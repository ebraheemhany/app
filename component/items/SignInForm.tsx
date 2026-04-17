"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInData } from "@/Schema/Schema";
import Input from "@/component/items/Input";
import { Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const SignInForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInData) => {
    try {
      const response = await signIn(data.email, data.password);
      // حفظ ال token في cookies
      if (response.session?.access_token) {
        document.cookie = `auth_token=${response.session.access_token}; path=/; max-age=604800`;
      }
      toast.success("Sign In Successfully");
      router.push("/");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Sign In Failed");
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex items-center justify-center">
          <button className="bg-blue-800 text-white py-2 mx-3 rounded w-full cursor-pointer  ">
            Sign In
          </button>
        </div>
        <p className="text-white text-[16px] mb-3 ml-3 ">
          Don&apos;t have an account?{" "}
          <Link href={"/sign-up"} className="text-blue-700 cursor-pointer ">
            [Sign Up]
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
