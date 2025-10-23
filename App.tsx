
import React, { useState, useCallback } from 'react';
import { generateVoice } from './services/geminiService';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    setDuration(0);

    try {
      const generatedUrl = await generateVoice(inputText);
      setAudioUrl(generatedUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const handleAudioMetadata = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setDuration(e.currentTarget.duration);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            Bangla AI Voice Generator
          </h1>
          <p className="mt-2 text-gray-400">
            Voice Model: <span className="font-semibold text-teal-400">Kore</span> (as a substitute for 'Enceladus')
          </p>
        </header>

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl shadow-teal-500/10 p-6 sm:p-8 backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col gap-6">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="এখানে আপনার বাংলা টেক্সট লিখুন..."
              className="w-full h-40 p-4 bg-gray-900/70 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 resize-none placeholder-gray-500"
              rows={5}
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-lg font-semibold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate Voice
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {audioUrl && (
            <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">Generated Audio</h3>
              <audio 
                controls 
                src={audioUrl} 
                className="w-full"
                onLoadedMetadata={handleAudioMetadata}
              >
                Your browser does not support the audio element.
              </audio>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>Duration: {duration > 0 ? `${duration.toFixed(2)}s` : '...'}</span>
                 <a
                    href={audioUrl}
                    download="bangla-ai-voice.wav"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300"
                  >
                    <DownloadIcon />
                    Download WAV
                  </a>
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
