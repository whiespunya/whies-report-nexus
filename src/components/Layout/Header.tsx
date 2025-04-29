
import { useAppContext } from "@/contexts/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/routes";

const Header = () => {
  const { currentUser, logout } = useAppContext();

  if (!currentUser) return null;

  const initials = currentUser.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex justify-end items-center bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden md:inline-block">
          {currentUser.fullName}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-whies-500 focus:ring-offset-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${currentUser.fullName}&background=3B82F6&color=fff`} />
                <AvatarFallback className="bg-whies-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={currentUser.role === "admin" ? ROUTES.USERS : ROUTES.TECHNICIAN_PROFILE} className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
