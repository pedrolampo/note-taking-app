export function getUserData() {
  const userData = JSON.parse(window.localStorage.getItem('user'));

  if (!userData || userData === null) return null;

  const decoded = {
    ...userData,
  };

  return decoded;
}
