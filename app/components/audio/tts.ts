//@ts-ignore
"use server";

const EDENAI_URL =
  "https://api.edenai.run/v2/workflow/61cb48f5-3ae4-4f53-8a1f-5a3e6b6abf85/execution/";
const EDENAI_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTFmNTE3NzEtYjdjNi00ODQ0LWFmMzQtYzA2MzA5NTFhOGEwIiwidHlwZSI6ImFwaV90b2tlbiJ9.-6xHPx0cGn4CtB9f-UWQBaoWfjvCVQk2gWzu_kKpQkg";

export default async function TTS(sentence: string) {
  
  const payload = { text: sentence, input_language: "en" };
  const launch_execution = await fetch(EDENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EDENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const launch_result = await launch_execution.json();
  
  let response = await fetch(EDENAI_URL + launch_result.id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EDENAI_API_KEY}`,
    },
  });
  let result = await response.json();
  console.log(result)
  while (result.content.status === 'running') {
    await setTimeout(() => {}, 1000)
    response = await fetch(EDENAI_URL + launch_result.id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EDENAI_API_KEY}`,
      },
    });
    result = await response.json();
    console.log(result)
  }
  return result.content.results.audio__text_to_speech.results[0].audio_resource_url;
}
