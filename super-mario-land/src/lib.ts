import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

const MODEL_PROCESS_ID = "1x2lsMZVr67txPJVZ0OQT7qOGYVP-w9EWqcfF57d0Dc";
const IMG_PROCESS_ID = "WRI4K9G_7DsHA2BH17nT6pk-0nnmMZ7dI-UTD30iSrU";
const DEFAULT_PROMPT =
  "portrait of a pretty blonde woman, a flower crown, earthy makeup, flowing maxi dress with colorful patterns and fringe, a sunset or nature scene, green and gold color scheme";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchImage(
  wallet,
  searchText: string
): Promise<string | null> {
  const messageId = await message({
    process: IMG_PROCESS_ID,
    signer: wallet,
    data: searchText,
  });

  const { Messages } = await result({
    message: messageId,
    process: IMG_PROCESS_ID,
  });

  const imageData = Messages[0].Data;
  return imageData;
}

export async function promptModel(
  wallet,
  textPrompt: string
): Promise<string | null> {
  try {
    const negativePrompt = "disfigured, deformed, ugly";
    const messageId = await message({
      process: MODEL_PROCESS_ID,
      tags: [{ name: "Action", value: "Text-To-Image" }],
      signer: wallet,
      data: `{"aiModelID":"096875a5-ed88-47ae-b420-895da26b4c53","params":{"prompt":"${textPrompt}","negative_prompt":"${negativePrompt}","sampler_name":"DPM++ 2M Karras","batch_size":1,"n_iter":1,"steps":50,"cfg_scale":7,"width":512,"height":512}}`,
    });
    console.log(`Text-To-Image Message ID: ${messageId}`);

    const { Messages } = await result({
      message: messageId,
      process: MODEL_PROCESS_ID,
    });

    const taskID = JSON.parse(Messages[1].Data).taskID;
    console.log(`Task ID is ${taskID}`);

    let data = null;
    let status = "pending";

    while (status === "pending" || data === null || status === "processing") {
      console.log(`Checking status...`);

      const taskMsgId = await message({
        process: MODEL_PROCESS_ID,
        tags: [{ name: "Action", value: "Get-AI-Task" }],
        signer: wallet,
        data: `{"taskID":"${taskID}"}`,
      });
      console.log(taskMsgId);

      const { Messages: taskMsg } = await result({
        message: taskMsgId,
        process: MODEL_PROCESS_ID,
      });
      console.log(taskMsg);

      if (taskMsg.length > 0) {
        data = JSON.parse(taskMsg[0].Data);
        status = data.Status;
      } else {
        data = null;
        status = "pending";
      }

      if (status === "pending" || status === "processing" || data === null) {
        console.log(`Data is not ready yet, waiting for 5 seconds...`);
        await sleep(5000);
      }
    }

    if (data !== null && status !== "processing" && status !== "pending") {
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
