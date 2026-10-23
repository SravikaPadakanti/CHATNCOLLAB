import nodeBuffer from 'node:buffer';

// Polyfill SlowBuffer for legacy packages (like buffer-equal-constant-time used by jwa/jsonwebtoken)
if (!nodeBuffer.SlowBuffer) {
    nodeBuffer.SlowBuffer = nodeBuffer.Buffer;
}

if (typeof globalThis.SlowBuffer === 'undefined') {
    globalThis.SlowBuffer = nodeBuffer.Buffer;
}
