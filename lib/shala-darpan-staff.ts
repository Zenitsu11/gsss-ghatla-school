export type ShalaDarpanStaff = {
  full_name: string;
  employee_id: string;
  designation: string;
  subject: string | null;
  joining_date: string;
};

export const SCHOOL_NIC_SD_ID = "215691";
export const SCHOOL_UDISE_CODE = "08060806901";

// Imported from the school's Shala Darpan staff export.
// Keep personal/contact identifiers out of public UI; employee_id is for admin-side mapping only.
export const shalaDarpanStaff: ShalaDarpanStaff[] = [
  { full_name: "ANJU YADAV", employee_id: "RJAL199802007150", designation: "Teacher (III Gr.) Level 1", subject: null, joining_date: "11 June 2016" },
  { full_name: "ARJUN KAUSHIK", employee_id: "RJAL202102016782", designation: "Lab Assistant (III Gr.)", subject: null, joining_date: "3 November 2021" },
  { full_name: "ARVIND LAKHARA", employee_id: "RJAL202302040251", designation: "PET (III Gr.)", subject: null, joining_date: "15 September 2023" },
  { full_name: "DHANI RAM VERMA", employee_id: "RJAL199002011127", designation: "Senior Teacher (II Gr.)", subject: "English", joining_date: "29 August 2022" },
  { full_name: "GHANSHYAM DASS GUPTA", employee_id: "RJAL199702017964", designation: "Lecturer (I Gr.)", subject: "Physics (Science Stream)", joining_date: "16 May 2026" },
  { full_name: "KAILASH CHAND BASWAL", employee_id: "RJAL199202007958", designation: "Principal & Equivalent", subject: null, joining_date: "1 October 2019" },
  { full_name: "KAVITA TAXAK", employee_id: "RJAL200802009697", designation: "Teacher (III Gr.) Level 2", subject: "Mathematics / Science", joining_date: "24 September 2018" },
  { full_name: "MAHESH PAL", employee_id: "RJBW202108014232", designation: "Lecturer (I Gr.)", subject: "Biology (Science Stream)", joining_date: "12 January 2026" },
  { full_name: "NEELAM JAIN", employee_id: "RJAL199602011679", designation: "Senior Teacher (II Gr.)", subject: "Hindi", joining_date: "1 July 2019" },
  { full_name: "NEELAM MALIK", employee_id: "RJAL199802014674", designation: "Teacher (III Gr.) Level 1", subject: null, joining_date: "14 June 2016" },
  { full_name: "PAPPU RAM GURJAR", employee_id: "RJJS202020030880", designation: "Senior Teacher (II Gr.)", subject: "Sanskrit", joining_date: "27 December 2022" },
  { full_name: "RAGHUVEER SINGH", employee_id: "RJAL202302058780", designation: "Teacher (III Gr.) Level 2", subject: "English", joining_date: "9 October 2023" },
  { full_name: "RAJNESH KUMARI", employee_id: "RJAL200502024483", designation: "Teacher (III Gr.) Level 2", subject: "Hindi", joining_date: "22 June 2016" },
  { full_name: "SUNIL KUMAR GUPTA", employee_id: "RJAL201202030755", designation: "Senior Teacher (II Gr.)", subject: "Mathematics", joining_date: "29 December 2014" },
  { full_name: "SURESH KUMAR", employee_id: "RJAL199602011680", designation: "Staff Member", subject: null, joining_date: "4 July 2024" },
  { full_name: "URMILA BAI MEENA", employee_id: "RJAL201202026951", designation: "Lecturer (I Gr.)", subject: "Chemistry (Science Stream)", joining_date: "17 April 2025" },
  { full_name: "VARSHA SHEKHAWAT", employee_id: "RJAL202402111353", designation: "Staff Member", subject: null, joining_date: "19 June 2024" },
  { full_name: "VERSHA LOMAR", employee_id: "RJGA202035027557", designation: "Junior Assistant", subject: null, joining_date: "9 January 2021" },
  { full_name: "VIMLA YADAV", employee_id: "RJAL199502007651", designation: "Teacher (III Gr.) Level 1", subject: null, joining_date: "22 June 2016" },
];
