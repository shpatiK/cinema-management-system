import React from 'react';
import { Link } from 'react-router-dom';

const ClickableTitle = () => {
  const words = [
    { text: "MOVIES", path: "/movies" },
    { text: "BOOK", path: "/booking" },
    { text: "EVENTS", path: "/events" },
    { text: "CINEMAS", path: "/cinema" },
    { text: "CLUB", path: "/club" },
    { text: "RENT A HALL", path: "/rent" }
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-1 md:gap-3 p-4 bg-blue-900">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {}
          {index > 0 && (
            <span className="text-white text-lg mx-1 md:mx-2">|</span>
          )}
          
          <Link
            to={word.path}
            className="text-white hover:text-yellow-300 text-lg md:text-xl font-bold 
                      transition-colors duration-300 hover:scale-105 transform"
          >
            {word.text}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ClickableTitle;