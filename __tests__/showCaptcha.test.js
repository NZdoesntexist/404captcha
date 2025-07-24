const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const path = require('path');
const { JSDOM } = require('jsdom');

test('showCaptcha hides boot-screen and shows captcha-screen', async () => {
  const dom = await JSDOM.fromFile(path.resolve(__dirname, '../index.html'), {
    runScripts: 'dangerously',
    resources: 'usable'
  });

  await new Promise((res) => {
    dom.window.addEventListener('load', res);
  });

  const { document } = dom.window;
  const boot = document.getElementById('boot-screen');
  const captcha = document.getElementById('captcha-screen');

  expect(boot.classList.contains('hidden')).toBe(false);
  expect(captcha.classList.contains('hidden')).toBe(true);

  dom.window.showCaptcha();

  expect(boot.classList.contains('hidden')).toBe(true);
  expect(captcha.classList.contains('hidden')).toBe(false);

  dom.window.close();
});
