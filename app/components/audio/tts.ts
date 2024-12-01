//@ts-ignore
"use server";

const EDENAI_URL = process.env.EDENAI_URL;
const EDENAI_API_KEY = process.env.EDENAI_API_KEY
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
