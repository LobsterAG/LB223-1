const { token } = await response.json();

const secretResponse = await fetch("/", {
  headers: {
    Authorization: `${token}`,
  },
});
if (response.status === 401) {
  window.location.href = "./index.html";
} else {
  window.location.href = "./home.html";
}