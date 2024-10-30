'use client'
import {useEffect, useState} from "react";
import okxProvider, {useOkx} from "@/app/okx/okxProvider";
import WebApp from "@twa-dev/sdk";
import {ok} from "node:assert";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const okProvider = useOkx();
  const [errorText, setErrorText] = useState("")
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
    return ()=>{
      okProvider?.disconnect();
    }
  }, []);
  const onclick = async ()=>{
    console.log(okProvider);
    if (okProvider==null){
      console.log("None")
      setErrorText("正在连接")
      return
    }
    const session = await okProvider.connect({
      namespaces: {
        solana: {
          chains: ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", //solana mainnet
            "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",//solana testnet
          ],
        }
      },
      sessionConfig: {
        redirect: "tg://resolve"
      }
    })
    setErrorText(JSON.stringify(session));
    console.log("session",session);
  }

  return (
      <div className="p-4">
        {
          userData ? <>
            <h1 className={"text-2xl font-bold mb-4"}>User Data</h1>
            <ul>
              <li>ID:{userData?.id}</li>
              <li>First Name:{userData?.first_name}</li>
            </ul>
          </> : <div>
            Loading...
          </div>
        }
        <button onClick={onclick} className={"btn btn-primary"}>
          连接
        </button>
        <p>{errorText}</p>
      </div>
  );
}
