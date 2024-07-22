/**
 * String Shorter {0x..1234}
 *
 * @param {string} str
 * @param {number} length
 *
 * @returns string shorter
 */
export const shorter = (str?: string | null, length = 6): string => {
  if (!str) {
    return "";
  } else {
    return `${str.slice(0, length)}...${str.slice(str.length - 4, str.length)}`;
  }
};

export const textShorter = (str: string, length = 14): string => {
  if (str.length <= length) {
    return str;
  } else {
    return `${str.slice(0, length)}...`;
  }
};

export const walletShorter = (str?: string | null, length = 6): string => {
  if (!str) {
    return "";
  } else {
    return `${str.slice(0, length)}...${str.slice(str.length - 4, str.length)}`;
  }
};
