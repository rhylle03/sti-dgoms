import SidebarStudent, {
  SidebarTeacher,
  SidebarDO,
  SidebarGA,
  SidebarSA,
  SidebarPH,
} from "@/libs/sidebarMap";
import { getUser } from "@/utils/supabase/server";

export default async function sidebarlayout() {
  const user = await getUser();

  if (user.role === "Student") {
    return <SidebarStudent></SidebarStudent>;
  }
  if (user.role === "Teacher") {
    return <SidebarTeacher></SidebarTeacher>;
  }
  if (user.role === "Discipline Officer") {
    return <SidebarDO></SidebarDO>;
  }
  if (user.role === "Guidance Associate") {
    return <SidebarGA></SidebarGA>;
  }
  if (user.role === "Program Head") {
    return <SidebarPH></SidebarPH>;
  }
  if (user.role === "Academic Head") {
    return <SidebarSA></SidebarSA>;
  }
  if (user.role === "School Administrator") {
    return <SidebarSA></SidebarSA>;
  }
}
