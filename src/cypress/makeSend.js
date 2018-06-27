module.exports = (port, fetch) => (command, data) =>
  fetch(`http://localhost:${port}/eyes/${command}`, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });
