export function getUserData() {
  const userData = JSON.parse(window.localStorage.getItem('user'));

  if (!userData || userData === null) return null;

  const decoded = {
    ...userData,
    email: window.atob(userData.email),
    uid: window.atob(userData.uid),
    accessToken: window.atob(userData.accessToken),
  };

  return decoded;
}
