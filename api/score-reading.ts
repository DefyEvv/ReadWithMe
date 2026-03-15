export const config = {
  runtime: 'edge',
};

type ScoreResponse = {
  transcript: string;
  expectedWords: string[];
  newMatchedCount: number;
  isComplete: boolean;
};

const json = (payload: Record<string, unknown>, status = 200): Response => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const normalizeSentence = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
};

const computeForwardMatchedCount = (
  expectedWords: string[],
  transcriptWords: string[],
  previousMatchedCount: number,
): number => {
  const safePrevious = Math.max(0, Math.min(previousMatchedCount, expectedWords.length));

  let detectedMatchedCount = safePrevious;
  for (let index = safePrevious; index < expectedWords.length; index += 1) {
    if (transcriptWords[index] !== expectedWords[index]) {
      break;
    }

    detectedMatchedCount = index + 1;
  }

  return Math.max(safePrevious, detectedMatchedCount);
};

const transcribeAudio = async (file: File): Promise<string> => {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const openaiFormData = new FormData();
  openaiFormData.append('file', file);
  openaiFormData.append('model', 'whisper-1');
  openaiFormData.append('language', 'en');

  const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: openaiFormData,
  });

  if (!openaiResponse.ok) {
    const text = await openaiResponse.text();
    throw new Error(`Transcription provider error: ${text}`);
  }

  const body = await openaiResponse.json();
  const transcript = typeof body?.text === 'string' ? body.text : '';

  return transcript;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('file');
    const expectedSentence = (formData.get('expectedSentence') ?? '').toString().trim();
    const previousMatchedCountRaw = (formData.get('previousMatchedCount') ?? '0').toString();
    const debugTranscript = (formData.get('debugTranscript') ?? '').toString().trim();

    if (!audioFile || !(audioFile instanceof File)) {
      return json({ error: 'Missing audio file' }, 400);
    }

    if (audioFile.size <= 0) {
      return json({ error: 'Audio file is empty' }, 400);
    }

    if (!expectedSentence) {
      return json({ error: 'Invalid expected sentence' }, 400);
    }

    const parsedPrevious = Number.parseInt(previousMatchedCountRaw, 10);
    const previousMatchedCount = Number.isFinite(parsedPrevious) ? parsedPrevious : 0;

    console.log('[score-reading] file size:', audioFile.size);
    console.log('[score-reading] mime type:', audioFile.type || 'unknown');

    const transcript = debugTranscript || await transcribeAudio(audioFile);

    const expectedWords = normalizeSentence(expectedSentence);
    const transcriptWords = normalizeSentence(transcript);
    const newMatchedCount = computeForwardMatchedCount(expectedWords, transcriptWords, previousMatchedCount);

    const response: ScoreResponse = {
      transcript,
      expectedWords,
      newMatchedCount,
      isComplete: expectedWords.length > 0 && newMatchedCount === expectedWords.length,
    };

    return json(response, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected scoring error';
    console.error('[score-reading] backend error text:', message);
    return json({ error: message }, 500);
  }
}
