
import fetch from "node-fetch"; // Only needed for Node.js, not needed in the browser

const url = "https://api.edenai.run/v2/workflow/61cb48f5-3ae4-4f53-8a1f-5a3e6b6abf85/execution/"
const payload = {"text":"Bro, what you doin’? You mean this rizz?","input_language":"en"}

const launchExecution = async () => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTFmNTE3NzEtYjdjNi00ODQ0LWFmMzQtYzA2MzA5NTFhOGEwIiwidHlwZSI6ImFwaV90b2tlbiJ9.-6xHPx0cGn4CtB9f-UWQBaoWfjvCVQk2gWzu_kKpQkg"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json()
  return result;
}
const data = await launchExecution();