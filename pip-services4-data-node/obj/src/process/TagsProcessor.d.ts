/** @module data */
/**
 * Helper class to extract and process search tags from objects.
 * The search tags can be kept individually or embedded as hash tags inside text
 * like "This text has #hash_tag that can be used for search."
 */
export declare class TagsProcessor {
    private static NORMALIZE_REGEX;
    private static COMPRESS_REGEX;
    private static SPLIT_REGEX;
    private static HASHTAG_REGEX;
    /**
     * Normalizes a tag by replacing special symbols like '_' and '#' with spaces.
     * When tags are normalized then can be presented to user in similar shape and form.
     *
     * @param tag   the tag to normalize.
     * @return      a normalized tag.
     */
    static normalizeTag(tag: string): string;
    /**
     * Compress a tag by removing special symbols like spaces, '_' and '#'
     * and converting the tag to lower case.
     * When tags are compressed they can be matched in search queries.
     *
     * @param tag   the tag to compress.
     * @return      a compressed tag.
     */
    static compressTag(tag: string): string;
    /**
     * Compares two tags using their compressed form.
     *
     * @param tag1  the first tag.
     * @param tag2  the second tag.
     * @return      true if the tags are equal and false otherwise.
     */
    static equalTags(tag1: string, tag2: string): boolean;
    /**
     * Normalizes a list of tags.
     *
     * @param tags  the tags to normalize.
     * @return      a list with normalized tags.
     */
    static normalizeTags(tags: string[]): string[];
    /**
     * Normalizes a comma-separated list of tags.
     *
     * @param tagList  a comma-separated list of tags to normalize.
     * @return      a list with normalized tags.
     */
    static normalizeTagList(tagList: string): string[];
    /**
     * Compresses a list of tags.
     *
     * @param tags  the tags to compress.
     * @return      a list with normalized tags.
     */
    static compressTags(tags: string[]): string[];
    /**
     * Compresses a comma-separated list of tags.
     *
     * @param tagList  a comma-separated list of tags to compress.
     * @return      a list with compressed tags.
     */
    static compressTagList(tagList: string): string[];
    /**
     * Extracts hash tags from a text.
     *
     * @param text    a text that contains hash tags
     * @return        a list with extracted and compressed tags.
     */
    static extractHashTags(text: string): string[];
    private static extractString;
    /**
     * Extracts hash tags from selected fields in an object.
     *
     * @param obj           an object which contains hash tags.
     * @param searchFields  a list of fields in the objects where to extract tags
     * @return              a list of extracted and compressed tags.
     */
    static extractHashTagsFromValue(obj: any, ...searchFields: string[]): string[];
}
