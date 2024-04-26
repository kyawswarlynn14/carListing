import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import { useLoginMutation } from '../../store/auth/authApi'
import { IMAGES } from '../../constants';

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [login, {isSuccess, error, isLoading}] = useLoginMutation();

    const formik = useFormik({
        initialValues: { email: "", password: ""},
        validationSchema: schema,
        onSubmit:async ({ email, password }) => {
          await login({ email, password })
        }
    });

    useEffect(() => {
        if(isSuccess) {
          toast.success("Login Successfully!");
          navigate('/app');
        }
        if(error) {
          let errorMessage = error?.data?.message ?? error?.error;
          toast.error(errorMessage ?? "Something Went Wrong!");
          console.log("Login error -->", error)
        }
    },[isSuccess, error])

    const {errors, touched, values, handleChange, handleSubmit } = formik;

  return (
      <form onSubmit={handleSubmit} className='LForm'>
          <img 
              src={IMAGES.logo} alt='logo' 
              className='w-20 h-auto mx-auto select-none'
          />

          <div>
            <label htmlFor="email" className='LLabel'>* Email</label>
            <input 
                type="email" 
                value={values.email}
                onChange={handleChange}
                id='email'
                placeholder='Email'
                className={`${errors.email && touched.email && "border-red-500"} LInput`}
            />
            {errors.email && touched.email && (
                <span className='LError'>{errors.email}</span>
            )}
          </div>
          
          <div className='w-full relative'>
              <label htmlFor="password" className='LLabel'>* Password</label>
              <input 
                  type={!show ? "password" : "text"} 
                  value={values.password}
                  onChange={handleChange}
                  id='password'
                  placeholder='Password'
                  className={`${errors.password && touched.password && "border-red-500"} LInput`}
              />
              {!show ? (
                  <AiOutlineEyeInvisible className="absolute bottom-3 right-2 z-10 cursor-pointer" size={20} onClick={() => setShow(true)} />
              ) : (
                  <AiOutlineEye className="absolute bottom-3 right-2 z-10 cursor-pointer" size={20} onClick={() => setShow(false)} />
              )}
          </div>
          {errors.password && touched.password && (
            <span className='LError'>{errors.password}</span>
          )}

          <div className="w-full flex justify-center">
            <button type='submit' className="LAuthButton mt-4">
                <span>{isLoading ? 'Login...' : 'Login'}</span>
            </button>
          </div>

          <div className='w-full m-2 flex items-center justify-center gap-1 text-sm font-semibold'>
            <p>{`Don't have an account?`}</p>
            <Link to={'/auth/register'} className='underline underline-offset-2 text-blue-600'>Register</Link>
          </div>
      </form>
  )
}

export default Login;