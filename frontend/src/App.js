import "./App.css";
// import HttpCall from "./components/HttpCall";
import Navbar from "./components/Navbar";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Typed from "typed.js";

const socket = io("localhost:5001/", {
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000/",
  },
});

function App() {
  const [keywords, setKeywords] = useState("");
  const [paras, setParas] = useState("");
  const [currentPara, setCurrentPara] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutputBox, setShowOutputBox] = useState(false);
  const textRef = useRef();

  const handleClick = (e) => {
    e.preventDefault();
    setParas([]);
    setLoading(true);
    setShowOutputBox(true);
    socket.emit("paras", { keywords: keywords });
    return;
  };

  useEffect(() => {
    if (currentPara) {
      const typed = new Typed(textRef.current, {
        strings: [currentPara],
        typeSpeed: 50,
        showCursor: false,
      });
      return () => {
        typed.destroy();
      };
    }
  }, [paras]);

  useEffect(() => {
    socket.on("connect", (data) => {
      console.log("Connected");
    });

    socket.on("disconnect", (data) => {
      console.log("Disconnected: ", data);
    });

    socket.on("paras", (data) => {
      console.log(data);
      setParas((prevParas) => {
        return [...prevParas, data.para];
      });
      setCurrentPara(data.para);
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-darkblue h-screen m-0 p-0 text-white font-thin">
      <Navbar />
      <div className="w-4xl flex justify-center align-center">
        <div className="flex flex-row align-center">
          <input className="bg-gray-50 border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
            type="text"
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
          />
          <button class="bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full ml-5 h-10"
            Button
            onClick={handleClick}>Submit
          </button>
        </div>
        {
          showOutputBox && (
            <div className="output-box">
              {paras.length > 1 &&
                paras.map((para, i) => {
                  if (i !== paras.length - 1) return <p>{para}</p>;
                  return <></>;
                })}
              <p ref={textRef}></p>
            </div>
          )
        }
      </div >
    </div >
  );
}

export default App;
