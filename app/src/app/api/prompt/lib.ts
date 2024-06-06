import { readFileSync } from "node:fs";
import { promisify } from "util";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

const PROCESS_ID = "1x2lsMZVr67txPJVZ0OQT7qOGYVP-w9EWqcfF57d0Dc";
const DEFAULT_PROMPT =
  "portrait of a pretty blonde woman, a flower crown, earthy makeup, flowing maxi dress with colorful patterns and fringe, a sunset or nature scene, green and gold color scheme";

const wallet = JSON.parse(
  readFileSync("/Users/ShuaibYunus/.aos.json").toString()
);

const sleep = promisify(setTimeout);

export async function promptModel(textPrompt: string): Promise<string | null> {
  try {
    const negativePrompt = "disfigured, deformed, ugly";
    const messageId = await message({
      process: PROCESS_ID,
      tags: [{ name: "Action", value: "Text-To-Image" }],
      signer: createDataItemSigner(wallet),
      data: `{"aiModelID":"096875a5-ed88-47ae-b420-895da26b4c53","params":{"prompt":"${textPrompt}","negative_prompt":"${negativePrompt}","sampler_name":"DPM++ 2M Karras","batch_size":1,"n_iter":1,"steps":50,"cfg_scale":7,"width":512,"height":512}}`,
    });
    console.log(`Text-To-Image Message ID: ${messageId}`);

    const { Messages } = await result({
      message: messageId,
      process: PROCESS_ID,
    });

    const taskID = JSON.parse(Messages[1].Data).taskID;
    console.log(`Task ID is ${taskID}`);

    let data = null;
    let status = "pending";

    while (status === "pending" || data === null) {
      console.log(`Checking status...`);

      const taskMsgId = await message({
        process: PROCESS_ID,
        tags: [{ name: "Action", value: "Get-AI-Task" }],
        signer: createDataItemSigner(wallet),
        data: `{"taskID":"${taskID}"}`,
      });
      console.log(taskMsgId);

      const { Messages: taskMsg } = await result({
        message: taskMsgId,
        process: PROCESS_ID,
      });
      console.log(taskMsg);

      if (taskMsg.length > 0) {
        data = JSON.parse(taskMsg[0].Data);
        status = data.Status;
      } else {
        data = null;
        status = "pending";
      }

      if (status === "pending" || data === null) {
        console.log(`Data is not ready yet, waiting for 5 seconds...`);
        await sleep(5000);
      }
    }

    if (data !== null && status !== "pending") {
      console.log(`Data is ready!`);
      const base64Image = data.ResponseData.images[0];
      return base64Image;
    } else {
      return null;
    }

  } catch (e) {
    console.error(e);
    return null;
  }
}