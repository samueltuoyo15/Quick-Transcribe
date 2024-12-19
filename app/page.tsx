"use client";
import { useState, useEffect } from 'react';
import { FaRecycle, FaExchangeAlt, FaMicrophone, FaVolumeUp, FaCopy} from 'react-icons/fa';

const App = () => {
  const [buttonValue, setButtonValue] = useState<string>('English');
  const [buttonValue2, setButtonValue2] = useState<string>('French');
  const [input, setInput] = useState<string>('');
  const [translateButtonValue, setTranslateButtonValue] = useState<string>('Translate');
  const [fetchedLanguages, setFetchedLanguages] = useState<null | any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [currentButton, setCurrentButton] = useState<null>(null);
  const [translateFromCode, setTranslateFromCode] = useState<string>('en');
  const [translateToCode, setTranslateToCode] = useState<string>('fr');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLanguages = (fetchedLanguages || []).filter((lang) =>
  lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(input !== '') {
    setTranslateButtonValue('Translating........');
    const apiUrl = `https://api.mymemory.translated.net/get?q=${input}&langpair=${translateFromCode}|${translateToCode}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
    }
    finally{
      setTranslateButtonValue('Translate');
    }
    }
  };

  useEffect(() => {
    const fetchAllLanguages = async () => {
      try {
        const res = await fetch('/languages.json');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFetchedLanguages(data);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchAllLanguages();
  }, []);

  const toggleDialog = (button: any) => {
    setIsDialogOpen(!isDialogOpen);
    setCurrentButton(button);
  };

  const handleLanguageSelect = (lang: any) => {
    if (currentButton === 'source') {
      setButtonValue(lang.name);
      setTranslateFromCode(lang.code); 
    } else if (currentButton === 'target') {
      setButtonValue2(lang.name);
      setTranslateToCode(lang.code); 
    }
    setIsDialogOpen(false);
  };
  
  const switchCurLang = () => {
    setButtonValue2(buttonValue)
    setButtonValue(buttonValue2)
    
    setTranslateFromCode(translateToCode)
    setTranslateToCode(translateFromCode)
  }
  
   const generateAudio = () => {
    const text = translatedText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 1; 
    speech.rate = 1;
    speechSynthesis.speak(speech);
}

  const copyText = () => {
    navigator.clipboard.writeText(translatedText)
  }
  
  const speechRecog = () => {
    const speech = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    speech.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    speech.start();
  };


  return (
    <>
      <header className="bg-zinc-800 py-6 text-center text-white">
        <h1 className="font-semibold text-3xl">Quick Transcribe</h1>
      </header>

      <section className="p-4 max-w-2xl mx-auto mt-3">
        <h2 className="mb-1 text-2xl font-semibold">Enter Text:</h2>
        <form onSubmit={submitForm}>
          <input
            type="text"
            className="shadow border-2 block rounded w-full p-3"
            placeholder="type in your text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="shadow mt-4 bg-zinc-800 rounded text-white py-4 w-full text-center block text-2xl"
            type="submit"
          >
            {translateButtonValue} <FaRecycle className={`ml-2 inline ${translateButtonValue === 'Translating........' ? 'rotating' : ''}`} />
 
          </button>
        </form>
        
        <article className="shadow border-2 h-56 text-xl p-6 mt-4">
     {translatedText && (
          <div>
            {translatedText}
                  </div>
        )}
         <FaVolumeUp className={`${translatedText === '' ? 'hidden' : 'inline'} mt-5 text-2xl mr-3`} onClick={() => generateAudio()}/>
          <FaCopy className={`${translatedText === '' ? 'hidden' : 'inline'} mt-5 text-2xl`} onClick={() => copyText()} />
        </article>
      </section>

      <footer className="select-none fixed bottom-0 py-4 mx-auto mt-1 text-center px-3 w-full bg-gray-100 flex justify-center flex-col">
        <div className="flex justify-between items-center block mb-4">
          <button
            onClick={() => toggleDialog('source')}
            className="shadow-2xl bg-zinc-800 text-2xl rounded text-white p-3 text-center"
          >
            {buttonValue}
          </button>
          
          <FaExchangeAlt className="text-2xl" onClick={() => switchCurLang()} />
          
          <button
            onClick={() => toggleDialog('target')}
            className="shadow-2xl bg-zinc-800 text-2xl rounded text-white text-center p-3"
          >
            {buttonValue2}
          </button>
        </div>
        {isDialogOpen && (
  <div
    className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
    onClick={(e) => {
      if (e.target === e.currentTarget) setIsDialogOpen(false);
    }}
  >
    
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Select Language</h3>
      
      <input
        type="text"
        placeholder="Search language..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul className="divide-y divide-gray-300">
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((lang, index) => (
            <li
              key={index}
              onClick={() => handleLanguageSelect(lang)}
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
            >
              {lang.name}
            </li>
          ))
        ) : (
          <li className="py-2 px-4 text-gray-500">No language found</li>
        )}
      </ul>

      
      <button
        onClick={() => setIsDialogOpen(false)}
        className="mt-4 w-full bg-zinc-800 text-white py-2 rounded hover:bg-zinc-700"
      >
        Close
      </button>
    </div>
   </div>
 )}
        <FaMicrophone
          onClick={speechRecog}
          className="speech-record-button shadow-2xl text-7xl text-center mx-auto bg-zinc-800 text-white p-3 rounded-full"
        />
      </footer>
    </>
  );
};

export default App;
