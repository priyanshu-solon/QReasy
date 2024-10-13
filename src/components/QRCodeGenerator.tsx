import React, { useState, ChangeEvent, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import { BackgroundLines } from "../components/ui/BackgroundLines";

// Predefined list of colors
const fgColors = ['Black', 'Red', 'Blue', 'Green',]; // Foreground colors

const bgColors = ['White', 'Pink', 'Yellow','Lavender','Honeydew']; // Background colors

const QRCodeGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [fgColor, setFgColor] = useState<string>('black'); // Foreground color default
  const [bgColor, setBgColor] = useState<string>('white'); // Background color default
  const qrRef = useRef<HTMLDivElement>(null);

  // Handle input text change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  // Handle foreground color change
  const handleFgColorChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFgColor(e.target.value);
  };

  // Handle background color change
  const handleBgColorChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setBgColor(e.target.value);
  };

  // Random color generator
  const getRandomColor = (colorArray: string[]): string => {
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex];
  };

  // Handle random color selection for both fg and bg
  const handleRandomColors = () => {
    const randomFgColor = getRandomColor(fgColors);
    const randomBgColor = getRandomColor(bgColors);

    setFgColor(randomFgColor);
    setBgColor(randomBgColor);
  };

  const notify = () => {
    toast("QR Downloaded!");
  };

  const handleDownloadClick = () => {
    if (!qrRef.current) {
      console.error("QR code reference is null.");
      return;
    }

    toPng(qrRef.current)
      .then((dataUrl) => {
        saveAs(dataUrl, 'qr-code.png');
        notify();
      })
      .catch((err) => {
        console.error('Error generating image', err);
      });
  };

  return (
    <BackgroundLines>
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>

        <input
          type="text"
          placeholder="Enter text or URL"
          value={inputText}
          onChange={handleInputChange}
          className="p-2 mb-4 border border-gray-400 rounded-md w-full sm:max-w-xs"
        />

        {/* Dropdowns for Foreground and Background Colors */}
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="fgColor">Foreground Color:</label>
            <select id="fgColor" value={fgColor} onChange={handleFgColorChange} className="ml-2">
              {fgColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bgColor">Background Color:</label>
            <select id="bgColor" value={bgColor} onChange={handleBgColorChange} className="ml-2">
              {bgColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>

        {inputText && (
          <div className="bg-white p-4 rounded-md shadow-md" ref={qrRef}>
            {/* Apply fgColor and bgColor */}
            <QRCode value={inputText} fgColor={fgColor} bgColor={bgColor} />
          </div>
        )}

        <div className="flex justify-center items-center mt-4">
          <button
            onClick={handleRandomColors}
            className="p-2 bg-blue-500 text-white rounded-md ml-2"
          >
            Random Colors
          </button>
          <button
            onClick={handleDownloadClick}
            className="p-2 bg-blue-500 text-white rounded-md ml-2"
          >
            Download QR
          </button>
        </div>
      </div>

      <ToastContainer />
    </BackgroundLines>
  );
};

export default QRCodeGenerator;
