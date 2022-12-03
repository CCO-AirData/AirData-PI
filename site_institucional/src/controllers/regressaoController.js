var SLR = require('ml-regression').SLR;

function lm(req, res) {
  var x = req.params.temp;
  var y = req.params.rpm;

  x = x.split(",");
  y = y.split(",");

  temp = [];
  rpm = [];

  x.forEach(temperatura => {
    temp.push(parseFloat(temperatura))
  });

  y.forEach(rotacao => {
    rpm.push(parseFloat(rotacao))
  });

  const model = new SLR(temp, rpm);

  res.json(model.coefficients);
}

module.exports = {
  lm,
}