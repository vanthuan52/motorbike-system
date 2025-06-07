import {
    HomeOutlined,
    CalendarOutlined,
    CarOutlined,
    HistoryOutlined,
    UserOutlined,
    SettingOutlined,
    CustomerServiceOutlined,
    LogoutOutlined,
    DownOutlined,
    UpOutlined,
    LockOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import Image from "next/image";
import { UserType } from "@/types/User";
import { ROUTER_PATH } from "@/constant/router-path";

const customerSidebarItems = [
    { label: "Trang chủ", icon: HomeOutlined, href: ROUTER_PATH.HOME },
    { label: "Hồ sơ cá nhân", icon: UserOutlined, href: ROUTER_PATH.PROFILE },
    { label: "Lịch hẹn bảo dưỡng", icon: CalendarOutlined, href: ROUTER_PATH.SERVICE_APPOINTMENT },
    { label: "Xe của tôi", icon: CarOutlined, href: ROUTER_PATH.VEHICLE_MANAGEMENT },
    { label: "Lịch sử bảo dưỡng", icon: HistoryOutlined, href: ROUTER_PATH.SERVICE_HISTORY },
    { label: "Lịch sử mua hàng", icon: HistoryOutlined, href: ROUTER_PATH.ORDER_HISTORY },
    {
        label: "Cài đặt & Chinh sách bảo mật",
        icon: SettingOutlined,
        children: [
            { label: "Tài khoản", href: ROUTER_PATH.ACCOUNT, icon: IdcardOutlined },
            { label: "Chinh sách bảo mật", href: ROUTER_PATH.POLICY, icon: LockOutlined },
        ],
    },
    { label: "Hỗ trợ", icon: CustomerServiceOutlined, href: ROUTER_PATH.SUPPORT },
    { label: "Đăng xuất", icon: LogoutOutlined, href: ROUTER_PATH.LOGOUT },
];

export default function SidebarContent({
    pathname,
    user,
    openDropdown,
    toggleDropdown,
}: {
    pathname: string;
    user: UserType;
    openDropdown: string | null;
    toggleDropdown: (label: string) => void;
}) {
    return (
        <>
            <div className="flex items-center gap-4 mb-8 px-1">
                <div className="w-16 h-16 rounded-full border-2 border-violet-600 overflow-hidden">
                    <Image
                        src={user.photo || "/images/avatar/default-avatar.jpeg"}
                        priority
                        width={100}
                        height={100}
                        alt="Avatar"
                        className="object-cover"
                    />
                </div>
                <div className="text-gray-900 font-semibold text-lg">
                    {`${user.first_name} ${user.last_name}`}
                </div>
            </div>
            {/* Navigation */}
            <nav className="flex flex-col space-y-2">
                {customerSidebarItems.map(({ label, icon: Icon, href, children }) => {
                    const isActive =
                        (href && pathname === href) ||
                        (href && pathname.startsWith(href + "/")) ||
                        (children && children.some((child) => pathname.startsWith(child.href)));

                    if (children) {
                        const isOpen = openDropdown === label || children.some((child) => pathname.startsWith(child.href));
                        return (
                            <div
                                key={label}
                                className={clsx(
                                    "rounded-md transition-shadow",
                                    isOpen
                                )}
                            >
                                <div
                                    onClick={() => toggleDropdown(label)}
                                    className={clsx(
                                        "flex items-center justify-between gap-4 px-4 py-3 rounded-md text-base font-medium transition-colors relative cursor-pointer",
                                        isActive
                                            ? "bg-violet-50 text-violet-700 font-semibold"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                        "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-tr-md before:rounded-br-md",
                                        isActive ? "before:bg-violet-600" : "before:bg-transparent"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            style={{ fontSize: 20 }}
                                            className={clsx(isActive ? "text-violet-600" : "text-gray-500")}
                                        />
                                        <span>{label}</span>
                                    </div>
                                    {isOpen ? <UpOutlined className="text-xs" /> : <DownOutlined className="text-xs" />}
                                </div>
                                {isOpen && (
                                    <div className="ml-8 mt-2 flex flex-col space-y-1">
                                        {children.map((child) => {
                                            const isChildActive =
                                                pathname === child.href || pathname.startsWith(child.href + "/");
                                            const ChildIcon = child.icon;
                                            return (
                                                <CustomLink
                                                    key={child.label}
                                                    href={child.href}
                                                    className={clsx(
                                                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors",
                                                        isChildActive
                                                            ? "bg-violet-100 text-violet-700"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    )}
                                                >
                                                    {ChildIcon && (
                                                        <ChildIcon
                                                            className={clsx("text-base", isChildActive ? "text-violet-600" : "text-gray-500")}
                                                        />
                                                    )}
                                                    <span>{child.label}</span>
                                                </CustomLink>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <CustomLink
                            key={label}
                            href={href!}
                            className={clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-md text-base font-medium transition-colors relative",
                                isActive
                                    ? "bg-violet-50 text-violet-700 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-tr-md before:rounded-br-md",
                                isActive ? "before:bg-violet-600" : "before:bg-transparent"
                            )}
                        >
                            <Icon
                                style={{ fontSize: 20 }}
                                className={clsx(isActive ? "text-violet-600" : "text-gray-500")}
                            />
                            <span>{label}</span>
                        </CustomLink>
                    );
                })}
            </nav>
        </>
    );
}