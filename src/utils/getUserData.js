export function getUserData() {
  const userData = JSON.parse(window.localStorage.getItem('user'));

  if (!userData || userData === null) return null;

  const decoded = {
    ...userData,
    auth: window.atob(userData.auth),
    uid: window.atob(userData.uid),
  };

  return decoded;
}
