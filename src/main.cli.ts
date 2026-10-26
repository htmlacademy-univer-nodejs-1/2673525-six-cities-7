#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

async function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  await cliApplication.processCommand(process.argv);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to run CLI:', error);
  process.exit(1);
});
