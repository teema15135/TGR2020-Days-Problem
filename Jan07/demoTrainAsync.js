const tf = require("@tensorflow/tfjs-node");

async function test() {
  const model = tf.sequential();

  // How many hidden layer told in units
  model.add(
    tf.layers.dense({ units: 100, activation: "relu", inputShape: [10] })
  );
  model.add(tf.layers.dense({ units: 1, activation: "linear" }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  const xs = tf.randomNormal([100, 10]);
  const ys = tf.randomNormal([100, 1]);

  const loss = [];
  let finish = false;

  await model
    .fit(xs, ys, {
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, log) => {
          console.log(`Epoch ${epoch}: loss = ${log.loss}`);
          loss.push(log.loss);
        },
        onTrainEnd: (batch, log) => {
          //console.log(loss);
        }
      }
    });

  const yv = model.predict(xs);
  console.log(yv.dataSync())
  return loss;
}

test().then((loss) => {
  console.log(loss);
})