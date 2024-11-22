export type OffenseCategory = {
  [key: string]: { id: number; name: string }[];
};

export const minorOffenses: OffenseCategory = {
  "Student Decorum": [
    { id: 1, name: "Non-adherence to the 'STI Student Decorum'" },
    {
      id: 2,
      name: "Discourtesy towards any member of the STI community including campus visitors",
    },
    {
      id: 3,
      name: "Exhibiting displays of affection that negatively affect the reputation of the individuals",
    },
  ],
  "Dress Code": [
    {
      id: 4,
      name: "Non-wearing of school uniform, improper use of school uniform or ID inside school premises",
    },
    { id: 5, name: "Wearing inappropriate campus attire" },
    { id: 6, name: "Losing or forgetting one's ID three (3) times" },
  ],
  "School Property and Rules": [
    {
      id: 7,
      name: "Disrespect to national symbols or any other similar infraction",
    },
    { id: 8, name: "Irresponsible or improper use of school property" },
    {
      id: 9,
      name: "Gambling in any form within the school premises or during official functions",
    },
    {
      id: 10,
      name: "Staying or eating inside the classroom without permission from the school administrator or management",
    },
    {
      id: 11,
      name: "Violation of classroom, laboratory, library, and other school offices procedure",
    },
  ],
  "Classroom Conduct": [
    {
      id: 12,
      name: "Disruption of classes, school-sanctioned activities, and peace and order",
    },
  ],
  "Prohibited Items": [
    { id: 13, name: "Possession of cigarettes or vapes" },
    { id: 14, name: "Bringing of pets in the school premises" },
  ],
};

export const majorOffenses: {
  [key: string]: OffenseCategory;
} = {
  "Category A": {
    "Academic Dishonesty": [
      { id: 1, name: "Cheating in any form during examinations or tests" },
      { id: 2, name: "Plagiarism in academic works" },
      {
        id: 3,
        name: "Falsification of academic records, documents, or credentials",
      },
    ],
    Misconduct: [
      {
        id: 4,
        name: "Gross acts of disrespect, in words or in deed, that tend to put any member of the faculty, administration, staff, or fellow student in ridicule or contempt",
      },
      {
        id: 5,
        name: "Verbal or physical assault, bullying, or any form of harassment",
      },
    ],
  },
  "Category B": {
    "Property Damage": [
      {
        id: 6,
        name: "Vandalism, damaging, or destroying property belonging to the school or any member of the STI community",
      },
    ],
    "Digital Misconduct": [
      {
        id: 7,
        name: "Posting or uploading of statements, photos, videos, or other graphical images disrespectful to the STI Brand, another student, faculty member, or any other individual",
      },
      {
        id: 8,
        name: "Recording and uploading of photos, videos, or other graphical images that violate the data privacy of another student, faculty member, or any other individual",
      },
    ],
    "Reputational Harm": [
      {
        id: 9,
        name: "Going to places of ill repute while wearing the school uniform",
      },
    ],
    Dishonesty: [
      {
        id: 10,
        name: "Issuing a false testimony during official investigations",
      },
      {
        id: 11,
        name: "Use of profane language that expresses grave insult toward any member of the STI community",
      },
    ],
  },
  "Category C": {
    "Substance Abuse": [
      {
        id: 12,
        name: "Drinking alcoholic beverages within the school premises or attending classes under the influence of alcohol",
      },
      {
        id: 13,
        name: "Smoking or vaping within the school premises or during official school functions",
      },
    ],
    Theft: [
      {
        id: 14,
        name: "Stealing or attempting to steal property or belongings of another",
      },
    ],
    "Unauthorized Access": [
      {
        id: 15,
        name: "Unauthorized access to or use of school records, property, or facilities",
      },
    ],
  },
  "Category D": {
    "Substance Abuse": [
      {
        id: 16,
        name: "Possession or sale of prohibited drugs or chemicals in any form, or any illegal drug paraphernalia within and outside the school premises whether in uniform or not",
      },
      {
        id: 17,
        name: "Continued use and is found to be 'confirmed positive' of using prohibited drugs or chemicals for the second time, even after undergoing an intervention",
      },
    ],
    "Weapons and Violence": [
      {
        id: 18,
        name: "Carrying or possession of firearms, deadly weapons, and explosives within and outside the school premises whether in uniform or not",
      },
    ],
    "Illegal Organizations": [
      {
        id: 19,
        name: "Membership or affiliations in organizations, such as but not limited to fraternities and sororities, that employ or advocate illegal rites or ceremonies which include hazing and initiation",
      },
      {
        id: 20,
        name: "Participation in illegal rites, ceremonies, and ordeals, which includes hazing and initiation",
      },
    ],
    "Serious Misconduct": [
      {
        id: 21,
        name: "Commission of crime involving moral turpitude (such as but not limited to rape, forgery, estafa, acts of lasciviousness, moral depravity, murder, and homicide)",
      },
      {
        id: 22,
        name: "Commission of acts constituting sexual harassment as defined in the Student Manual and Republic Act 7877, otherwise known as the 'Anti-Sexual Harassment Act of 1995'",
      },
    ],
    Subversion: [
      { id: 23, name: "Acts of subversion, sedition, or insurgency" },
    ],
  },
};

export const minorOffenseSanctions = [
  { offense: 1, sanction: "Verbal Warning" },
  { offense: 2, sanction: "Written Reprimand" },
  {
    offense: 3,
    sanction: "Written Reprimand & Corrective Reinforcement (3-7 school days)",
  },
];

export const majorOffenseSanctions = {
  "Category A": "Suspension (1-5 days)",
  "Category B": "Suspension (6-10 days)",
  "Category C": "Suspension (11-15 days)",
  "Category D": "Exclusion/Expulsion",
};
