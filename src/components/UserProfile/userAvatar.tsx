import { useState } from 'react';

interface UserData {
  name: string;
  photoUrl: string | null;
}

interface UserWrapper {
  user: {
    user: UserData;
  };
}

interface UserAvatarProps {
  user: UserWrapper | null;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Função para obter as iniciais do nome do usuário
  const getInitials = () => {
    if (!user?.user?.user?.name) return '?';
    
    return user.user.user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };


  return (
    <div className="w-20 h-20 overflow-hidden rounded-full border-4 border-green-500 dark:border-green-600 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
      {user?.user?.user?.photoUrl && !imageError ? (
        <img
          src={user.user.user.photoUrl}
          alt="Avatar do Usuário"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
          {getInitials()}
        </span>
      )}
    </div>
  );
};


export default UserAvatar;
