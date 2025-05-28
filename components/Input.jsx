import React from "react";

const Input = ({type,value,onChange,name,label,placeholder}) =>{
    return(
        <div>
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} name={name} placeholder={placeholder}/>
         </div>
    )
}

export default Input