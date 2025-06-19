import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { get_client_env } from "@/lib/env";

interface SocketContextProps {
  socket: WebSocket | null;
  getSocket: (serverId: string) => WebSocket;
  isConnected: boolean;
  sendMessage: (message: string) => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentRunID, setCurrentRunID] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const getSocket = useCallback(
    (run_id: string) => {
      if (socket && run_id === currentRunID) {
        // If socket exists and serverId is the same, return the existing socket
        return socket;
      } else {
        // If socket exists but serverId is different, close the current socket
        if (socket) {
          socket.close();
        }

        const token = localStorage.getItem("access_token");

        const { websocket_url } = get_client_env();

        const query = new URLSearchParams({ token });
        const wsUrl = `${websocket_url}/websocket/ws/run/${run_id}/?${query.toString()}`;
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
          console.log(`Connected to WebSocket for serverId: ${run_id}`);
          setSocket(newSocket);
          setCurrentRunID(run_id);
          setIsConnected(true);
        };

        newSocket.onclose = () => {
          console.log(`Disconnected from WebSocket for serverId: ${run_id}`);
          setSocket(null);
          setCurrentRunID(null);
          setIsConnected(false);
        };

        newSocket.onerror = (error) => {
          console.error(`WebSocket Error for serverId ${run_id}:`, error);
          setIsConnected(false);
        };

        return newSocket;
      }
    },
    [socket, currentRunID]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.error("Socket not connected");
      }
    },
    [socket]
  );

  useEffect(() => {
    // Cleanup function to close the socket when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, getSocket, isConnected, sendMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
