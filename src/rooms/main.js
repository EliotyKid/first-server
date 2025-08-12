import {Room} from "colyseus"
import {Player} from "../entities/player.js"

export class MainRoom extends Room {
  // onAuth(){

  // }

  onCreate(options){
    console.log("oudrikandalahai")
    this.autoDispose = false 
    this.onMessage("*", (client, event, message)=>{
      console.log("received event", event, "from client", client.sessionId, "with message:", message)
      switch(event){
        case  "set_player_input_pos":
          message = JSON.parse(message);
          let player = this.client_list.get(client.sessionId);
          if (player) {
            player.setPosition(message.position.x, message.position.y);
          }
          // console.log("set_player_input_pos", message);
          this.broadcast("set_player_input_pos", {
            sessionId: client.sessionId,
            input: message.inputs,
            position: message.position,
          }, {except: client});
          break;
        default:
          console.log("unknown event", event);
      }
    })
    this.client_list = new Map();
  }

  onJoin(client, options, auth){
    console.log("loguei",client.sessionId)
    let player_list = [];
    this.client_list.forEach((_client, key) =>{
      if (key !== client.sessionId){
        player_list.push(_client.get_data());
      }
    });
    client.send("load_players", {id: client.sessionId, player_list});
    client.send("instantiate_player", {
      sessionId: client.sessionId,
      position: {x: 0, y: 0},
    });

    this.client_list.set(client.sessionId,new Player(client));

    this.client_list.forEach((_client, key) =>{
      if (key !== client.sessionId){///verifica se o id é diferente do que acabou de entrar
        _client.socket.send("new_player", { sessionId: client.sessionId, message: "new_player_joined" });
      }
    })
  }

  onLeave(client, consented){

  }

  onDispose(){
    console.log("sala destruida")
  }
}