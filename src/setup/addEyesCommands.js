'use strict';

const commandsImport = `\nimport '@applitools/eyes-cypress/commands'\n`;
const oldName = `eyes.cypress`;

function shouldSkipLine(line) {
  return line.trim() === '' || /^\s*['"]use strict/.test(line) || /^\s*\/\//.test(line);
}

function addEyesCommands(content) {
  if (content.includes(oldName)) {
    return content.replace(oldName, 'eyes-cypress');
  }
  const lines = content.split('\n');
  let i = 0;
  while (shouldSkipLine(lines[i++])) {}
  let index = i === 1 ? i : i - 1;
  lines.splice(index, 0, commandsImport);

  return lines.join('\n');
}

module.exports = addEyesCommands;
module.exports.commandsImport = commandsImport;
