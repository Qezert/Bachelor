import mqtt from "mqtt";

const client = mqtt.connect("mqtts://297c855daffc48bb8d335683b6907b85.s1.eu.hivemq.cloud:8883", {
  username: "hive.server.1",
  password: "ThisIs69!APassword",
});

  client.on("connect", () => {
    console.log("Backend MQTT connected");
    client.subscribe("iot/+/sensor", (err) => {
      if (!err) console.log("Subscribed to all device sensor topics");
    });
  });

  client.on("message", (topic, message) => {
    const match = topic.match(/^iot\/(.+)\/sensor$/);
    if (!match) return;

    const deviceId = match[1];
    const value = parseFloat(message.toString());

    console.log(`Device ${deviceId} sent: ${value}`);

    const result = value > 10; // Simple logic for demo
    const resultTopic = `iot/${deviceId}/result`;

    client.publish(resultTopic, JSON.stringify({ success: result }));
  });