"use client";
import Image from "next/image";
import { useState } from "react";
const photos = ["/leliane.jpg?v=20261008", "/media/leliane-02.jpg", "/media/leliane-03.jpg"];
export default function FounderPortrait() {
  const [index, setIndex] = useState(0);
  return <div className="founder-photo founder-gallery">
    <Image key={index} className="founder-portrait-image" src={photos[index]} alt={`Leliane Cerqueira Dantas, fundadora do Instituto Conectar — retrato ${index + 1}`} fill sizes="(max-width:760px) 90vw, 30vw" />
    <div className="portrait-controls" role="group" aria-label="Fotos de Leliane Cerqueira Dantas">{photos.map((photo, position)=><button key={photo} type="button" aria-label={`Ver foto ${position+1} de Leliane`} aria-pressed={index === position} onClick={()=>setIndex(position)}><span/></button>)}</div>
  </div>;
}
