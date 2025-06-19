"use client";

import { useTranslation } from "@/i18n/use-translation";
import { useSession } from "@/store/session.atom";
import { useAppConfirm } from "../app-confirm";
import * as sessionActions from "@/backend/services/session.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const AuthenticatedUserMenu = () => {
  const { _t } = useTranslation();
  const authSession = useSession();
  const appConfirm = useAppConfirm();

  const handleLogout = async () => {
    appConfirm.show({
      title: _t("Sure to logout?"),
      children: <p>{_t("You will be logged out after this")}</p>,
      async onConfirm() {
        await sessionActions.deleteLoginSession();
        window.location.reload();
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={authSession?.user?.profile_photo ?? ""} />
          <AvatarFallback>{authSession?.user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            className="text-foreground cursor-pointer"
            href={`/@${authSession?.user?.username}`}
          >
            {_t("My profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="text-foreground cursor-pointer" href="/dashboard">
            {_t("Dashboard")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="text-foreground cursor-pointer"
            href="/dashboard/bookmarks"
          >
            {_t("Bookmarks")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="text-foreground cursor-pointer"
            href="/dashboard/settings"
          >
            {_t("Settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          {_t("Logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthenticatedUserMenu;
