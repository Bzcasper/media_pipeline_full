"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body_upload_file_api_v1_media_storage_post = void 0;
var Body_upload_file_api_v1_media_storage_post;
(function (Body_upload_file_api_v1_media_storage_post) {
    /**
     * Type of media being uploaded
     */
    var media_type;
    (function (media_type) {
        media_type["IMAGE"] = "image";
        media_type["VIDEO"] = "video";
        media_type["AUDIO"] = "audio";
        media_type["FONT"] = "font";
        media_type["TMP"] = "tmp";
    })(media_type = Body_upload_file_api_v1_media_storage_post.media_type || (Body_upload_file_api_v1_media_storage_post.media_type = {}));
})(Body_upload_file_api_v1_media_storage_post || (exports.Body_upload_file_api_v1_media_storage_post = Body_upload_file_api_v1_media_storage_post = {}));
