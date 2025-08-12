export class Player {
  constructor(client){
    this.socket = client;
    this.position = {
      x: 0,
      y: 0
    }
    
  }

  setPosition(x, y) {
    if (typeof x === "number" && typeof y === "number") {
      this.position.x = x;
      this.position.y = y;
    } else {
      console.warn("Posição inválida recebida:", x, y);
    }
  }


  getPosition(){
    return this.position;
  }

  get_data = () =>{
    return {
      session_id: this.socket.sessionId,
      position: this.position
    }
  }
}