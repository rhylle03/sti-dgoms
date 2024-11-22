import { supabase } from "./client";

export const fetchCases = async () => {
  try {
    const { data, error } = await supabase.from("sti_dgoms_case").select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching cases:", err);
    return [];
  }
};

export const fetchGoodMoral = async () => {
  try {
    const { data, error } = await supabase
      .from("good_moral_requests")
      .select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching cases:", err);
    return [];
  }
};

export const fetchConsultation = async () => {
  try {
    const { data, error } = await supabase.from("appointments").select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching cases:", err);
    return [];
  }
};

export const fetchStudentTeacherConference = async () => {
  try {
    const { data, error } = await supabase.from("sti_dgoms_case").select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching cases:", err);
    return [];
  }
};

export const fetchCounselling = async () => {
  try {
    const { data, error } = await supabase.from("sti_dgoms_case").select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching cases:", err);
    return [];
  }
};
