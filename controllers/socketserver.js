import readline from "readline";
import { Server } from "socket.io";

export const setupSocketServer = (httpServer) => {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const io = new Server(httpServer);

    let clientsConnected = [];

    let games_happening = 1;

    let waiting_player = null;


    const mns = io.of("/gameBot");

    // setup Socket.IO server
    mns.on("connection", (socket) => {

      console.log(`New client connected: ${socket.id}`);
      clientsConnected.push(socket.id);

      if (waiting_player === null) {
        waiting_player = socket;
        socket.emit("waiting");

      } else {

        const room = `games-${games_happening}`;

        games_happening = games_happening + 1;


        let player1 = waiting_player;
        let player2 = socket;
        waiting_player = null;

        // joining room
        player1.join(room);
        player2.join(room);


        player1.emit("playerNumber", 1);
        player2.emit("playerNumber", 2);

        player1.emit("startGame", { yourTurn: true });
        player2.emit("startGame", { yourTurn: false });

        let current_turn = 1;

        player1.on("onmove", (data) => {
          mns.to(room).emit("updatebuttons", data);

          current_turn = current_turn === 1 ? 2 : 1;
          mns.to(room).emit("setTurn", current_turn);
        });

        player2.on("onmove", (data) => {
          mns.to(room).emit("updatebuttons", data);

          current_turn = current_turn === 1 ? 2 : 1;
          mns.to(room).emit("setTurn", current_turn);
        });


        player1.on("clicksarray", (data) => {

          //  console.log("clicks data",data)

          mns.to(room).emit("cc", data);
        });

        player2.on("clicksarray", (data) => {
          //  console.log("clicks data",data)


          mns.to(room).emit("cc", data);
        });


        player1.on("disconnect", () => {
          mns.to(room).emit("opponentLeft");
        });

        player2.on("disconnect", () => {
          mns.to(room).emit("opponentLeft");
        });

        mns.emit("clientCount", clientsConnected.length);
        console.log(`Total clients connected: ${clientsConnected.length}`);
      }

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        clientsConnected = clientsConnected.filter((id) => id !== socket.id);
        if (waiting_player && waiting_player.id === socket.id) {
          waiting_player = null;
        }

      });
    });
  } catch (error) {
    console.log("Error while setting up Socket.IO Server:", error);
    return error;
  }
};
