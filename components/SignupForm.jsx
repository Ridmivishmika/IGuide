"use client"
import React, { useEffect, useState } from "react";
import Input from './Input'
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from './SignupForm.module.css';

const initialState = {
    name:"",
    email:"",
    user_name:"",
    password:""
}
const SignupForm = () => {
    const [hydrated,setHydrated] = useState(false);

    const [state,setState] = useState(initialState);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");
    const [isLoading,setisLoading] = useState(false);

    const router = useRouter();

    useEffect(() =>{
        setHydrated(true)
    },[])

    if(!hydrated){
        return null;
    }

    const handleChange = (event) =>{
        setError("");
        setState({...state,[event.target.name]:event.target.value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        const {name,email,user_name,password} = state;

        if(!name || !email || !user_name || !password){
            setError("All feiled is required");
            return;
        }

        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,4}/;

        if(!pattern.test(email)){
            setError("Enter valid email");
            return;
        }

        try{
            setisLoading(true);
            const newUser = {
                name,email,user_name,password
            }

            const response = await fetch("http://localhost:3000/api/signup",{
                headers:{
                    "Content-type":"application/json"
                },
                method: "POST",
                body:JSON.stringify(newUser)
            })

            if(response?.status === 201){
                setSuccess("Registratio successful");
                setTimeout( () =>{
                    router.push("/admin",{scroll:false})
                },1000)
            }else{
                setError("Registration Fail");
            }
        }catch(error){
            console.log(error)
        }

        setisLoading(false);
    }
    return(
      <div className={styles['signup-page-container']}>
  <h2>Sign Up</h2>
  <section className={styles['signup-form-section']}>
    <form onSubmit={handleSubmit}>
      <Input label="Name" type="text" name="name" onChange={handleChange} value={state.name} />
      <Input label="Email" type="text" name="email" onChange={handleChange} value={state.email} />
      <Input label="User Name" type="text" name="user_name" onChange={handleChange} value={state.user_name} />
      <Input label="Password" type="password" name="password" onChange={handleChange} value={state.password} />

      {error && <div className={styles['signup-error-message']}>{error}</div>}
      {success && <div className={styles['signup-success-message']}>{success}</div>}

      <button type="submit">
        {isLoading ? "Loading" : "Signup"}
      </button>
      <p>
        Already a user?
        <Link href={"/login"} className={styles.link}>Login</Link>
      </p>
    </form>
  </section>
</div>

    )
}

export default SignupForm;