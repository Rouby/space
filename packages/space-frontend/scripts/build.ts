/// <reference types="./webpack-format-messages" />
import chalk from 'chalk';
import webpack from 'webpack';
import formatMessages from 'webpack-format-messages';
import { createConfig } from './webpack';

process.env.NODE_ENV = 'production';

const compiler = webpack(createConfig(false));

compiler.run(async (_err, stats) => {
  const messages = formatMessages(stats);

  if (!messages.errors.length && !messages.warnings.length) {
    console.log(chalk.green('Build successfully!'));
    console.log('');
    console.log(`Hosted on http://localhost:${3000}/`);
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log(chalk.red('Failed to build.\n'));
    console.log(messages.errors.join('\n\n'));

    process.exit(1);
  }
  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Build with warnings.\n'));
    console.log(messages.warnings.join('\n\n'));

    process.exit(1);
  }
});
