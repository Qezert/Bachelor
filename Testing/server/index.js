require('dotenv').config();
const mqtt = require('mqtt');

const client = mqtt.connect(process.env.MQTT_BROKER);

client.on('connect', () => {
  console.log('✅ Backend connected to MQTT broker');
  client.subscribe('iot/sensor');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { deviceId, orientation } = data;

    // Tilt check (e.g., phone leaning forward more than 30°)
    const isLeaning = orientation && orientation.beta > 30;

    // Respond to that device
    client.publish(`iot/${deviceId}/result`, JSON.stringify({ result: isLeaning }));
    console.log(`[${deviceId}] Tilt (beta): ${orientation.beta}, result: ${isLeaning}`);
  } catch (e) {
    console.error('Error parsing message:', e.message);
  }
});
