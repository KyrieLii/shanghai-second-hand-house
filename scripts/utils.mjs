export const getDate = (offset = 0) => {
  const now = new Date();

  now.setDate(now.getDate() + offset);

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return {
    year,
    month,
    day,
    yyyymmdd: `${year}-${month}-${day}`,
  };
};

const getRandom = (min, max) => {
  const minn = Math.ceil(min);
  const maxx = Math.ceil(max);
  return Math.floor(Math.random() * (maxx - minn + 1)) + minn;
};

export const sleep = (ms = 1000, random = { min: 1000, max: 5000 }) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms ? ms : getRandom(random.min, random.max)),
  );

export const fetchWithRetry = async (fn, retry) => {
  let count = 0;
  while (count < retry) {
    try {
      return await fn();
    } catch (e) {
      console.log(`fetch error: ${e}`);
      count++;
      await sleep();
    }
  }
  return null;
};
