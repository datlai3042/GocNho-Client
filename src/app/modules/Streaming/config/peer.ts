import Peer from 'peerjs';

let peerInstance: Peer | null = null;

export function createPeer(id: string): Peer {
  if (peerInstance && peerInstance?.open) {
    return peerInstance; // ✅ đã sẵn sàng rồi, không tạo lại
  }

  if (peerInstance) {
    peerInstance.destroy(); // cleanup peer cũ nếu chưa open
  }

  peerInstance = new Peer(id); // 👈 custom ID
  return peerInstance;
}

export function getPeer(): Peer | null {
  return peerInstance;
}
