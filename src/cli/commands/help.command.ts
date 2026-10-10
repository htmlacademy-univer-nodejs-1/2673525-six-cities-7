import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.bold('Программа для подготовки данных для REST API сервера.')}

        Использование:
          ${chalk.bold('main.cli.js')} ${chalk.cyan('--<command>')} ${chalk.magenta('[--arguments]')}

        Команды:
          ${chalk.cyan('--version')}                    ${chalk.gray('# выводит номер версии')}
          ${chalk.cyan('--help')}                       ${chalk.gray('# печатает этот текст')}
          ${chalk.cyan('--import')} ${chalk.magenta('<path>')}              ${chalk.gray('# импортирует данные из TSV')}
          ${chalk.cyan('--generate')} ${chalk.magenta('<n>')} ${chalk.magenta('<path>')} ${chalk.magenta('<url>')}  ${chalk.gray('# генерирует произвольное количество тестовых данных')}

        Примеры:
          ${chalk.green('node ./dist/main.cli.js --help')}
          ${chalk.green('node ./dist/main.cli.js --version')}
          ${chalk.green('npm run cli -- --import ./mocks/mock-data.tsv')}
            `);
  }
}
