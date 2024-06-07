import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as aoconnect from "@permaweb/aoconnect";
import { promptModel , prompt_array} from "./lib";
 


const PROCESS_ID = "1x2lsMZVr67txPJVZ0OQT7qOGYVP-w9EWqcfF57d0Dc"

async function messageResult(tags, data) {
  try {
    const messageId = await aoconnect.message({
      process: PROCESS_ID,
      tags: Object.entries(tags).map(([name, value]) => ({ name, value })),
      signer: aoconnect.createDataItemSigner(globalThis.arweaveWallet),
      data: JSON.stringify(data),
    });
  
    const messageReturn = await aoconnect.result({
      // the arweave TXID of the message
      message: messageId,
      // the arweave TXID of the process
      process: PROCESS_ID,
    });

    if (messageReturn.Messages != null) {
      if (messageReturn.Messages[0] && messageReturn.Messages[0]?.Data?.includes("[Error]")) {
        throw new Error(messageReturn.Messages[0].Data)
      } else {
        return messageReturn
      }
    }
    throw new Error(messageReturn.Error)
  } catch (e) {
    console.error(e)
    return {
      Output: null,
      Messages: null,
      Spawns: [],
      Error: e
    }
  }
}



function App() {
  const [base64Img, setBase64Img] = useState()
  const [loading, setLoading] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [prompt, setPrompt] = useState(''); // State to store the user prompt
  
  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      <button onClick={async () => {
        await window.arweaveWallet.connect(
          // request permissions to read the active address
          ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
          // provide some extra info for our app
          {
            name: "Super Cool App",
            logo: "https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk"
          }
        );
      }}>Connect Wallet</button>

      <input
        type="text"
        value={prompt}
        onChange={handleInputChange}
        placeholder="Enter your prompt"
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '300px' }}
      />

      <button onClick={async () => {
        try {
          if (loading) return;
          setLoading(true);
          const pm = prompt || prompt_array[Math.floor(Math.random() * prompt_array.length)]
          console.log(pm);
          const image = await promptModel(
            aoconnect.createDataItemSigner(globalThis.arweaveWallet),
            pm
          );
          setPromptText(pm);
          setBase64Img(image);

        } finally {
          setLoading(false);
        }
      }}>{loading ? 'loading' : 'Generate Image'}</button>
      <div>{promptText}</div>


      {base64Img && <img src={`data:image/jpeg;charset=utf-8;base64, ${base64Img}`} style={{ width: 512, height: 512 }} />}
    </div>

     
  )
}

export default App
