const amqp = require("amqplib/callback_api");
require('dotenv').config()

const url = process.env.AMQP_URL || 'amqp://127.0.0.1'

const addTask = (data, success) => {
  amqp.connect(url, function(error, connection) {
    if (error) {
      success(false, error);
      throw error;
    }

    connection.createChannel(function(error, channel) {
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
