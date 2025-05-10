import { ReactNode } from "react";

export type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  locale?: string;
};

export type SidebarMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  children?: SidebarMenuItem[];
};

export type TableKeyValue = {
  label: string;
  value: string;
};
