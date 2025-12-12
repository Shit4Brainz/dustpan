import express, { Request, Response } from "express";
import cors from "cors";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
const dir = `${__dirname}/../src/`;
const app = express();
const PORT = 1336;
process

function escapeString(str: String) {
    return str.replaceAll(/\\/g, '\\\\')
              .replaceAll(/"/g, '\\"')
              .replaceAll(/\n/g, '\\n')
              .replaceAll(/\t/g, '\\t');
}

function escapeStringPath(str: String) {
    return escapeString(str)
              .replaceAll(/\|/g, "")
              .replaceAll(/ /g, "");

}
// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// Basic route
app.post("/", (req: Request, res: Response) => {
  try {
    const regex = /<(.+?)'s Persona>([\s\S]*?)<\/\1's Persona>/g;

    if (process.env.debug == "1") {
        console.log(req.body)
    }
    let character = req.body.messages[0]?.content.match(regex)[0];
    character = escapeString(character.replaceAll("{user}", "{{user}}"))
    
    let name = req.body.messages[0]?.content.match(/<(.+?)'s Persona>/)[1];
    name = escapeStringPath(name);
    const probablyFirstMessage = escapeString(req.body.messages[2].content).replaceAll("{user}", "{{user}}")
    const outputFilePath = `cards/${name}-${uuidv4()}.json`;
    // TODO - Make the create_date accurate. Honestly the entire way this json file is written could be better, I just want to start downloading characters
    const outputString = `
    {
    "name": "${name}",
    "description": "${character}",
    "personality": "",
    "scenario": "",
    "first_mes": "${probablyFirstMessage}",
    "mes_example": "",
    "creatorcomment": "grabbed with dustpan",
    "avatar": "none",
    "talkativeness": "0.5",
    "fav": false,
    "tags": [],
    "spec": "chara_card_v3",
    "spec_version": "3.0",
    "data": {
        "name": "${name}",
        "description": "${character}",
        "personality": "",
        "scenario": "",
        "first_mes": "${probablyFirstMessage}",
        "mes_example": "",
        "creator_notes": "",
        "system_prompt": "",
        "post_history_instructions": "",
        "tags": [],
        "creator": "",
        "character_version": "",
        "alternate_greetings": [],
        "extensions": {
            "talkativeness": "0.5",
            "fav": false,
            "world": "",
            "depth_prompt": {
                "prompt": "",
                "depth": 4,
                "role": "system"
            }
        },
        "group_only_greetings": []
    },
    "create_date": "2025-12-12 @04h 20m 57s 437ms" 
    }`;
   
    fs.writeFile(outputFilePath, outputString, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file", err);
      } else {
        console.log(`Written to ${outputFilePath}.`);
      }
    });
    res
      .status(202)
      .send(
        `[${name}] has been downloaded. Make sure your persona is named "{user}"`
      );
  } catch (error) {
    res.status(500).send(`Failed to download, check console`);
    console.error(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}. Use this URL for tunneling.`);
});
