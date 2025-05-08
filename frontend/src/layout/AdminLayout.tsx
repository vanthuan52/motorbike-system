"use client";
import React, { useEffect, useState } from "react";
import { Layout, theme } from "antd";
import { SidebarAdmin } from "@/components/Sidebar/Sidebar";
import AdminHeader from "@/shared/components/Header/AdminHeader";

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Layout>
      <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <AdminHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          colorBgContainer={colorBgContainer}
        />
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="!mt-18 sm:!my-4 mx-2 sm:mx-4 !p-2 sm:!p-4 min-h-[calc(100vh-64px)]"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
