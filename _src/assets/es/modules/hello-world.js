class Message {
  constructor(message) {
    this._message = message;
  }
  hello_world() {
    console.log(this._message);
  }
}
export default Message;
