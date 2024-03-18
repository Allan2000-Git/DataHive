import type { Metadata } from "next";
import SideNav from "../_components/SideNav";

export const metadata: Metadata = {
    title: "DataHive Dashboard | Centralized File Storage Management",
    description: "Manage and organize your files efficiently with the DataHive Dashboard. Access, organize, and secure your data all in one place.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex gap-7">
                <SideNav />
                {children}
            </div>
        </div>
    );
}