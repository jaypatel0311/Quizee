import * as _ from "lodash";

// Convert a string to title case

function toTitleCase(str) {
  return _.startCase(_.toLower(str));
}

const Utils = {
  toTitleCase,
};

export default Utils;
