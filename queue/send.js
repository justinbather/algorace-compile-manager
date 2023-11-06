const amqp = require("amqplib/callback_api");

const addTask = (data, success) => {
  amqp.connect("amqp://127.0.0.1", function (error, connection) {
    if (error) {
      success(false, error);
      throw error;
    }

    connection.createChannel(function (error, channel) {
      if (error) {
        success(false, error);
        throw error;
      }

      let queue = "test-q";
      let msg = data;

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      success(true, data.jobId);
      // console.log(" Message sent: ", msg);
    });
  });
};

module.exports = addTask;
