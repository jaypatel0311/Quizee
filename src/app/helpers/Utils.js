import * as _ from "lodash";
import Constants from "./Constants";

// Convert a string to title case

function toTitleCase(str) {
  return _.startCase(_.toLower(str));
}

function isValidPassword(password) {
  var mandatoryCount = 0;
  var optionalCount = 0;
  const passwordSize = _.size(password);

  if (passwordSize >= 6 && passwordSize <= 50) {
    mandatoryCount++;
  }
  if (Constants.smallLetter.test(password)) {
    // Check password contains a small letter.
    mandatoryCount++;
  }
  if (Constants.capitalLetter.test(password)) {
    // Check password contains a capital letter.
    mandatoryCount++;
  }

  if (Constants.digits.test(password)) {
    // Check password contains a number.
    optionalCount++;
  }
  if (Constants.specialLetter.test(password)) {
    // Check password contains a special character.
    optionalCount++;
  }
  return mandatoryCount === 3 && optionalCount >= 1;
}

const Utils = {
  toTitleCase,
  isValidPassword,
};

export default Utils;
