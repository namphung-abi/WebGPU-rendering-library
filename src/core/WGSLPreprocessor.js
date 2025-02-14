export default class WGSLPreProcess {

  static process(source, inputDirectives = []) {
    let processedSource = "";
    let lines = source.split("\n");

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.startsWith("#if")) {
        let { directiveBlock, continueLineIndex } = this._getDirectiveBlock(lines, i);
        let processedDirectiveBlock = this._processDirectiveBlock(directiveBlock, inputDirectives);
        processedSource += `${processedDirectiveBlock }\n`;
        i = continueLineIndex;
      }
      else {
        processedSource += `${line }\n`;
      }
    }
    return processedSource;
  }

  static _getDirectiveBlock(lines, startIndex) {
    let directiveBlock = "";
    let continueLineIndex = startIndex;
    while (continueLineIndex < lines.length) {
      let line = lines[continueLineIndex];
      directiveBlock += line;
      continueLineIndex++;
      if (line.startsWith("#endif")) {
        break;
      }
    }
    return { directiveBlock, continueLineIndex };
  }

  static _processDirectiveBlock(directiveBlock, inputDirectives) {
    let processedDirectiveBlock = "";
    let lines = directiveBlock.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.startsWith("#if")) {
        let directive = line.split(" ")[1];
        if (inputDirectives.includes(directive)) {
          i++;
          while (i < lines.length) {
            let nextLine = lines[i];
            if (nextLine.startsWith("#endif")) {
              break;
            }
            processedDirectiveBlock += `${nextLine }\n`;
            i++;
          }
        }
      }
    }
    return processedDirectiveBlock;
  }

}
