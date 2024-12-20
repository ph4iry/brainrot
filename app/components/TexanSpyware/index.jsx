"use client";
import React, { useState, useEffect, useRef } from "react";

import "./styles.css";

export default function TexanSpyware() {
  const [typedText, setTypedText] = useState("");
  const [containsTexas, setContainsTexas] = useState(false);
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  const [images, setImages] = useState([
    { id: 1, type: "bucee" },
    { id: 2, type: "heb" },
  ]);
  

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newTypedText = typedText + event.key;
      setTypedText(newTypedText);
      if (
        newTypedText.toLowerCase().includes("texas") ||
        newTypedText.toLowerCase().includes("texan")
      ) {
        const songRef = (new Audio("/texas-anthem.mp3"));
        songRef.current.currentTime = 7;
        songRef.current.play();
        setContainsTexas(true);

        console.log(`
        ____
             !
       !     !
       !      \`-  _ _    _ 
       |              \`\`\`  !
  _____!                   !
  \\,                        \\
    l    _                  ;
     \\ _/  \\.              /
             \\           .’ 
              .       ./
               \`.    ,
                 \\   ;
                   \`\`\’`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [typedText]);

  useEffect(() => {
    if (containsTexas) {
      images.forEach((img) => {
        const imgElement = document.getElementById(`img-${img.id}`);
        let starting_coords = {
          x: window.innerWidth * 0.75 * Math.random() + window.innerWidth * 0.1,
          y:
            window.innerHeight * 0.75 * Math.random() +
            window.innerHeight * 0.1,
        };
        imgElement.style.left = starting_coords.x + "px";
        imgElement.style.top = starting_coords.y + "px";
        let xDirection = Math.random() < 0.5 ? 1 : -1;
        let yDirection = Math.random() < 0.5 ? 1 : -1;
        const position = {
          x: 0,
          y: 0,
        };
        const moveImage = () => {
          const rect = imgElement.getBoundingClientRect();
          if (
            starting_coords.y + position.y <= 0 ||
            starting_coords.y + position.y + rect.height >= window.innerHeight
          ) {
            yDirection *= -1;
          }
          if (
            starting_coords.x + position.x <= 0 ||
            starting_coords.x + position.x + rect.width >=
              window.innerWidth - 50
          ) {
            xDirection *= -1;
          }
          position.x += 5 * xDirection;
          position.y += 5 * yDirection;
          imgElement.style.transform = `translate(${position.x + "px"}, ${
            position.y + "px"
          })`;
          //imgElement.style.top = rect.top + yDirection * 5 + "px";
        };

        const interval = setInterval(moveImage, 20);
        imgElement.setAttribute("data-interval", interval);
      });

      return () => {
        images.forEach((img) => {
          try {
          const imgElement = document.getElementById(`img-${img.id}`);
          clearInterval(imgElement.getAttribute("data-interval"));
          } catch (error) {
            
          }
        });
      };
    }
  }, [containsTexas, images]);

  if (!containsTexas) return null;
  return (
    <div id="texas-container">
      <button
      className="bg-white p-3"
        onClick={(e) => {
          setNumberOfClicks(numberOfClicks + 1);
          if (numberOfClicks > 3) {
            setContainsTexas(false);
            setTypedText("");
            songRef.current.pause();
            songRef.current.currentTime = 7;
            setNumberOfClicks(0);
          } else {
            setImages((prevImages) => [
              ...prevImages,
              ...prevImages.map((img) => ({
                id: prevImages.length + img.id,
                type: img.type,
              })),
            ]);
            const x = Math.floor(
              window.innerHeight * 0.75 * Math.random() +
                window.innerHeight * 0.1
            );
            const y = Math.floor(
              window.innerHeight * 0.75 * Math.random() +
                window.innerHeight * 0.1
            );
            e.currentTarget.style.left = x + "px";
            e.currentTarget.style.top = y + "px";
          }
        }}
        id="close-texas"
      >
        Close
      </button>
      <img src={'/texasflag.jpg'} alt="TexasFlag from texan spyware" id="texas-flag" />
      {images.map((img) => (
        <img
          key={img.id}
          id={`img-${img.id}`}
          src={img.type === "bucee" ? '/bucee.jpg' : '/HEB.svg'}
          alt={img.type}
          className="moving"
        />
      ))}
    </div>
  );
}
