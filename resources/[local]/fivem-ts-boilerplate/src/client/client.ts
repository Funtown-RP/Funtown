setImmediate(() => {
  emitNet('helloserver');
});

onNet('helloclient', message => {
  console.log(`The server replied: ${message}`);
});

RegisterCommand("example", (source: number, args: string[], _rawCommand: string) => {
  console.log(`Example command executed. Source: ${source}, arguments: ${args.join(", ")}`);
}, false)

global.exports("example", (arg: string) => {
  console.log(arg);
});