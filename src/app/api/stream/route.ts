import WebSocket from 'ws';

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const ws = new WebSocket('ws://ml-project.ddns.net:8080/'); // Connect to the WebSocket stream

      ws.on('message', (message) => {
        // Convert WebSocket message (Buffer) to base64
        const base64Image = message.toString('base64');
        const data = `data: ${base64Image}\n\n`; // SSE format

        // Convert data to Uint8Array and enqueue it in the stream
        controller.enqueue(new TextEncoder().encode(data));
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        controller.close(); // Close the stream when WebSocket is closed
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        controller.error(err); // Terminate the stream on error
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
