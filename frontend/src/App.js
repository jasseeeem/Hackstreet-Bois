import "./App.css";
// import HttpCall from "./components/HttpCall";
// import WebSocketCall from "./components/WebSocketCall";
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
    <div className="App">
      <h1>News Aggregator by Hackstreet Bois</h1>
      <>
        <input
          type="text"
          value={keywords}
          className="form-control"
          onChange={(e) => {
            setKeywords(e.target.value);
          }}
        />
        <button onClick={handleClick}>Submit</button>
        {showOutputBox && (
          <div className="output-box">
            {paras.length > 1 &&
              paras.map((para, i) => {
                if (i !== paras.length - 1) return <p>{para}</p>;
                return <></>;
              })}
            <p ref={textRef}></p>
          </div>
        )}
      </>
    </div>
  );
}

export default App;
