'use client';

import { useEffect, useState } from 'react';

export default function Stream() {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('/api/stream');  // Connect to the SSE API route

    eventSource.onmessage = (event) => {
      // Convert the base64 string back to a usable image
      const base64Image = `data:image/jpeg;base64,${event.data}`;
      setImageSrc(base64Image);  // Update the image source
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    return () => {
      eventSource.close();  // Clean up on component unmount
    };
  }, []);

  return (
    <div>
      <h1>Unity Camera Stream</h1>
      <img src={imageSrc} alt="Camera Stream" />
    </div>
  );
}
