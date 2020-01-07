const tf = require('@tensorflow/tfjs-node');

async function run() {
    const dataset = tf.data.csv('./car.csv', {hasHeader: true});
    console.log(dataset);
    const v = await dataset.take(2).toArray();
    v.forEach((line) => {
        console.log(line);
    });
}