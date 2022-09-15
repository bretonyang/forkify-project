import { TIMEOUT_SECONDS } from './config';

const timeout = function (seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
};

/**
 * Make an AJAX call, return a promise which resolves to some data
 * @param {String} url The url of API to fetch data from
 * @param {Boolean} [dataToUpload=undefined] If not undefined, then it'll be uploaded to specified url
 * @returns
 */
export const AJAX = async function (url, dataToUpload = undefined) {
  try {
    const fetchPromise = dataToUpload
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToUpload),
        })
      : fetch(url);

    const response = await Promise.race([
      fetchPromise,
      timeout(TIMEOUT_SECONDS),
    ]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};
