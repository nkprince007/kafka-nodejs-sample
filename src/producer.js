const { Kafka, Partitioners } = require("kafkajs");
const faker = require("faker");

const brokerAddress = process.env.BROKER_ADDRESS;
const topic = process.env.TOPIC;

async function run(name) {
    try {
        const kafka = new Kafka({ clientId: "myapp", brokers: [brokerAddress] });
        const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
        await producer.connect();

        // A-M 0, N-Z 1
        const partition = name[0].toLocaleUpperCase() < "N" ? 0 : 1;

        // send message
        const result = await producer.send({
            topic,
            messages: [
                { value: name, partition }
            ],
        })
        console.log(`sent: name(${name}), ${JSON.stringify(result)}`);
        await producer.disconnect();
    } catch (ex) {
        console.error(`error occured: ${ex}`);
        process.exit(1);
    }
}

setInterval(async () => {
    const name = faker.name.firstName();
    await run(name);
}, 3000);