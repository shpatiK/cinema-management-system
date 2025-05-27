import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export const consumeMessages = async (queue: string, callback: (msg: any) => void) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    console.log(`📥 Listening to queue '${queue}'...`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        callback(data);
        channel.ack(msg); 
      }
    });
  } catch (error) {
    console.error('❌ Message consumption error:', error);
  }
};