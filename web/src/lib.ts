import { promisify } from "util";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

const PROCESS_ID = "1x2lsMZVr67txPJVZ0OQT7qOGYVP-w9EWqcfF57d0Dc";
const PROMPT_1 = "portrait of a pretty blonde woman, a flower crown, earthy makeup, flowing maxi dress with colorful patterns and fringe, a sunset or nature scene, green and gold color scheme";
const PROMPT_2 = "an AI art piece that highlights the excitement of a turbo boost, with Mario's kart emitting flames and sparks as he accelerates";
const PROMPT_3 = "a beautiful portrait of a majestic hatchling dragon offering a pearl to the viewer, glowing gem, pure gold and reflective scales, defined eyes, intricate patterns, detailed scales, detailed eyes, fierce, powerful, 8k, sharp intricate details, masterpiece, imaginary, beastly, baby dragon, pearlescent, octane render, UE4, 3D model";
const PROMPT_4 = "3d image, cute girl, in the style of Pixar --ar 1:2 --stylize 750";
const PROMPT_5 = "generate a photo of a flat origami logo representing Dumdum, the green elephant mascot of AO Ventures, viewed straight-on against a pristine white background. The origami is predominantly green , skillfully capturing Dumdum's distinctive features with sharp, defined folds. These include Dumdum's large, friendly elephant ears, cool sunglasses, and a playful expression. The elephant is depicted holding a glass of orange jouce(spelled joose). The image suggests the style of macro photography, akin to a shot taken with a Canon EOS R5 at f/2.8, 1/125s, ISO 100. ensure he has a glass of orange juice(spelled joose).";

export const prompt_array: string[] = [PROMPT_1, PROMPT_2, PROMPT_3, PROMPT_4, PROMPT_5];

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function promptModel(wallet, textPrompt: string): Promise<string | null> {
  try {
    const negativePrompt = "disfigured, deformed, ugly";
    const messageId = await message({
      process: PROCESS_ID,
      tags: [{ name: "Action", value: "Text-To-Image" }],
      signer: wallet,
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

    while (status === "pending" || data === null || status === "processing") {
      console.log(`Checking status...`);

      const taskMsgId = await message({
        process: PROCESS_ID,
        tags: [{ name: "Action", value: "Get-AI-Task" }],
        signer: wallet,
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