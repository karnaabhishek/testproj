import Image from "next/image";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

// NAV ITEMS
export const navItems = [
  {
    id: 1,
    name: "Dashboard",
    title: "dashboard",
    icon: <DashboardRoundedIcon sx={{ color: "#fff" }} />,
    slug: "/manage/dashboard",
    isDisabled: false,
  },
  {
    id: 2,
    name: "Appointment",
    title: "appointment",
    icon: (
      <Image
        src={"/assets/icons/appointment.svg"}
        alt="app"
        height={24}
        width={24}
      />
    ),
    slug: "/manage/driving-test-appointment-confirmation",
    isDisabled: false,
  },
  // {
  //   id: 3,
  //   name: "Messages",
  //   title: "messages",
  //   icon: (
  //     <Image
  //       src={"/assets/icons/message.svg"}
  //       alt="message"
  //       height={24}
  //       width={24}
  //     />
  //   ),
  //   slug: "/manage/messages",
  //   isDisabled: false,
  // },
  // Chats are not yet implemented
  {
    id: 4,
    name: "Certificates",
    title: "certificates",
    icon: (
      <Image
        src={"/assets/icons/certificate.svg"}
        alt="certificate"
        height={24}
        width={24}
      />
    ),
    slug: "/manage/certificate",
    isDisabled: false,
  },
  {
    id: 5,
    name: "Accounting",
    title: "accounting",
    icon: (
      <Image
        src={"/assets/icons/accounting.svg"}
        alt="accounting"
        height={24}
        width={24}
      />
    ),
    slug: "/manage/accounting",
    isDisabled: false,
  },
  {
    id: 6,
    name: "Instructor",
    title: "instructor",
    icon: (
      <Image
        src={"/assets/icons/instructor.svg"}
        alt="instructor"
        height={24}
        width={24}
      />
    ),
    slug: "/manage/instructor",
    isDisabled: false,
  },
  {
    id: 7,
    name: "Students",
    title: "student management",
    icon: (
      <Image src={"/assets/icons/user.svg"} alt="user" height={24} width={24} />
    ),
    slug: "/manage/student-management",
    isDisabled: false,
  },
  {
    id: 8,
    name: "User Management",
    title: "user management",
    icon: (
      <Image
        src={"/assets/icons/user.svg"}
        alt="user-management"
        height={24}
        width={24}
      />
    ),
    slug: "/manage/user-management",
    isDisabled: false,
  },
];
