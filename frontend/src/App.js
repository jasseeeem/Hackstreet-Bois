import "./App.css";
// import HttpCall from "./components/HttpCall";
import Navbar from "./components/Navbar";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Typed from "typed.js";
import { TagsInput } from "react-tag-input-component";

const socket = io("http://localhost:5001/", {
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000/",
  },
});

function App() {
  const [keywords, setKeywords] = useState([]);
  const [summary, setSummary] = useState("");
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [redditLinks, setRedditLinks] = useState([]);
  const [showLinks, setShowLinks] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showOutputBox, setShowOutputBox] = useState(false);
  const textRef = useRef();
  const [articleLinks,setArticleLinks] = useState([]);
  const loadingTextRef = useRef();

//loading, remove and add 
  const handleClick = (e) => {
    e.preventDefault();
    if(loading || keywords.length === 0) return;
    if(textRef && textRef.current) textRef.current.innerHTML = '';
    setSummary("")
    setYoutubeLinks([])
    setArticleLinks([])
    setRedditLinks([])
    setShowLinks(false);
    setLoading(true);
    setShowOutputBox(true);
    // let kw = keywords
    let keys = keywords[0];
    for (let key = 1; key < keywords.length; key++)
      keys += "," + keywords[key];
    console.log(keys, "\n",keywords)
    socket.emit("paras", { keys });
    return;
  };

  useEffect(() => {
    return;
    if (loading) {
      const typed = new Typed(loadingTextRef.current, {
        strings: ['Fetching news articles and posts...','Combining the results...','Summarising the results...'],
        typeSpeed: 60,
        backSpeed:30, 
        backDelay: 2000, 
        showCursor: false,
        loop: false
    });
    }
  }, [loading]);

  useEffect(() => {
    if (summary) {
      setLoading(true)
      const typed = new Typed(textRef.current, {
        strings: [summary],
        typeSpeed: 15,
        showCursor: false,
        loop: false,
        onComplete: () => {
          setShowLinks(true);
        },
        // onStringTyped: () => {
        //   const element = textRef.current.parentNode;
        //   element.scrollTop = element.scrollHeight;
        // }
      });
    }
  }, [summary]);

  useEffect(() => {
    socket.on("connect", (data) => {
      console.log("Connected");
    });

    socket.on("disconnect", (data) => {
      console.log("Disconnected: ", data);
    });

    socket.on("paras", (data) => {
      loadingTextRef.current.innerHTML = '';
      setSummary(data.para);
      setYoutubeLinks(data.youtubelinks);
      setRedditLinks(data.redditlinks);
      setArticleLinks(data.articlelinks);
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="static divide-y divide-y-white bg-darkblue h-screen m-0 p-0 text-white font-thin flex flex-col">
      <Navbar />
      <div className="w-4xl flex flex-col justify-center items-center flex-grow h-full">
        <hr className="h-0.5 opacity-50 bg-gray-200 border-0 dark:bg-gray-700" ></hr>
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
            className={`bg-transparent transition text-white font-semibold ${loading ? "opacity-50" : "hover:bg-blue-500 hover:text-white hover:cursor-pointer hover:border-transparent"} p-4 border border-blue-500 rounded-lg ml-5 mb-4`}
            onClick={handleClick}
          >
            Submit
          </button>
        </div>
        {showOutputBox && (
          <div
            className={`absolute bg-normalblue overflow-auto scrollbar-none transition ease-in-out w-1/2 h-3/5 mt-4 p-10 font-normal rounded-xl font-mono shadow-xl tracking-wide leading-6 ${showOutputBox && "animate-appear animate-godown"
              }`}
          >
            <p ref={loadingTextRef} className="whitespace-pre-wrap"></p>
            <p ref={textRef} className="whitespace-pre-wrap"></p>
            {showLinks && <div className="animate-appear">
            <div className="flex flex-col">
              
              {articleLinks.length >0 && articleLinks.map((element) => {
                return <a href={element[1]} key={element[1]}>{element[0]}</a>
              })}
              </div>
              <div className="flex flex-col">
              
            {youtubeLinks.length >0 && youtubeLinks.map((element) => {
              return <a href={element[1]} key={element[1]}>{element[0]}</a>
            })}
            </div>
            <div className="flex flex-col">
            {redditLinks.length > 0 && redditLinks.map((element) => {
              return <a href={element[1]} key={element[1]}>{element[0]}</a>
            })
            }
            </div></div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
