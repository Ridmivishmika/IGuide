import React from "react";
import SignupForm from "@/components/SignupForm";

const Signup = async() =>{

    // const session = await getServerSession(authOptions)
    // if(session) redirect("/signup")
    return(
        <div>
            <SignupForm/>
        </div>
    )
}

export default Signup 