import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useActivationMutation } from "../../store/auth/authApi";

const VerifyOtp = () => {
  const [searchParams, setSearchParams ] = useSearchParams();
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      navigate("/auth/login");
    }
    if (error) {
      let errorMessage = error?.data?.message ?? error?.error;
      toast.error(errorMessage ?? "Something Went Wrong!");
      console.log("Verify error -->", error);
    }
  }, [isSuccess, error]);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });
  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      email: searchParams.get('email'),
      otp: verificationNumber,
    });
  };
  const handleInputChange = (index, value) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className='LForm'>
      <h1 className="text-center font-bold text-lg">Verify Your Account</h1>

      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] bg-[#497DF2] flex items-center justify-center rounded-full">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center justify-center text-[18px] font-Poppins outline-none text-center font-semibold text-lg ${
              invalidError ? "shake border-red-500" : "border-black "
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <div className="w-full flex justify-center">
        <button className={`LAuthButton w-fit px-8`} onClick={verificationHandler}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>

      <div className='w-full m-2 flex items-center justify-center gap-1 text-sm font-semibold'>
        <p>Go back to login in?</p>
        <Link to={'/auth/login'} className='underline underline-offset-2 text-blue-600'>Login</Link>
      </div>
    </div>
  );
};

export default VerifyOtp;
