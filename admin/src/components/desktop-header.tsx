import { useState, useRef, useEffect } from "react";
import { BiBell } from "react-icons/bi";
import NotificationSidebar from "./sidebar/notification-sidebar";
import UserAvatar from "./user-avatar";

const DesktopHeader = () => {
  const [userOpen, setUserOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userRef.current &&
        !userRef.current.contains(e.target as Node) &&
        notiRef.current &&
        !notiRef.current.contains(e.target as Node)
      ) {
        setUserOpen(false);
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full border-b border-b-[#ddd]">
      <div className="py-2 px-4">
        <div className="flex items-center gap-4 justify-between">
          <div className=""></div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={notiRef}>
              <button
                onClick={() => {
                  setNotiOpen(!notiOpen);
                  setUserOpen(false);
                }}
                className="rounded-full p-1 border border-[#E8E8E8] hover:bg-gray-100 transition"
              >
                <BiBell size={24} />
              </button>

              {notiOpen && (
                <NotificationSidebar onClose={() => setNotiOpen(false)} />
              )}
            </div>

            <UserAvatar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
