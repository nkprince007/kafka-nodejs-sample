const { Kafka } = require("kafkajs");

const brokerAddress = process.env.BROKER_ADDRESS;
const groupId = process.env.GROUP_ID;
const topic = process.env.TOPIC;

async function run() {
    try {
        const kafka = new Kafka({ clientId: "myapp", brokers: [brokerAddress] });
        const consumer = kafka.consumer({ groupId });
        console.log("Connecting...");
        await consumer.connect();
        console.log("Connected!");

        await consumer.subscribe({
            topic,
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async result => {
                console.log(`recv: mesg ${result.message.value} on partition ${result.partition}`);
            },
        });
    } catch (ex) {
        console.error(`error occured: ${ex}`);
    }
}

run();