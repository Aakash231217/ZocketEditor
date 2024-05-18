import React, { useRef, useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import CanvasClass from './CanvasClass';


const getContrastingColor = (hex) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};


const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [caption, setCaption] = useState({
    text: "",
    placeholder:"Enter your description here",
    position: { x: 50, y: 50 },
    fontSize: 44,
    alignment: 'left',
    textColor: '#FFFFFF',
    maxCharactersPerLine: 31
  });
  const [cta, setCta] = useState({
    text: "Shop Now",
    position: { x: 240, y: 320 },
    fontSize: 44,
    textColor: '#B22222', // reddish-gray color
    backgroundColor: '#FFFFFF' // white color

  });
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [imageUrl, setImageUrl] = useState('https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png');
  const [designPatternUrl] = useState('https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png');
  const [maskStrokeUrl] = useState('https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png');
  const [lastColors, setLastColors] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasClass = new CanvasClass(ctx);
    canvasClass.drawTemplate(caption, cta, backgroundColor, imageUrl, designPatternUrl,maskStrokeUrl);
  }, [caption, cta, backgroundColor, imageUrl, designPatternUrl, maskStrokeUrl]);

  const handleColorChange = (color) => {
    const newBackgroundColor = color.hex;
    setBackgroundColor(newBackgroundColor);
    setCta(prevCta => ({
      ...prevCta,
      textColor: getContrastingColor(newBackgroundColor)
    }));
    setLastColors((prev) => [...new Set([newBackgroundColor, ...prev].slice(0, 5))]);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  const handleEyeDropper = async () => {
    if (window.EyeDropper) {
      const eyeDropper = new window.EyeDropper();
      try {
        const result = await eyeDropper.open();
        handleColorChange({ hex: result.sRGBHex });
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("EyeDropper API is not available in your browser.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center p-4 space-y-4 md:space-y-0 md:space-x-4 bg-gray-100 min-h-screen">
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={1080} height={1080} className="border rounded-lg shadow-lg" style={{ height: 400, width: 400 }} />
      </div>
      <div className="w-full max-w-md space-y-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col space-y-2">
          <h1 className='text-lg font-semibold mx-24'>Ad Customization</h1>
          <p className="text-sm text-gray-500 mx-8">Customize your ad and get the templates accordingly</p>
          <br/>
          <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">Change the ad creative image:</label>
          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              className="text-blue-600 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        </div>
        </div>
        <p className='text-sm text-gray-500 divide-x-[3px]'>────────────────Edit Content────────────────</p>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ad Content:</label>
          <input 
            type="text" 
            value={caption.text} 
            onChange={(e) => setCaption({ ...caption, text: e.target.value })} 
            className="p-2 border rounded-md w-full relative z-10"
            placeholder={caption.placeholder} 
            style={{ background: 'transparent' }}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">CTA</label>
          <input 
            type="text" 
            value={cta.text} 
            onChange={(e) => setCta({ ...cta, text: e.target.value })} 
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">Choose your Color:</label>
          <div className="flex items-center space-x-2">
            {lastColors.map(color => (
              <button 
                key={color} 
                onClick={() => setBackgroundColor(color)} 
                style={{ backgroundColor: color }} 
                className="w-8 h-8 rounded-full border"
              ></button>
            ))}
            <button 
              onClick={() => setPickerVisible(!pickerVisible)} 
              className="w-8 h-8 border rounded-full bg-gray-200 flex items-center justify-center"
            >
              +
            </button>
          </div>
          {pickerVisible && (
            <div className="relative z-10 mt-2">
              <SketchPicker color={backgroundColor} onChangeComplete={handleColorChange} />
            </div>
          )}
        </div>
        <button 
          onClick={handleEyeDropper} 
          className="mt-2 p-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          Pick Color from Page
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;

