import { useState } from "react"
import { TailwindColors } from "./lib/tailwind-colors"
import { useEffect } from "react";

function App() {

  const [inputValue, setInputValue] = useState('');
  const [matchingColor, setMatchingColor] = useState('');
  const [copySuccess, setCopySuccess] = useState()

  const findMatchingColor = (inputColor) => {
    let closestColor = null;
    let minDifference = Number.MAX_SAFE_INTEGER;
    let colorCode = null

    for (const groupName in TailwindColors) {
      for (const shade in TailwindColors[groupName]) {
        const colorDiff = calculateColorDifference(inputColor, TailwindColors[groupName][shade]);
        if (colorDiff < minDifference) {
          minDifference = colorDiff;
          closestColor = `bg-${groupName}-${shade}`;
          colorCode = TailwindColors[groupName][shade]
        }
      }
    }

    return {
      code: closestColor,
      color: colorCode
    };
  };

  const calculateColorDifference = (color1, color2) => {
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const diff = Math.sqrt(
      (rgb1[0] - rgb2[0]) ** 2 +
      (rgb1[1] - rgb2[1]) ** 2 +
      (rgb1[2] - rgb2[2]) ** 2
    );

    return diff;
  };

  const handleInputChange = (event) => {
    const inputColor = event.target.value;

    if (inputColor.startsWith('#') && inputColor.length === 7) {
      const closestColor = findMatchingColor(inputColor);
      setMatchingColor(closestColor);
    } else {
      setMatchingColor('');
    }

    setInputValue(inputColor);
  };

  const handleCopy = async color => {
    try{
      await navigator.clipboard.writeText(color)
      setCopySuccess('Copied!')
    }catch(err){
      setCopySuccess('Failed to copy!')
    }
  }

  useEffect(() => {
    handleInputChange({target: {value: '#f6f6f6'}})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopySuccess(false)
    }, 1500);
    return () => clearTimeout(timer);
  }, [copySuccess])

  return (
    <div className="flex flex-col gap-y-5 items-center justify-center w-1/2 p-10 rounded-lg border border-gray-200 bg-gray-100">

        {copySuccess && (
          <div className="fixed top-5 right-5 p-5 rounded-lg bg-green-500 text-white font-semibold text-xs">
            Successfully Copied
          </div>
        )}

        <div className="font-bold text-4xl mb-10">HEX to Tailwind</div>

        <input 
          className="w-96 h-10 border-2 border-gray-200 rounded-lg !ring-0 !outline-none px-2" 
          type="text" 
          placeholder="HEX Code"
          value={inputValue} onChange={handleInputChange}
          />       

          {matchingColor && (
            <div className="space-y-5 w-full bg-white p-5 rounded-lg border border-gray-200">
              <div className="font-bold text-lg">Preview:</div>
              <div onClick={() => handleCopy(matchingColor.code)}>
                <div className="w-full h-20 text-xs text-gray-500 flex items-center justify-center rounded relative cursor-pointer" style={{backgroundColor: matchingColor.color}}></div>
                <div className="text-xs text-gray-500 mt-2 text-center">{matchingColor.code}</div>
              </div>
              <div>
                <div className="w-full h-20 text-xs text-gray-500 flex items-center justify-center rounded" style={{backgroundColor: inputValue}}></div>
                <div className="text-xs text-gray-500 mt-2 text-center">Your Color</div>
              </div>
            </div>
          )}
    </div>
  )
}

export default App
