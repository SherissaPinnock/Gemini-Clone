import { createContext, useState } from "react";
import run from "../config/gemini";

// Creating a new context named 'Context'
export const Context= createContext();

// Creating a ContextProvider component that will use the Context created above
const ContextProvider= (props)=>{

    //sets input data
    const [input, setInput]= useState("");
   
    //input data is saved in this recentPrompt
    const [recentPrompt, setRecentPrompt]=useState("");
   
    //an array to store previous prompts in recents
    const [prevPrompts, setPrevPrompts]= useState([]);
    const [showResult, setShowResult]= useState(false);
    
    //will display loading animation if true
    const [loading, setLoading]= useState(false);
    
    //adds the result to the webpage
    const [resultData, setResultData]= useState("");

    //Purpose: typing effect
    const delayPara = (index, nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        }, 75*index)
    }
    const newChat=()=>{
        setLoading(false);
        setShowResult(false)
    }

    // Asynchronous function that takes a prompt and calls the 'run' function with it
    const onSent = async (prompt)=>{

        //result data will be reset so prev response is removed from state variable
        setResultData("");
        setLoading(true)
        setShowResult(true)
        let response;
        //logic to click on recent response
        if(prompt !== undefined){
            response= await run(prompt)
            setRecentPrompt(prompt)
        }else{
            setPrevPrompts(prev=>[...prev, input])
            setRecentPrompt(input)
            response= await run(input);
        }
        
        //bolds text
        let responseArray= response.split("**")
        let newResponse="";
        for(let i=0; i<responseArray.length; i++){
            if(i==0 || i%2!==1){
                newResponse += responseArray[i];

            }else{
                newResponse += "<b>"+ responseArray[i]+ "</b>";
            }
        }
        //splits text where it sees single star
        let newResponse2= newResponse.split("*").join("</br>")
        let newResponseArray= newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length; i++){
            const nextWord= newResponseArray[i];
            delayPara(i, nextWord+" ");
        }
        setResultData(newResponse2)
        setLoading(false)
        setInput("")
    
    }

    
    const contextValue= {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;