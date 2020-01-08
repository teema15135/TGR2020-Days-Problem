const tf = require('@tensorflow/tfjs-node');

async function createData(filename) {
    const WINDOW_SIZE = 10
    const dataset = tf.data.csv('file://' + filename, {hasHeader: true});
    // console.log(dataset);
    let v = await dataset.toArray();

    // console.log(Object.keys(t1)[0]);

    const v_len = v.length;
    const xs = [];
    const ys = [];
    for(var i = 0; i < v_len - WINDOW_SIZE - 1; i++) {
        const x = [];
        for(var j = 0; j < 5; j++) {
            x.push(await v[i+j][Object.keys(v[i+j])[0]]);
            if(j == 4) ys.push(await v[i+5][Object.keys(v[i+j])[0]]);
        }
        xs.push(x);
    }
    return {
        xs,
        ys
    }
}

createData('oneToHundredSixty.csv').then(data =>{
    console.log("XS: ", data.xs);
    console.log("YS: ", data.ys);
}).catch(err => console.log(err));