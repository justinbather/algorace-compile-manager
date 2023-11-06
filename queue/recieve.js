const amqp = require("amqplib/callback_api");

amqp.connect("amqp://127.0.0.1", function (error, connection) {
  if (error) {
    throw error;
  }

  connection.createChannel(function (error, channel) {
    if (error) {
      throw error;
    }
    let queue = "test-q";

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log("Waiting for message");

    channel.consume(
      queue,
      function (msg) {
        console.log("Recieved Message: ", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});
