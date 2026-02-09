import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Uploads an image from a local URI to Supabase Storage
 * @param bucket Name of the bucket (e.g., 'tirelo-assets')
 * @param path Path within the bucket (e.g., 'profiles/avatar.jpg')
 * @param uri Local file URI from image picker
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (bucket: string, path: string, uri: string) => {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, decode(base64), {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
