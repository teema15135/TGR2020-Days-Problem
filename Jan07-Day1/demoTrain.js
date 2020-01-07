const tf = require('@tensorflow/tfjs-node');

const model = tf.sequential();

// How many hidden layer told in units
model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

const loss = [];

model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: (epoch, log) => {
        console.log(`Epoch ${epoch}: loss = ${log.loss}`);
        loss.push(log.loss);
    },
    onTrainEnd: (batch, log) => console.log('END!!!!')
  },
}).then((value) => {
    console.log(loss);
});