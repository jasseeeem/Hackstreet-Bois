import "./App.css";
// import HttpCall from "./components/HttpCall";
import Navbar from "./components/Navbar";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Typed from "typed.js";
import { TagsInput } from "react-tag-input-component";

const socket = io("localhost:5001/", {
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000/",
  },
});

function App() {
  const [keywords, setKeywords] = useState([]);
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
    kw = keywords
    if (kw.length == 0)
      return;
    let keys = kw[0];
    for (let key = 1; key < kw.length; key++)
      keys += "," + kw[key];

    
    console.log(keys, "\n",keywords)
    socket.emit("paras", { data: keys });
    getSummary(keywords)
    return;
  };

  useEffect(() => {
    if (currentPara) {
      const typed = new Typed(textRef.current, {
        strings: [currentPara],
        typeSpeed: 25,
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
    <div className="static divide-y divide-y-white bg-darkblue h-screen m-0 p-0 text-white font-thin flex flex-col">
      <Navbar />
      <div className="w-4xl flex flex-col justify-center items-center flex-grow h-full">
        <hr class="h-0.5 opacity-50 bg-gray-200 border-0 dark:bg-gray-700" />
        <div
          className={`flex flex-row mb-40 w-1/2 h-16 items-center ${showOutputBox && "animate-goup"
            }`}
        >
          <div className="w-full text-black font-semibold h-full">
            <TagsInput
              value={keywords}
              onChange={setKeywords}
              name="keywords"
              placeHolder="Enter keywords and press enter"
              classNames={["p-3"]}
            />
          </div>
          <button
            className="bg-transparent transition hover:bg-blue-500 text-white font-semibold hover:text-white p-4 border border-blue-500 hover:border-transparent hover:cursor-pointer rounded-lg ml-5 mb-4"
            onClick={handleClick}
          >
            Submit
          </button>
        </div>
        {showOutputBox && (
          <div
            className={`absolute bg-normalblue transition ease-in-out w-1/2 h-3/5 mt-4 p-10 font-normal rounded-xl font-mono shadow-xl tracking-wide leading-6 ${showOutputBox && "animate-appear animate-godown"
              }`}
          >
            {paras.length > 1 &&
              paras.map((para, i) => {
                if (i !== paras.length - 1)
                  return <p className="mb-6">{para}</p>;
                return <></>;
              })}
            <p ref={textRef}></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
