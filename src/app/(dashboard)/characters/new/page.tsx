'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { supabase } from '@/lib/supabase/client';

export default function NewCharacterPage() {
  const router = useRouter();
  const createCharacter = trpc.character.create.useMutation({
    onSuccess: (data) => {
      router.push(`/chat/${data.id}`);
    },
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);

    try {
      let avatarUrl = '';

      // Upload avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('characters')
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw new Error('Error uploading avatar: ' + uploadError.message);
        }

        // Get public URL
        const { data } = supabase.storage.from('characters').getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }

      // Create character with or without avatar
      await createCharacter.mutateAsync({
        name,
        description,
        personality,
        avatar: avatarUrl || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Error creating character');
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Create New Character</h1>
      <p className="mt-2 text-gray-600">
        Design your AI companion&apos;s personality and appearance
      </p>

      {error && (
        <div className="p-3 mt-4 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lily, Captain Jack, Professor X"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Short Bio
          </label>
          <textarea
            id="description"
            required
            rows={3}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your character's background"
          />
        </div>

        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-gray-700">
            Personality Traits
          </label>
          <input
            id="personality"
            type="text"
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="e.g. flirty, caring, sassy, intelligent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Add personality traits that will define how your character responds
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Avatar</label>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="object-cover w-24 h-24 rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 text-gray-400 bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="avatar-upload"
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md cursor-pointer hover:bg-purple-700"
              >
                Upload Image
                <input
                  id="avatar-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Optional. JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={createCharacter.isLoading || isUploading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 border border-transparent rounded-md shadow-sm hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {createCharacter.isLoading || isUploading
              ? 'Creating Character...'
              : 'Create Character'}
          </button>
        </div>
      </form>
    </div>
  );
}
