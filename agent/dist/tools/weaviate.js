"use strict";
/**
 * Weaviate Tool
 * Handles vector indexing and semantic search
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.weaviate = void 0;
exports.weaviate = {
    /**
     * Initialize Weaviate client
     */
    getClient: () => {
        const weaviateUrl = process.env.WEAVIATE_URL;
        const apiKey = process.env.WEAVIATE_API_KEY;
        if (!weaviateUrl) {
            throw new Error('WEAVIATE_URL environment variable is not set');
        }
        // For now, return a simple fetch-based client
        // In production, use the official Weaviate client SDK
        return {
            url: weaviateUrl,
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
            }
        };
    },
    /**
     * Index a media document
     */
    indexDocument: async (doc) => {
        const client = exports.weaviate.getClient();
        const response = await fetch(`${client.url}/v1/objects`, {
            method: 'POST',
            headers: client.headers,
            body: JSON.stringify({
                class: 'MediaDocument',
                properties: {
                    ...doc,
                    indexedAt: new Date().toISOString()
                }
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to index document: ${error}`);
        }
    },
    /**
     * Batch index documents
     */
    batchIndex: async (docs) => {
        const client = exports.weaviate.getClient();
        const objects = docs.map(doc => ({
            class: 'MediaDocument',
            properties: {
                ...doc,
                indexedAt: new Date().toISOString()
            }
        }));
        const response = await fetch(`${client.url}/v1/batch/objects`, {
            method: 'POST',
            headers: client.headers,
            body: JSON.stringify({ objects })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to batch index documents: ${error}`);
        }
    },
    /**
     * Search documents
     */
    search: async (query, limit = 10) => {
        const client = exports.weaviate.getClient();
        const response = await fetch(`${client.url}/v1/graphql`, {
            method: 'POST',
            headers: client.headers,
            body: JSON.stringify({
                query: `
          {
            Get {
              MediaDocument(
                nearText: {
                  concepts: ["${query}"]
                }
                limit: ${limit}
              ) {
                id
                title
                artist
                album
                genre
                mood
                lyrics
                transcription
                bpm
                key
                audioUrl
                coverUrl
                videoUrl
                metadata
              }
            }
          }
        `
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to search documents: ${error}`);
        }
        const result = await response.json();
        return result.data?.Get?.MediaDocument || [];
    },
    /**
     * Get document by ID
     */
    getById: async (id) => {
        const client = exports.weaviate.getClient();
        const response = await fetch(`${client.url}/v1/objects/MediaDocument/${id}`, {
            method: 'GET',
            headers: client.headers
        });
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to get document: ${error}`);
        }
        const result = await response.json();
        return result.properties;
    },
    /**
     * Delete document
     */
    deleteById: async (id) => {
        const client = exports.weaviate.getClient();
        const response = await fetch(`${client.url}/v1/objects/MediaDocument/${id}`, {
            method: 'DELETE',
            headers: client.headers
        });
        if (!response.ok && response.status !== 404) {
            const error = await response.text();
            throw new Error(`Failed to delete document: ${error}`);
        }
    }
};
exports.default = exports.weaviate;
//# sourceMappingURL=weaviate.js.map