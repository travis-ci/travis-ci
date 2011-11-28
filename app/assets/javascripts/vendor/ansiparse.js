ansiparse = function (str) {
  //
  // I'm terrible at writing parsers.
  //
  var matchingControl = null,
      matchingData = null,
      matchingText = '',
      ansiState = [],
      result = [],
      state = {};

  //
  // General workflow for this thing is:
  // \033\[33mText
  // |     |  |
  // |     |  matchingText
  // |     matchingData
  // matchingControl
  //
  // In further steps we hope it's all going to be fine. It usually is.
  //

  for (var i = 0; i < str.length; i++) {
    if (matchingControl != null) {
      if (matchingControl == '\033' && str[i] == '\[') {
        //
        // We've matched full control code. Lets start matching formating data.
        //
        matchingControl = null;
        matchingData = '';
      }
      else {
        //
        // We failed to match anything - most likely a bad control code. We
        // go back to matching regular strings.
        //
        matchingControl = null;
      }
      continue;
    }
    else if (matchingData != null) {
      if (str[i] == ';') {
        //
        // `;` separates many formatting codes, for example: `\033[33;43m`
        // means that both `33` and `43` should be applied.
        //
        // TODO: this can be simplified by modifying state here.
        //
        ansiState.push(matchingData);
        matchingData = '';
      }
      else if (str[i] == 'm') {
        //
        // `m` finished whole formatting code. We can proceed to matching
        // formatted text.
        //
        ansiState.push(matchingData);
        matchingData = null;
        matchingText = '';

        //
        // Convert matched formatting data into user-friendly state object.
        //
        // TODO: DRY.
        //
        ansiState.forEach(function (ansiCode) {
          if ((30 <= ansiCode) && (ansiCode <= 37)) {
            state.foreground = ansiparse.foregroundColors[ansiCode];
          }
          else if ((40 <= ansiCode) && (ansiCode <= 47)) {
            state.background = ansiparse.backgroundColors[ansiCode];
          }
          else if (ansiCode == 39) {
            delete state.foreground;
          }
          else if (ansiCode == 49) {
            delete state.background;
          }
          else if (ansiCode == 1) {
            state.bold = true;
          }
          else if (ansiCode == 3) {
            state.italic = true;
          }
          else if (ansiCode == 4) {
            state.underline = true;
          }
          else if (ansiCode == 22) {
            state.bold = false;
          }
          else if (ansiCode == 23) {
            state.italic = false;
          }
          else if (ansiCode == 24) {
            state.underline = false;
          }
        });
        ansiState = [];
      }
      else {
        matchingData += str[i];
      }
      continue;
    }

    if (str[i] == '\033') {
      matchingControl = str[i];

      //
      // "emit" matched text with correct state
      //
      if (matchingText) {
        state.text = matchingText;
        result.push(state);
        state = {};
      }
    }
    else {
      matchingText += str[i];
    }
  }

  if (matchingText) {
    state.text = matchingText;
    result.push(state);
  }
  return result;
}

ansiparse.foregroundColors = {
  '30': 'black',
  '31': 'red',
  '32': 'green',
  '33': 'yellow',
  '34': 'blue',
  '35': 'magenta',
  '36': 'cyan',
  '37': 'white'
};

ansiparse.backgroundColors = {
  '40': 'black',
  '41': 'red',
  '42': 'green',
  '43': 'yellow',
  '44': 'blue',
  '45': 'magenta',
  '46': 'cyan',
  '47': 'white'
};

if (typeof module == "object" && typeof window == "undefined") {
  module.exports = ansiparse;
}

