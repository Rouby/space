#!/usr/bin/env ts-node

import * as figlet from 'figlet';
import * as program from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log(figlet.textSync('Eventing', { horizontalLayout: 'full' }));

program
  .version('1.0.0')
  .command('event <name>')
  .option('-u|--has-user', 'This event has always a valid user')
  .option('-p|--path', 'Path to the events folder')
  .action((type, name, { path = './src/events', hasUser }) => {
    console.log(`Creating new event ${name}...`);
    const template = readFileSync(join(__dirname, 'templates', type), 'utf8');
    writeFileSync(
      join(path, `${name}.ts`),
      template
        .replace(/\$\$EventName/g, name)
        .replace(/\$\$HasUser/g, hasUser ? 'true' : 'false'),
    );
    console.log(`New Event ${name} created: ${join(path, `${name}.ts`)}`);
  });

program
  .version('1.0.0')
  .command('aggregate <name>')
  .option('-p|--path', 'Path to the events folder')
  .action((type, name, { path = './src/write' }) => {
    console.log(`Creating new aggregate ${name}...`);
    const template = readFileSync(join(__dirname, 'templates', type), 'utf8');
    writeFileSync(
      join(path, `${name}.ts`),
      template.replace(/\$\$AggregateName/g, name),
    );
    console.log(`New Event ${name} created: ${join(path, `${name}.ts`)}`);
  });

program.parse(process.argv);
