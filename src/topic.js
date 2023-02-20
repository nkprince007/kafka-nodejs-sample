const { Kafka } = require("kafkajs");

const brokerAddress = process.env.BROKER_ADDRESS;
const topic = process.env.TOPIC;

async function run() {
    console.log(`Trying to connect to topic: ${topic} via broker: ${brokerAddress}`);
    try {
        const kafka = new Kafka({ clientId: "myapp", brokers: [brokerAddress] });
        const admin = kafka.admin();
        console.log("Connecting...");
        await admin.connect();
        console.log("Connected!");

        // A-M, N-Z
        await admin.createTopics({
            topics: [{
                topic,
                numPartitions: 2,
            }]
        });
        console.log("Done.");
        await admin.disconnect();
    } catch (ex) {
        console.error(`error occured: ${ex}`);
    } finally {
        process.exit(0);
    }
}

run();