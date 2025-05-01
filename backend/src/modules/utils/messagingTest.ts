import { publishMessage } from '../../messaging/publisher';
import { consumeMessages } from '../../messaging/consumer';

const queueName = 'movieQueue';

// Start the consumer
consumeMessages(queueName, (msg) => {
  console.log('✅ Mesazh i pranuar nga queue:', msg);
});

// Dërgo një mesazh pas 1 sekonde (që të sigurohemi që consumer është gati)
setTimeout(() => {
  publishMessage(queueName, {
    title: 'Interstellar',
    duration: 169,
    release_year: 2014,
    poster_url: 'interstellar.jpg',
  });
}, 1000);
