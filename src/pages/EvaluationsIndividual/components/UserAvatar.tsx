import { User } from "lucide-react";

interface UserAvatarProps {
  user: {
    name: string;
    photoUrl: string | null;
  };
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ user, size = "md" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg"
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {user.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={`${user.name}'s avatar`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-indigo-600`}
        />
      ) : (
        <div 
          className={`${sizeClasses[size]} bg-indigo-600/20 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-400 font-medium`}
        >
          {getInitials(user.name) || <User size={size === "lg" ? 24 : 16} />}
        </div>
      )}
    </>
  );
};

export default UserAvatar;
