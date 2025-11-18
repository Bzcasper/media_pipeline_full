// src/core.ts
import { Blob } from "buffer";
import type { Uploadable } from "./types";

// A FormData implementation that works in both Node.js and browser environments.
let FormDataImpl: any;
let FileImpl: typeof File;
let isNodeJs = false;

try {
  // Use built-in FormData and File in browser environments
  FormDataImpl = FormData;
  FileImpl = File;
} catch (e) {
  // Use polyfills in Node.js environments
  FormDataImpl = require("form-data");
  isNodeJs = true;
  // There's no direct universal polyfill for `File` in Node.js that matches the browser's,
  // but `form-data` can handle streams and buffers, which covers the Node.js use case.
}

/**
 * Runtime type guard for Uploadable types
 * Prevents accidental passing of non-binary data to FormData
 */
export function isUploadable(value: any): value is Uploadable {
  return (
    Buffer.isBuffer(value) ||
    value instanceof Blob ||
    value instanceof File ||
    value instanceof Uint8Array ||
    value instanceof ArrayBuffer
  );
}

/**
 * Converts a plain JavaScript object into a FormData object.
 *
 * @param obj The object to convert.
 * @returns A FormData object.
 */
export function toFormData(obj: Record<string, any>): FormData {
  const form = new FormDataImpl();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (value === undefined || value === null) {
        continue;
      }

      // Universal file type support: Buffer (Node), Blob (browser/fetch), File (browser upload)
      // This handles all uploadable types: Buffer | Blob | File | ArrayBuffer | Uint8Array
      if (
        isUploadable(value) || // Uploadable type guard
        (typeof value.pipe === "function" && value.readable) // Readable stream (Node)
      ) {
        // Handle different environments
        if (isNodeJs && Buffer.isBuffer(value)) {
          // Node.js form-data package needs special handling for Buffers
          (form as any).append(key, value, { filename: 'upload', contentType: 'application/octet-stream' });
        } else {
          form.append(key, value as any);
        }
        continue;
      }

      // For arrays and objects, serialize them as JSON strings.
      if (typeof value === "object" || Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
        continue;
      }

      // For primitive types (string, number, boolean), convert to string.
      form.append(key, String(value));
    }
  }

  return form;
}
