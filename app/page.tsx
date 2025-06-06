import { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { DateForm } from "@/components/ui/date-form";
import linkPreviewMetadata from "@/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = linkPreviewMetadata({
  description:
    "This is a date picker built with shadcn/ui and IOS-carousel style.",
  keywords: "ios, date picker, shadcn, shadcn-ui",
  title: "IOS Date Picker shadcn/ui",
  url: "/",
});

type TInfo = {
  Icon: IconType;
  title: string;
  link: string;
};

export default function Home() {
  const info: TInfo[] = [
    {
      Icon: Calendar,
      title: "IOS Date Picker",
      link: process.env.NEXT_PUBLIC_URL ?? "",
    },
    {
      Icon: FaGithub,
      title: "Github",
      link: "https://github.com/sahandsn/ios-date-picker-shadcn-ui",
    },
    {
      Icon: FaLinkedin,
      title: "LinkedIn",
      link: "https://www.linkedin.com/in/sahand-sanaei/",
    },
  ];

  return (
    <main className="container m-auto min-h-svh p-2 flex flex-col justify-around">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        IOS Date Picker shadcn/ui
      </h1>

      <DateForm />

      <footer className="text-xs text-muted-foreground flex flex-col">
        {info.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            target="_blank"
            className="flex items-center gap-2 p-2"
          >
            <item.Icon size={15} />
            <p>{item.title}</p>
          </Link>
        ))}
      </footer>
    </main>
  );
}
