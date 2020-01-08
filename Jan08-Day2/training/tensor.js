const tf = require("@tensorflow/tfjs-node");

async function createData(filename) {
    const dataset = tf.data.csv('file://' + filename, {hasHeader: true});
    // console.log(dataset);
    let v = await dataset.toArray();

    console.log(v);
}

function createModel(num_nodes) {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: num_nodes,
      activation: "relu",
      inputShape: [1]
    })
  );
  model.add(tf.layers.dense({ units: 1, activation: "linear" }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });
  return model;
}

async function trainModel(model, xs, ys, epochs) {
  const loss_arr = [];

  const tf_xs = tf.tensor1d(xs);
  const tf_ys = tf.tensor1d(ys);

  await model.fit(tf_xs, tf_ys, {
    epochs: epochs,
    callbacks: {
      onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
    }
  });
  return loss_arr;
}

function predictModel(model, xv) {
  const tf_xv = tf.tensor1d(xv);
  const yv = model.predict(tf_xv).dataSync();
  return yv;
}

async function run() {
  const data = await createData('../csv/data.csv');
//   const model = createModel(200);
//   const loss_arr = await trainModel(model, data.xs, data.ys, 5000);
//   const yv = [...predictModel(model, data.xs)];
//   plotResults(data.xs, yv);
}

module.exports = {
  createData,
  createModel,
  trainModel,
  predictModel
}

run()
  .then(() => {
    console.log("RUN SUCCESSFUL");
  })
  .catch(err => console.log(err));
