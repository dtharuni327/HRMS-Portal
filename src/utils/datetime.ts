export const getISTNow = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
};

export const getISTDate = () => {
  const now = getISTNow();
  return now.toISOString().split('T')[0];
};

export const getISTDateTime = () => {
  const now = getISTNow();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};