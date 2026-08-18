import '@testing-library/jest-dom/vitest';

import { beforeEach, beforeAll } from 'vitest';

beforeEach(() => {
    document.body.innerHTML = `
    <div id="root"></div>
    <div id="modal"></div>
  `;
});


beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,

            addListener: () => {},
            removeListener: () => {},

            addEventListener: () => {},
            removeEventListener: () => {},

            dispatchEvent: () => false,
        }),
    });
});
