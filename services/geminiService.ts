
import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, pcmToWav } from '../utils/audioUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateVoice = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak in a clear, standard Bengali accent: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              // User requested "Enceladus", but it is not available.
              // 'Kore' is used as a substitute.
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the API.");
    }
    
    const audioBytes = decodeBase64(base64Audio);
    
    // API returns raw PCM data at a sample rate of 24000
    const wavBlob = pcmToWav(audioBytes, {
        sampleRate: 24000,
        numChannels: 1,
        bitsPerSample: 16
    });
    
    const audioUrl = URL.createObjectURL(wavBlob);
    return audioUrl;

  } catch (error) {
    console.error("Error generating voice:", error);
    throw new Error("Failed to generate voice. Please check your input and API key.");
  }
};
