if (location.host.includes('localhost')) {
  // Load livereload script if we are on localhost
  document.write(
    '<script src="http://' +
      (location.host || 'localhost').split(':')[0] +
      ':35729/livereload.js?snipver=1"></' +
      'script>'
  )
}

console.log('This is a Test')

const generateBackendUrl = () => {
  const { protocol, host } = window.location;
  if (protocol === 'http:') return `ws://${host}`;
  if (protocol === 'https:') return `wss://${host}`;
  throw new Error('Unknown protocol');
};

const generateMessage = (message, myUser) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add(
    'max-width: 400px',
    'background: #fff',
    'margin: 0 auto',
    'margin-top: 50px',
    'border-radius: 10px',
    'padding: 30px',
    'border-bottom: 1px solid #e6ecf0',
    'border-top: 1px solid #e6ecf0'
  );
}