import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const normalizeSentence = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);
};

const compareForward = (
  expectedWords: string[],
  transcriptWords: string[],
  previousMatchedCount: number,
): number => {
  let detectedMatchedCount = Math.max(0, previousMatchedCount);

  for (let index = previousMatchedCount; index < expectedWords.length; index += 1) {
    if (transcriptWords[index] === expectedWords[index]) {
      detectedMatchedCount = index + 1;
      continue;
    }

    break;
  }

  return Math.max(previousMatchedCount, detectedMatchedCount);
};

const jsonResponse = (status: number, payload: Record<string, unknown>): Response => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("file");
    const expectedSentence = (formData.get("expectedSentence") ?? "").toString().trim();
    const previousMatchedCountRaw = (formData.get("previousMatchedCount") ?? "0").toString();
    const debugTranscript = (formData.get("debugTranscript") ?? "").toString().trim();

    if (!audioFile || !(audioFile instanceof File)) {
      return jsonResponse(400, { error: "Missing audio file" });
    }

    if (!expectedSentence) {
      return jsonResponse(400, { error: "Invalid expected sentence" });
    }

    const parsedPrevious = Number.parseInt(previousMatchedCountRaw, 10);
    const previousMatchedCount = Number.isFinite(parsedPrevious) && parsedPrevious > 0 ? parsedPrevious : 0;

    let transcript = debugTranscript;

    if (!transcript) {
      const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openaiApiKey) {
        return jsonResponse(500, { error: "Transcription failed" });
      }

      const openaiFormData = new FormData();
      openaiFormData.append("file", audioFile);
      openaiFormData.append("model", "whisper-1");
      openaiFormData.append("language", "en");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: openaiFormData,
      });

      if (!response.ok) {
        console.error("OpenAI transcription error:", await response.text());
        return jsonResponse(500, { error: "Transcription failed" });
      }

      const result = await response.json();
      transcript = (result.text ?? "").toString();
    }

    const normalizedTranscriptWords = normalizeSentence(transcript);
    const expectedWords = normalizeSentence(expectedSentence);

    const boundedPreviousMatchedCount = Math.min(previousMatchedCount, expectedWords.length);
    const newMatchedCount = compareForward(expectedWords, normalizedTranscriptWords, boundedPreviousMatchedCount);

    return jsonResponse(200, {
      transcript,
      normalizedTranscriptWords,
      expectedWords,
      previousMatchedCount: boundedPreviousMatchedCount,
      newMatchedCount,
      isComplete: newMatchedCount === expectedWords.length && expectedWords.length > 0,
    });
  } catch (error) {
    console.error("score-reading error:", error);
    return jsonResponse(500, { error: "Transcription failed" });
  }
});
