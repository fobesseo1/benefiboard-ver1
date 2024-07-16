//app>profile>_components>ProfileForm.tsx

'use client';

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ProfileType,
  updateProfile,
  fetchPartnerUsers,
  checkUsernameAvailability,
} from '../_actions/profile';
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

type PartnerUser = {
  id: string;
  partner_name: string;
  category: string;
};

export default function ProfileForm({ profile, isEditable }: ProfileFormProps) {
  const [username, setUsername] = useState(profile.username || '');
  const [email, setEmail] = useState(profile.email || '');
  const [birthday, setBirthday] = useState(profile.birthday || '');
  const [gender, setGender] = useState(profile.gender || 'Let me see');
  const [location, setLocation] = useState(profile.location || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [supportTarget, setSupportTarget] = useState(profile.donation_id || '');
  const [partnerUsers, setPartnerUsers] = useState<PartnerUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentSupportTarget, setCurrentSupportTarget] = useState<PartnerUser | null>(null);
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  const point = profile.current_points || 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPartnerUsers = async () => {
      const users = await fetchPartnerUsers();
      setPartnerUsers(users);
      const currentTarget = users.find((user) => user.id === profile.donation_id);
      setCurrentSupportTarget(currentTarget || null);
      if (currentTarget) {
        setSelectedCategory(currentTarget.category);
      } else if (profile.donation_id === profile.id) {
        setSelectedCategory('나에게');
      }
    };
    loadPartnerUsers();
  }, [profile.donation_id, profile.id]);

  const handleUsernameCheck = async () => {
    if (username === profile.username) {
      setIsUsernameDuplicate(false);
      setIsUsernameChecked(true);
      return;
    }

    const isAvailable = await checkUsernameAvailability(username);
    setIsUsernameDuplicate(!isAvailable);
    setIsUsernameChecked(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isUsernameChecked || isUsernameDuplicate) {
      alert('Please check username availability before updating profile.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', profile.id);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('birthday', birthday);
    formData.append('gender', gender);
    formData.append('location', location);
    formData.append('donation_id', selectedCategory === '나에게' ? profile.id : supportTarget);

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

  const filteredPartnerUsers = selectedCategory
    ? partnerUsers.filter((user) => user.category === selectedCategory)
    : partnerUsers;

  const isSelfSupport = supportTarget === profile.id || selectedCategory === '나에게';

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
              <h2 className="text-sm text-gray-400 leading-none mb-1">현재 서포트 대상</h2>
              <p className="font-semibold leading-none truncate ">
                {isSelfSupport
                  ? '누구: 나에게'
                  : currentSupportTarget
                    ? ` 누구: ${currentSupportTarget.partner_name}`
                    : 'No support target selected'}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col space-y-4">
          <div className="username flex items-center space-x-2">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-600">닉네임</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsUsernameChecked(false);
                }}
                required
                disabled={!isEditable}
                className="text-gray-800"
              />
            </div>
            {isEditable && (
              <Button type="button" onClick={handleUsernameCheck} className="mt-5">
                중복확인
              </Button>
            )}
          </div>
          {isUsernameChecked && (
            <p className={isUsernameDuplicate ? 'text-red-500' : 'text-green-500'}>
              {isUsernameDuplicate ? 'Username is already taken' : 'Username is available'}
            </p>
          )}
          <div className="birthday">
            <label className="block text-sm font-medium text-gray-600">생일</label>
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              disabled={!isEditable}
              className="text-gray-800"
            />
          </div>
          <div className="gender">
            <label className="block text-sm font-medium text-gray-600">성별</label>
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
            <label className="block text-sm font-medium text-gray-600">사는곳</label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={!isEditable}
              className="text-gray-800"
            />
          </div>
          <div className="support-target">
            <label className="block text-sm font-medium text-gray-600">서포트 대상 카테고리</label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setSupportTarget(value === '나에게' ? profile.id : '');
              }}
              disabled={!isEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="나에게">나에게</SelectItem>
                <SelectItem value="children">어린이</SelectItem>
                <SelectItem value="environment">환경보호</SelectItem>
                <SelectItem value="politics">정치</SelectItem>
                <SelectItem value="youtuber">유튜버</SelectItem>
                <SelectItem value="influencer">인플루언서</SelectItem>
                <SelectItem value="celebrity">연예인</SelectItem>
                <SelectItem value="culture">문화</SelectItem>
                <SelectItem value="art">예술</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedCategory && selectedCategory !== '나에게' && (
            <div className="partner-select">
              <label className="block text-sm font-medium text-gray-600">Select Partner</label>
              <Select value={supportTarget} onValueChange={setSupportTarget} disabled={!isEditable}>
                <SelectTrigger>
                  <SelectValue placeholder="서포트 대상 선택" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPartnerUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.partner_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
          <p className="text-red-400 text-xs">
            ＊닉네임 중복확인 후에 프로필 업데이트를 할 수 있습니다.＊
          </p>
          {isEditable && (
            <Button
              className="mt-4"
              type="submit"
              disabled={!isUsernameChecked || isUsernameDuplicate === true}
            >
              프로필 업데이트
            </Button>
          )}
          <StickerDisplayComponent />
        </div>
      </div>
    </form>
  );
}
