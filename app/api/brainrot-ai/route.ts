import { NextRequest } from "next/server";
import { generate_prompt } from "./prompt-generator";
import OpenAI from "openai";
const openai = new OpenAI();



export async function POST(request: NextRequest) {
  const { sentence } = await request.json();
  console.log("sentence: ", sentence);
  const prompt = generate_prompt(sentence);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt[0] },
      { role: "user", content: prompt[1] }
    ]
  });

  console.log(completion.choices[0].message);


  return new Response(JSON.stringify({ response: completion.choices[0].message.content }));
}