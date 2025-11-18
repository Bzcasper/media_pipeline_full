export type Body_upload_file_api_v1_media_storage_post = {
    /**
     * File to upload
     */
    file?: (Blob | null);
    /**
     * URL of the file to upload (optional)
     */
    url?: (string | null);
    /**
     * Type of media being uploaded
     */
    media_type: Body_upload_file_api_v1_media_storage_post.media_type;
};
export declare namespace Body_upload_file_api_v1_media_storage_post {
    /**
     * Type of media being uploaded
     */
    enum media_type {
        IMAGE = "image",
        VIDEO = "video",
        AUDIO = "audio",
        FONT = "font",
        TMP = "tmp"
    }
}
