"use client"
import React ,{useEffect,useState}from "react";
import Input from './Input'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const initialState = {
    email:"",
    password:""
}
const LoginForm = () => {

    const [state,setState] = useState(initialState);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");
    const [isLoading,setisLoading] = useState(false);

    const router = useRouter();
      const [hydrated,setHydrated] = useState(false)
    
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

        const {email,password} = state;

        if( !email ||  !password){
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
         
           const res = await signIn("credentials",{
            email,password,redirect:false
           })

           if(res?.error){
            setError("Invalid credential")
            setisLoading(false)
            return;
           }
            // if(res?.status === 201){
            //     setSuccess("Registratio successful");
            //     setTimeout( () =>{
            //         router.push("/pastpapers")
            //     },1000)
            // }else{
            //     setError("Login Fail");
            // }

           router.push("/admin")
        }catch(error){
            console.log(error)
        }

        setisLoading(false);
    }

    return(
        
        <div>
            <h2>Login </h2>
                <section>
                    <form  onSubmit={handleSubmit}>
                        <Input label="Email" type="text" name="email" onChange={handleChange} value={state.email}/>
                        <Input label="Password" type="password" name="password" onChange={handleChange} value={state.password}/>
                         {
                            error && <div>{error}</div>
                        }

                        {
                            success && <div>{success}</div>
                        }
                        <button type="submit">    
                            {isLoading? "Loading" : "Login"}
                        </button>
                        <p>Haven't Account</p>
                        <Link href={"/signup"}>Signup</Link>
                    </form>
                </section>
        </div>
    )
}

export default LoginForm;