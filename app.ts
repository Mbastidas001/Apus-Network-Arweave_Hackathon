import { readFileSync } from "node:fs";
import * as fs from "fs";
import * as path from "path";

import {
  message,
  createDataItemSigner,
  result,
} from "@permaweb/aoconnect";

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
    // const messageId = await message({
    //   process: PROCESS_ID,
    //   tags: [{ name: "Action", value: "Text-To-Image" }],
    //   signer: createDataItemSigner(wallet),
    //   data: '{"aiModelID":"096875a5-ed88-47ae-b420-895da26b4c53","params":{"prompt":"apple","negative_prompt":"","sampler_name":"DPM++ 2M Karras","batch_size":1,"n_iter":1,"steps":50,"cfg_scale":7,"width":512,"height":512}}',
    // });
    // console.log(`Text-To-Image Message ID: ${messageId}`);

    // const { Messages } = await result({
    //   message: messageId,
    //   process: PROCESS_ID,
    // });

    // const taskID = JSON.parse(Messages[1].Data).taskID;

    const TASK_ID = "NTKyHWpj";

    const taskMsgId = await message({
      process: PROCESS_ID,
      tags: [{ name: "Action", value: "Get-AI-Task" }],
      signer: createDataItemSigner(wallet),
      data: `{"taskID":"${TASK_ID}"}`,
    });
    console.log(taskMsgId);

    const { Messages: taskMsg } = await result({
      message: taskMsgId,
      process: PROCESS_ID,
    });
    console.log(taskMsg);

    const base64Image = JSON.parse(taskMsg[0].Data).ResponseData.images[0];

    const outputFilePath: string = path.join(__dirname, "base64-image.html");
    generateHtmlWithBase64Image(base64Image, outputFilePath);
  } catch (e) {
    console.error(e);
  }
})();
