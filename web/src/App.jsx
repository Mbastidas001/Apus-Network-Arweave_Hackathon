import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as aoconnect from "@permaweb/aoconnect";
import { promptModel } from "./lib";


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
      <button onClick={async () => {
        try {
          if (loading) return
          setLoading(true)
          const image = await promptModel(
            aoconnect.createDataItemSigner(globalThis.arweaveWallet),
            "portrait of a pretty blonde woman, a flower crown, earthy makeup, flowing maxi dress with colorful patterns and fringe, a sunset or nature scene, green and gold color scheme",
          );
          // const { Messages } = await messageResult({ Action: "Get-AI-Task"}, { "taskID": "gMx9mj8C" })
          // const res = JSON.parse(Messages[0].Data)
          // setBase64Img(res.ResponseData.images[0])
          setBase64Img(image)
        } finally {
          setLoading(false)
        }
      }}>{loading ? 'loading' : 'Message AO Process'}</button>
      {base64Img && <img src={`data:image/jpeg;charset=utf-8;base64, ${base64Img}`} style={{ width: 512, height: 512 }} />}
    </div>
  )
}

export default App
