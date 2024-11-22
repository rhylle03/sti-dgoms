import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const UserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData?.user) {
          console.error(
            "Error fetching user:",
            userError?.message || "No user data"
          );
          setUserRole("Unknown");
          setLoading(false);
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from("usersdgoms")
          .select("role")
          .eq("id", userData.user.id)
          .single();

        if (roleError) {
          console.error("Error fetching user role:", roleError.message);
          setUserRole("Unknown");
        } else {
          setUserRole(roleData?.role || "Unknown");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        setUserRole("Unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole === "Student") {
      router.push("/student-portal");
    } else if (userRole === "Teacher") {
      router.push("/teacher-portal");
    } else if (userRole === "Admin") {
      router.push("/dashboard");
    }
  }, [userRole, router]);

  if (loading) return <div>Loading...</div>;

  return <h1>Your Role: {userRole}</h1>;
};

export default UserProfile;
