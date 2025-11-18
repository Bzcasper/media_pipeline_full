/**
 * Weaviate Tool
 * Handles vector indexing and semantic search
 */
export interface MediaDocument {
    id: string;
    title: string;
    artist?: string;
    album?: string;
    genre?: string;
    mood?: string;
    lyrics?: string;
    transcription?: string;
    bpm?: number;
    key?: string;
    audioUrl?: string;
    coverUrl?: string;
    videoUrl?: string;
    metadata?: Record<string, any>;
}
export declare const weaviate: {
    /**
     * Initialize Weaviate client
     */
    getClient: () => {
        url: string;
        headers: {
            Authorization?: string | undefined;
            'Content-Type': string;
        };
    };
    /**
     * Index a media document
     */
    indexDocument: (doc: MediaDocument) => Promise<void>;
    /**
     * Batch index documents
     */
    batchIndex: (docs: MediaDocument[]) => Promise<void>;
    /**
     * Search documents
     */
    search: (query: string, limit?: number) => Promise<MediaDocument[]>;
    /**
     * Get document by ID
     */
    getById: (id: string) => Promise<MediaDocument | null>;
    /**
     * Delete document
     */
    deleteById: (id: string) => Promise<void>;
};
export default weaviate;
//# sourceMappingURL=weaviate.d.ts.map