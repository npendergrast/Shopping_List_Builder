export const tokenHasExpired = (expires) => {
  const currentDate = new Date();
  const expiryDate = new Date(expires);
  if (expiryDate < currentDate) return true;
};
