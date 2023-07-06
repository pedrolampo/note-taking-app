export function getUserData() {
  const userData = JSON.parse(window.localStorage.getItem('user'));

  if (!userData || userData === null) return null;

  const decoded = {
    ...userData,
    apiKey: window.atob(userData.apiKey),
    uid: window.atob(userData.uid),
  };
  console.log(decoded);

  return decoded;
}
