/// <reference types="./webpack-format-messages" />
import { codeFrameColumns } from '@babel/code-frame';
import chalk from 'chalk';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { existsSync, readFileSync } from 'fs';
import { EOL } from 'os';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import formatMessages from 'webpack-format-messages';
import { createConfig } from './webpack';

process.env.NODE_ENV = 'development';

const compiler = webpack(createConfig(true));

compiler.hooks.invalid.tap('invalid', () => {
  clearConsole();
  console.log('Compiling...');
});

let tsMessagesResolver: (msgs: {
  errors: string[];
  warnings: string[];
}) => void;
let tsMessagesPromise: Promise<{
  errors: string[];
  warnings: string[];
}> = new Promise((resolve) => {
  tsMessagesResolver = (msgs) => resolve(msgs);
});
compiler.hooks.beforeCompile.tap('beforeCompile', () => {
  tsMessagesPromise = new Promise((resolve) => {
    tsMessagesResolver = (msgs) => resolve(msgs);
  });
});

ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler).issues.tap(
  'afterTypeScriptCheck',
  (
    issues: {
      code: string;
      severity: string;
      message: string;
      file: string;
      location: any;
    }[],
  ) => {
    const allMsgs = [...issues];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const format = (message: any) =>
      `${message.file}\n${formatTypescriptMessage({
        ...message,
        line: message.location.start.line,
        character: message.location.start.column,
      })}`;

    tsMessagesResolver({
      errors: allMsgs.filter((msg) => msg.severity === 'error').map(format),
      warnings: allMsgs.filter((msg) => msg.severity === 'warning').map(format),
    });
  },
);

compiler.hooks.done.tap('done', async (stats) => {
  clearConsole();

  {
    const delayedMsg = setTimeout(() => {
      console.log(
        chalk.yellow(
          'Files successfully emitted, waiting for typecheck results...',
        ),
      );
    }, 100);

    const messages = await tsMessagesPromise;

    console.log(messages);

    clearTimeout(delayedMsg);
    clearConsole();

    // stats.compilation.warnings.push(...messages.errors);
    // stats.compilation.warnings.push(...messages.warnings);
  }

  const messages = formatMessages(stats);

  if (!messages.errors.length && !messages.warnings.length) {
    console.log(chalk.green('Compiled successfully!'));
    console.log('');
    console.log(`Hosted on http://localhost:${3000}/`);
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    console.log(chalk.red('Failed to compile.\n'));
    console.log(messages.errors.join('\n\n'));
    return;
  }
  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(messages.warnings.join('\n\n'));
  }
});

const devServer = new webpackDevServer(compiler as any, {
  hot: true,
  transportMode: 'ws',
  quiet: true,
  clientLogLevel: 'silent',
  historyApiFallback: true,
  proxy: {
    '/graphql': {
      target: 'http://localhost:5000',
      // ws: true,
    },
  },
}).listen(3000, () => {
  (['SIGINT', 'SIGTERM'] as const).forEach((sig) => {
    process.on(sig, function () {
      devServer.close();
      process.exit();
    });
  });
});

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
  );
}

const types = { diagnostic: 'TypeScript', lint: 'TSLint' };

function formatTypescriptMessage(message: any) {
  const { type, severity, file, line, content, code, character } =
    typeof message.getFile === 'function'
      ? {
          type: message.getType(),
          severity: message.getSeverity(),
          file: message.getFile(),
          line: message.getLine(),
          content: message.getContent(),
          code: message.getCode(),
          character: message.getCharacter(),
        }
      : message;

  const messageColor = message.isWarningSeverity?.() ? chalk.yellow : chalk.red;
  const fileAndNumberColor = chalk.bold.cyan;

  const source = file && existsSync(file) && readFileSync(file, 'utf-8');
  const frame = source
    ? codeFrameColumns(
        source,
        { start: { line: line, column: character } },
        { highlightCode: true },
      )
        .split('\n')
        .map((str) => '  ' + str)
        .join(EOL)
    : '';

  return [
    messageColor.bold(
      `${
        types[type as keyof typeof types] ?? type ?? 'TS'
      } ${severity.toLowerCase()} in `,
    ) +
      fileAndNumberColor(`${file}(${line},${character})`) +
      messageColor(':'),
    (content ?? message.message) +
      '  ' +
      messageColor.underline((type === 'lint' ? 'Rule: ' : 'TS') + code),
    '',
    frame,
  ].join(EOL);
}
