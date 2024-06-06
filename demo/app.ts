import { readFileSync } from "node:fs";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";

// Promisify the setTimeout function
const sleep = promisify(setTimeout);

const wallet = JSON.parse(
  readFileSync("/Users/ShuaibYunus/.aos.json").toString()
);

const PROCESS_ID = "1x2lsMZVr67txPJVZ0OQT7qOGYVP-w9EWqcfF57d0Dc";

function generateHtmlWithBase64Image(
  base64Image: string,
  outputFilePath: string
): void {
  // Generate the HTML content
  const htmlContent: string = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Base64 Image</title>
</head>
<body>
  <h1>Base64 Image</h1>
  <img src="data:image/jpeg;base64,${base64Image}" alt="Base64 Image">
</body>
</html>
  `;

  fs.writeFileSync(outputFilePath, htmlContent, "utf8");
  console.log(
    `HTML file with base64 image has been generated at ${outputFilePath}.`
  );
}

(async function () {
  try {
    const textPrompt =
      "portrait of a pretty blonde woman, a flower crown, earthy makeup, flowing maxi dress with colorful patterns and fringe, a sunset or nature scene, green and gold color scheme";
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

    while (status === "pending" || data === null || status === "processing") {
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
})();
