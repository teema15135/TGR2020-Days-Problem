const tf = require("@tensorflow/tfjs-node");
const plotly = require("plotly")("Spanner15135", "J3jz20SPF6P92iwqFkYH");

function createData(num_pts) {
  const xs = [];
  const ys = [];

  for (var i = 0; i <= num_pts; i++) {
    xs.push(i);
    ys.push(2 * i + Math.random());
  }

  return {
    xs,
    ys
  };
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

function plotResults(xv, yv) {
  var data = [{ x: xv, y: yv, type: "line" }];
  var layout = { fileopt: "overwrite", filename: "TGR2020 See-It 2020 New" };
  console.log(xv);
  console.log([...yv]);

  // plotly.plot(data, layout, function(err, msg) {
  //   if (err) return console.log(err);
  //   console.log(msg);
  // });
}

async function run() {
  const data = createData(100);
  const model = createModel(200);
  const loss_arr = await trainModel(model, data.xs, data.ys, 5000);
  const yv = [...predictModel(model, data.xs)];
  plotResults(data.xs, yv);
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
