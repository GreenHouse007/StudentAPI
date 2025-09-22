const awesomeFunction = (req, res) => {
  res.send("Hello World!");
};

const tooeleTech = (req, res) => {
  res.send("Tooele Tech is Awesome!");
};

const alexMessage = (req, res) => {
  res.send("Made by Alex");
};

module.exports = { awesomeFunction, tooeleTech, alexMessage };
