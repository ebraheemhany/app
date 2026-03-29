"use client";

import SignUpForm from "@/component/items/SignUpForm";
import Image from "next/image";

const Form = () => {
  return (
    <div className="h-full flex justify-center items-center ">
      <div className="flex w-[70%] mx-auto  bg-black/40 rounded-2xl">
        {/* image and text */}

        <div className="flex-1 bg-[#292C35] w-[40%]">
          <div className="relative w-[500px] h-[300px]">
            <Image src="/icon/outh_1.svg" alt="image" fill />
          </div>

          <h3 className="text-[30px] text-white font-extrabold ml-2 w-[50%] ">
            Start Your Story Here
          </h3>
          <p className="text-white text-[18px] w-[80%] ml-2 ">
            Create an Account in{" "}
            <span className="text-[20px] font-bold cursor-pointer ">
              Yala Book{" "}
            </span>
            to Join a vibrant community.
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

          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default Form;
