'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProfileType, updateProfile } from '../_actions/profile';
import { BiCamera, BiUser } from 'react-icons/bi';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from '@/components/ui/select';
import StickerDisplayComponent from './StickerDisplay';
import { useRouter } from 'next/navigation';

type ProfileFormProps = {
  profile: ProfileType;
  isEditable: boolean;
};

export default function ProfileForm({ profile, isEditable }: ProfileFormProps) {
  // const router = useRouter();
  const [username, setUsername] = useState(profile.username || '');
  const [email, setEmail] = useState(profile.email || '');
  const [birthday, setBirthday] = useState(profile.birthday || '');
  const [gender, setGender] = useState(profile.gender || 'Let me see');
  const [location, setLocation] = useState(profile.location || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const point = profile.current_points || 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', profile.id);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('birthday', birthday);
    formData.append('gender', gender);
    formData.append('location', location);

    if (newAvatarFile) {
      formData.append('avatar', newAvatarFile);
    }

    try {
      const result = await updateProfile(formData);
      if (result.avatar_url) {
        setAvatarUrl(result.avatar_url);
      }

      alert('Profile updated successfully');
      window.location.reload();
      //router.push('/post');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setNewAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  return (
    <form onSubmit={isEditable ? handleSubmit : undefined} className="w-full max-w-md space-y-4">
      <div className="flex flex-col ">
        <div className="grid grid-cols-2 ">
          <div className="col-span-1  ">
            <div
              className="relative w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              onClick={handleImageClick}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <BiUser size={120} color="gray" />
              )}
              {isEditable && (
                <div className="absolute bottom-0 -right-0 z-10 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <BiCamera size={32} color="white" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="col-span-1 px-2 py-2 flex flex-col justify-between border-x border-gray-200">
            <div>
              <h2 className="text-sm text-gray-400 leading-none mb-1">Point</h2>
              <p className="font-semibold leading-none">{point}</p>
            </div>
            <div>
              <h2 className="text-sm text-gray-400 leading-none mb-1">Trophy</h2>
              <p className="font-semibold leading-none">어린이 사랑 등</p>
              <p className="font-semibold leading-none">12,773</p>
            </div>
            <div>
              <h2 className="text-sm text-gray-400 leading-none mb-1">Support</h2>
              <p className="font-semibold leading-none">매불쇼 외 72</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col space-y-4">
          <div className="username">
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={!isEditable}
              className="text-gray-800"
            />
          </div>
          <div className="birthday">
            <label className="block text-sm font-medium text-gray-600">Birthday</label>
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              disabled={!isEditable}
              className="text-gray-800"
            />
          </div>
          <div className="gender">
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <Select
              value={gender}
              onValueChange={(value: 'male' | 'female' | 'Let me see') => setGender(value)}
              disabled={!isEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="text-gray-800">
                  Male
                </SelectItem>
                <SelectItem value="female" className="text-gray-800">
                  Female
                </SelectItem>
                <SelectItem value="Let me see" className="text-gray-800">
                  Let me see
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="location">
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={!isEditable}
              className="text-gray-800"
            />
          </div>
          <div className="hidden">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isEditable}
            />
          </div>
          {isEditable && (
            <Button className="mt-4" type="submit">
              Update Profile
            </Button>
          )}
          <StickerDisplayComponent />
        </div>
      </div>
    </form>
  );
}
