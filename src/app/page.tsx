'use client';

import { useEffect, useState } from 'react';

export default function Stream() {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://ml-project.ddns.net:8080/');

    socket.onmessage = (event) => {
      const imageBlob = new Blob([event.data], { type: 'image/jpeg' });
      const imageURL = URL.createObjectURL(imageBlob);
      setImageSrc(imageURL);
    };

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <img src={imageSrc} alt="Camera Stream" />
    </div>
  );
}