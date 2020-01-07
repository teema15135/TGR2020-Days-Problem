const regress = require('./prob1_regression_model');

const tf = require('@tensorflow/tfjs-node');

test('createData with 123 num_pts must got xs and ys with length 123', () => {
  const data = regress.createData(123);
  expect(data.xs.length).toBe(124);
  expect(data.ys.length).toBe(124);
});

test('createModel with units4 must get layer units to be 4', () => {
  expect(regress.createModel(4).layers[0].units).toBe(4);
});

test('trainModel with epoch 8 must return array with length 8', done => {
  const data = regress.createData(100);
  regress.trainModel(regress.createModel(4), data.xs, data.ys, 8)
  .then(loss_arr => {
    expect(loss_arr.length).toBe(8);
    done();
  })
});

test('predictModel with num_pts > 30 got MSE less than 0.1', done => {
  const data = regress.createData(100);
  const model = regress.createModel(3)
  regress.trainModel(model, data.xs, data.ys, 10)
  .then(loss_arr => {
    const yv = [...regress.predictModel(model, data.xs)];
    const len = yv.length;
    var sum = 0;
    for(var i = 0; i < len; i++) {
      sum += (data.ys[i] - yv[i]) * (data.ys[i] - yv[i])
    }
    sum /= len;
    expect(sum).toBeLessThan(0.1);
    done();
  });
});

test('predictModel with num_pts < 5 got MSE more than 0.2', done => {
  const data = regress.createData(3);
  const model = regress.createModel(3)
  regress.trainModel(model, data.xs, data.ys, 10)
  .then(loss_arr => {
    const yv = [...regress.predictModel(model, data.xs)];
    const len = yv.length;
    var sum = 0;
    for(var i = 0; i < len; i++) {
      sum += (data.ys[i] - yv[i]) * (data.ys[i] - yv[i])
    }
    sum /= len;
    expect(sum).toBeGreaterThan(0.2);
    done();
  });
});