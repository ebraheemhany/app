import SignInForm from "@/component/items/SignInForm";
import Image from "next/image";
import React from "react";
import { supabase } from "@/lib/supabase";
const SignIn = async () => {
  const { data, error } = await supabase.from("users").select("*");

  console.log(data, error);

  return (
    <div className="h-full flex justify-center items-center ">
      <div className="flex w-[70%] mx-auto  bg-black/40 rounded-2xl">
        {/* image and text */}

        <div className="flex-1 bg-[#292C35] w-[40%]">
          <div className="relative w-[500px] h-[300px]">
            <Image src="/icon/outh_2.svg" alt="image" fill />
          </div>

          <h3 className="text-[30px] text-white font-extrabold ml-2 w-[50%] ">
            Connect with the World.
          </h3>
          <p className="text-white text-[18px] w-[80%] ml-2 ">
            Welcom back to{" "}
            <span className="text-[20px] font-bold cursor-pointer ">
              Yala Book!{" "}
            </span>
            Log in to continue your journey.
          </p>
        </div>

        {/* form */}
        <div className="flex-1 flex flex-col w-[60%]">
          <h2 className="text-[30px] text-blue-700 font-serif font-bold text-center mt-4 ">
            Yala Book
          </h2>
          <h3 className="text-[25px] text-white font-bold py-2 ml-3 ">
            Create Your Account
          </h3>
          <p className="text-white text-[18px] font-bold pb-5 ml-3">
            Join Us Today!
          </p>

          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
