var Kafka                  = require("node-rdkafka");
require('dotenv').config();
const producer =  require('./producer');

var kafkaConf              = {
  "group.id"               : "cloudkarafka-example",
  "metadata.broker.list"   : process.env.CLOUDKARAFKA_BROKERS.split(","), 
  "socket.keepalive.enable": true,
  "security.protocol"      : "SASL_SSL",
  "sasl.mechanisms"        : "SCRAM-SHA-256",  
  "sasl.username"          : process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password"          : process.env.CLOUDKARAFKA_PASSWORD,
  "enable.auto.commit"     : true,
  "debug"                  : "generic,broker,security"
};

const prefix         = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topics         = [`${prefix}processOrder`];
const consumer       = new Kafka.KafkaConsumer(kafkaConf,{
  "auto.offset.reset": "latest"
});
const numMessages    = 5;
let counter          = 0;

consumer.connect();

consumer.on("error", function (err) {
  console.error(err);
});

consumer.on("ready", function (arg) {
  console.log('Consumer Start')
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics); 
  consumer.consume();
});


consumer.on("data", function (m) {

    const stringData       = m.value.toString();    
    const objData          = JSON.parse(stringData);      
    console.log('Receive order: '+ objData._id);

    setTimeout(function () {      
    }, 30000);


    producer.deliverPizza(objData._id, "delivered")



});


consumer.on("disconnected", function (arg) {
  console.log("consumer disconnected");
  process.exit();
});



consumer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});


consumer.on('event.log', function (log) {
  // console.log(log);
});

// setTimeout(function () {
//   consumer.disconnect();
// }, 30000);