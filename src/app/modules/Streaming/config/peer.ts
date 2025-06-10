import Peer from 'peerjs';

let peerInstance: Peer | null = null;

export function createPeer(id: string): Peer {
  if (peerInstance && peerInstance?.open) {
    return peerInstance; // ✅ đã sẵn sàng rồi, không tạo lại
  }

  if (peerInstance) {
    peerInstance.destroy(); // cleanup peer cũ nếu chưa open
  }

  peerInstance = new Peer(id,

    {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
           {
        urls: 'turn:103.169.35.220:3478',
        username: 'ngaymaivanden',
        credential: '304'
      }
        ]
      }
    }
  ); // 👈 custom ID
  return peerInstance;
}

export function getPeer(): Peer | null {
  return peerInstance;
}
