/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

let command = 0;

const getCommandID = (context,_ , done) => {
  context.vars.commandID = `cmd-${++command}`;
  done();
}

module.exports = {
  getCommandID
};