
import { Subject, SyllabusItem } from './types.ts';

/**
 * SSC 2026 Short Syllabus Database
 */
export const SSC_SYLLABUS_2026: SyllabusItem[] = [
  // --- বাংলা ১ম পত্র ---
  { id: 'bn1-01', subject: Subject.BANGLA_1ST, chapterNumber: 1, chapterTitle: 'প্রত্যুপকার', topics: ['ঈশ্বরচন্দ্র বিদ্যাসাগর', 'উপকার ও কৃতজ্ঞতা'] },
  { id: 'bn1-02', subject: Subject.BANGLA_1ST, chapterNumber: 2, chapterTitle: 'সুভা', topics: ['রবীন্দ্রনাথ ঠাকুর', 'বাকপ্রতিবন্ধী কিশোরী'] },
  { id: 'bn1-03', subject: Subject.BANGLA_1ST, chapterNumber: 3, chapterTitle: 'বই পড়া', topics: ['প্রমথ চৌধুরী', 'লাইব্রেরির গুরুত্ব'] },
  { id: 'bn1-04', subject: Subject.BANGLA_1ST, chapterNumber: 4, chapterTitle: 'আম আঁটির ভেঁপু', topics: ['বিভূতিভূষণ বন্দ্যোপাধ্যায়', 'গ্রামীণ শৈশব'] },
  { id: 'bn1-05', subject: Subject.BANGLA_1ST, chapterNumber: 5, chapterTitle: 'মানুষ মুহাম্মদ (সা.)', topics: ['মোহাম্মদ ওয়াজেদ আলী', 'মহত্ত্ব ও মানবতা'] },
  { id: 'bn1-06', subject: Subject.BANGLA_1ST, chapterNumber: 6, chapterTitle: 'শিক্ষা ও মনুষ্যত্ব', topics: ['মোতাহের হোসেন চৌধুরী', 'জীবসত্তা ও মানবসত্তা'] },
  { id: 'bn1-07', subject: Subject.BANGLA_1ST, chapterNumber: 7, chapterTitle: 'নিমগাছ', topics: ['বনফুল', 'সংসার জীবনের প্রতীক'] },
  { id: 'bn1-08', subject: Subject.BANGLA_1ST, chapterNumber: 8, chapterTitle: 'কপোতাক্ষ নদ', topics: ['মাইকেল মধুসূদন দত্ত', 'স্বদেশপ্রেম'] },
  { id: 'bn1-09', subject: Subject.BANGLA_1ST, chapterNumber: 9, chapterTitle: 'জীবন বিনিময়', topics: ['গোলাম মোস্তফা', 'পিতা-পুত্রের সম্পর্ক'] },
  { id: 'bn1-10', subject: Subject.BANGLA_1ST, chapterNumber: 10, chapterTitle: 'ওমর ফারুক', topics: ['কাজী নজরুল ইসলাম', 'সাম্যবাদ ও বীরত্ব'] },
  { id: 'bn1-11', subject: Subject.BANGLA_1ST, chapterNumber: 11, chapterTitle: 'সেই দিন এই মাঠ', topics: ['জীবনানন্দ দাশ', 'প্রকৃতির অবিনশ্বরতা'] },
  { id: 'bn1-12', subject: Subject.BANGLA_1ST, chapterNumber: 12, chapterTitle: 'বৃষ্টি', topics: ['ফররুখ আহমদ', 'মানব কল্যাণ'] },
  { id: 'bn1-13', subject: Subject.BANGLA_1ST, chapterNumber: 13, chapterTitle: 'বৈশাখ', topics: ['সুফিয়া কামাল', 'বাংলার ঋতু'] },
  { id: 'bn1-14', subject: Subject.BANGLA_1ST, chapterNumber: 14, chapterTitle: 'উপন্যাস: ১৯৭১', topics: ['মুক্তিযুদ্ধভিত্তিক সাহিত্য'] },
  { id: 'bn1-15', subject: Subject.BANGLA_1ST, chapterNumber: 15, chapterTitle: 'প্রবাস বন্ধু', topics: ['সৈয়দ মুজতবা আলী', 'আফগান আতিথেয়তা'] },
  { id: 'bn1-16', subject: Subject.BANGLA_1ST, chapterNumber: 16, chapterTitle: 'একুশের গল্প', topics: ['জহির রায়হান', 'ভাষা আন্দোলন'] },
  { id: 'bn1-17', subject: Subject.BANGLA_1ST, chapterNumber: 17, chapterTitle: 'আমি কোন আগন্তুক নই', topics: ['আহসান হাবীব', 'অস্তিত্বের শিকড়'] },
  { id: 'bn1-18', subject: Subject.BANGLA_1ST, chapterNumber: 18, chapterTitle: 'তোমাকে পাওয়ার জন্য হে স্বাধীনতা', topics: ['শামসুর রাহমান', 'মুক্তিযুদ্ধের আকাঙ্ক্ষা'] },

  // --- English 2nd Paper ---
  { id: 'en2-g01', subject: Subject.ENGLISH_2ND, chapterNumber: 1, chapterTitle: 'Gap filling with clues', topics: ['Articles', 'Determiners', 'Prepositions'] },
  { id: 'en2-g02', subject: Subject.ENGLISH_2ND, chapterNumber: 2, chapterTitle: 'Substitution table', topics: ['Sentence structure', 'Grammar usage'] },
  { id: 'en2-g03', subject: Subject.ENGLISH_2ND, chapterNumber: 3, chapterTitle: 'Right forms of verbs', topics: ['Tense', 'Subject-Verb agreement', 'Modals'] },
  { id: 'en2-g04', subject: Subject.ENGLISH_2ND, chapterNumber: 4, chapterTitle: 'Changing Sentences', topics: ['Voice', 'Degree', 'Affirmative/Negative', 'Simple/Complex/Compound'] },
  { id: 'en2-g05', subject: Subject.ENGLISH_2ND, chapterNumber: 5, chapterTitle: 'Tag questions', topics: ['Question tags'] },
  { id: 'en2-g06', subject: Subject.ENGLISH_2ND, chapterNumber: 6, chapterTitle: 'Suffixes and prefixes', topics: ['Word formation'] },
  { id: 'en2-g07', subject: Subject.ENGLISH_2ND, chapterNumber: 7, chapterTitle: 'Connectors / Linking words', topics: ['Sentence connectors'] },
  { id: 'en2-g08', subject: Subject.ENGLISH_2ND, chapterNumber: 8, chapterTitle: 'Punctuation and capitalization', topics: ['Capital letters', 'Punctuation marks'] },
  { id: 'en2-w01', subject: Subject.ENGLISH_2ND, chapterNumber: 10, chapterTitle: 'Paragraph Writing', topics: ['Rural transport', 'Load shedding', 'Rural life'] },
  { id: 'en2-w02', subject: Subject.ENGLISH_2ND, chapterNumber: 11, chapterTitle: 'Application / Email Writing', topics: ['Testimonial', 'School canteen', 'Study tour'] },
  { id: 'en2-w03', subject: Subject.ENGLISH_2ND, chapterNumber: 12, chapterTitle: 'Composition / Short Essay', topics: ['Aim in life', 'Favourite hobby', 'Tree plantation'] },

  // --- সাধারণ বিজ্ঞান (General Science) - STRICT LIST ---
  { id: 'gs-01', subject: Subject.GENERAL_SCIENCE, chapterNumber: 1, chapterTitle: 'উন্নত জীবনধারা', topics: ['খাদ্য ও পুষ্টি', 'ভিটামিন', 'BMI'] },
  { id: 'gs-02', subject: Subject.GENERAL_SCIENCE, chapterNumber: 2, chapterTitle: 'জীবনের জন্য পানি', topics: ['পানির ধর্ম', 'জলজ উদ্ভিদ', 'পানির উৎস'] },
  { id: 'gs-03', subject: Subject.GENERAL_SCIENCE, chapterNumber: 3, chapterTitle: 'হৃদযন্ত্রের যত কথা', topics: ['রক্ত', 'হৃদপিণ্ড', 'রক্তচাপ'] },
  { id: 'gs-04', subject: Subject.GENERAL_SCIENCE, chapterNumber: 4, chapterTitle: 'অম্ল, ক্ষারক ও লবণের ব্যবহার', topics: ['লিটমাস পেপার', 'pH', 'এন্টাসিড'] },
  { id: 'gs-05', subject: Subject.GENERAL_SCIENCE, chapterNumber: 5, chapterTitle: 'এসো বলকে জানি', topics: ['নিউটনের সূত্র', 'জড়তা', 'ঘর্ষণ'] },
  { id: 'gs-11', subject: Subject.GENERAL_SCIENCE, chapterNumber: 11, chapterTitle: 'প্রত্যাহিক জীবনে তড়িৎ', topics: ['বর্তনী', 'ফিউজ', 'বিদ্যুৎ সাশ্রয়'] },

  // --- সাধারণ গণিত (General Mathematics) ---
  { id: 'gm-02', subject: Subject.MATH, chapterNumber: 2, chapterTitle: 'সেট ও ফাংশন', topics: ['Set', 'Function'] },
  { id: 'gm-03', subject: Subject.MATH, chapterNumber: 3, chapterTitle: 'বীজগাণিতিক রাশি', topics: ['Algebraic Expressions'] },
  { id: 'gm-11', subject: Subject.MATH, chapterNumber: 11, chapterTitle: 'বীজগাণিতিক অনুপাত ও সমানুপাত', topics: ['Ratio', 'Proportion'] },
  { id: 'gm-07', subject: Subject.MATH, chapterNumber: 7, chapterTitle: 'ব্যবহারিক জ্যামিতি', topics: ['Practical Geometry'] },
  { id: 'gm-08', subject: Subject.MATH, chapterNumber: 8, chapterTitle: 'বৃত্ত', topics: ['Circle'] },
  { id: 'gm-09', subject: Subject.MATH, chapterNumber: 9, chapterTitle: 'ত্রিকোণমিতিক অনুপাত', topics: ['Trigonometry'] },
  { id: 'gm-16', subject: Subject.MATH, chapterNumber: 16, chapterTitle: 'পরিমিতি', topics: ['Mensuration'] },
  { id: 'gm-17', subject: Subject.MATH, chapterNumber: 17, chapterTitle: 'পরিসংখ্যান', topics: ['Statistics'] },

  // --- ইতিহাস (History) ---
  { id: 'hist-02', subject: Subject.HISTORY, chapterNumber: 2, chapterTitle: 'বিশ্বসভ্যতা (মিশর, সিন্ধু, গ্রিক ও রোমান)', topics: ['Egypt', 'Indus', 'Greek', 'Roman'] },
  { id: 'hist-04', subject: Subject.HISTORY, chapterNumber: 4, chapterTitle: 'প্রাচীন বাংলার রাজনৈতিক ইতিহাস', topics: ['Ancient Bengal Political History'] },
  { id: 'hist-06', subject: Subject.HISTORY, chapterNumber: 6, chapterTitle: 'মধ্যযুগের বাংলার রাজনৈতিক ইতিহাস (১২০৪-১৭৫৭ খ্রি.)', topics: ['Medieval Bengal Political History'] },
  { id: 'hist-08', subject: Subject.HISTORY, chapterNumber: 8, chapterTitle: 'বাংলায় ইংরেজ শাসনের সূচনা', topics: ['Beginning of British Rule in Bengal'] },
  { id: 'hist-09', subject: Subject.HISTORY, chapterNumber: 9, chapterTitle: 'ইংরেজ শাসনামলে বাংলায় প্রতিরোধ, নবজাগরণ ও সংস্কার আন্দোলন', topics: ['Bengali Resistance', 'Renaissance', 'Reform Movements'] },
  { id: 'hist-13', subject: Subject.HISTORY, chapterNumber: 13, chapterTitle: '৭০-এর নির্বাচন এবং মুক্তিযুদ্ধ', topics: ['1970 Election', 'Liberation War'] },

  // --- English 1st Paper ---
  { id: 'en1-01', subject: Subject.ENGLISH_1ST, chapterNumber: 1, chapterTitle: 'Unit 1: Father of the Nation', topics: [] },
  { id: 'en1-02', subject: Subject.ENGLISH_1ST, chapterNumber: 2, chapterTitle: 'Unit 2: Pastimes', topics: [] },
  { id: 'en1-03', subject: Subject.ENGLISH_1ST, chapterNumber: 3, chapterTitle: 'Unit 3: Events and Festivals', topics: [] },
  { id: 'en1-06', subject: Subject.ENGLISH_1ST, chapterNumber: 6, chapterTitle: 'Unit 6: Our Neighbours', topics: [] },
  { id: 'en1-10', subject: Subject.ENGLISH_1ST, chapterNumber: 10, chapterTitle: 'Unit 10: Dreams', topics: [] },
  { id: 'en1-11', subject: Subject.ENGLISH_1ST, chapterNumber: 11, chapterTitle: 'Unit 11: Renewable Energy', topics: [] },
  { id: 'en1-13', subject: Subject.ENGLISH_1ST, chapterNumber: 13, chapterTitle: 'Unit 13: Media and Modes of e-communication', topics: [] },
  { id: 'en1-16', subject: Subject.ENGLISH_1ST, chapterNumber: 16, chapterTitle: 'Unit 16: Seeing is Believing', topics: [] },

  // --- পৌরনীতি ও নাগরিকতা (Civics and Citizenship) ---
  { id: 'civ-01', subject: Subject.CIVICS, chapterNumber: 1, chapterTitle: 'পৌরনীতি ও নাগরিকতা', topics: ['Civics', 'Citizenship'] },
  { id: 'civ-03', subject: Subject.CIVICS, chapterNumber: 3, chapterTitle: 'আইন, স্বাধীনতা ও সাম্য', topics: ['Law', 'Liberty', 'Equality'] },
  { id: 'civ-04', subject: Subject.CIVICS, chapterNumber: 4, chapterTitle: 'রাষ্ট্র ও সরকারব্যবস্থা', topics: ['State', 'Government Systems'] },
  { id: 'civ-06', subject: Subject.CIVICS, chapterNumber: 6, chapterTitle: 'বাংলাদেশের সরকারব্যবস্থা', topics: ['Bangladesh Government System'] },
  { id: 'civ-07', subject: Subject.CIVICS, chapterNumber: 7, chapterTitle: 'গণতন্ত্রে রাজনৈতিক দল ও নির্বাচন', topics: ['Political Parties', 'Election'] },
  { id: 'civ-08', subject: Subject.CIVICS, chapterNumber: 8, chapterTitle: 'বাংলাদেশের স্থানীয় সরকারব্যবস্থা', topics: ['Local Government'] },

  // --- কৃষি শিক্ষা (Agricultural Education) ---
  { id: 'agri-01', subject: Subject.AGRICULTURE, chapterNumber: 1, chapterTitle: 'কৃষি প্রযুক্তি', topics: ['Agricultural Technology'] },
  { id: 'agri-02', subject: Subject.AGRICULTURE, chapterNumber: 2, chapterTitle: 'কৃষি উপকরণ', topics: ['Agricultural Materials'] },
  { id: 'agri-04', subject: Subject.AGRICULTURE, chapterNumber: 4, chapterTitle: 'কৃষিজ উৎপাদন', topics: ['Agricultural Production'] },
  { id: 'agri-05', subject: Subject.AGRICULTURE, chapterNumber: 5, chapterTitle: 'বনায়ন', topics: ['Forestry', 'Plantation'] },

  // --- তথ্য ও যোগাযোগ প্রযুক্তি (ICT) ---
  { id: 'ict-01', subject: Subject.ICT, chapterNumber: 1, chapterTitle: 'কম্পিউটার ও তথ্য প্রযুক্তির পরিচিতি', topics: ['Introduction to Computer & IT'] },
  { id: 'ict-02', subject: Subject.ICT, chapterNumber: 2, chapterTitle: 'কম্পিউটার হার্ডওয়্যার ও সফটওয়্যার', topics: ['Computer Hardware & Software'] },
  { id: 'ict-03', subject: Subject.ICT, chapterNumber: 3, chapterTitle: 'অফিস অটোমেশন', topics: ['Office Automation'] },
  { id: 'ict-04', subject: Subject.ICT, chapterNumber: 4, chapterTitle: 'ইন্টারনেট ও যোগাযোগ প্রযুক্তি', topics: ['Internet & Communication Technology'] },
  { id: 'ict-06', subject: Subject.ICT, chapterNumber: 6, chapterTitle: 'প্রোগ্রামিং ও তথ্য প্রক্রিয়াকরণ', topics: ['Programming & Data Processing'] },

  // --- ভূগোল ও পরিবেশ (Geography and Environment) ---
  { id: 'geo-01', subject: Subject.GEOGRAPHY, chapterNumber: 1, chapterTitle: 'ভূগোল ও পরিবেশ', topics: ['Geography', 'Environment'] },
  { id: 'geo-02', subject: Subject.GEOGRAPHY, chapterNumber: 2, chapterTitle: 'মহাবিশ্ব ও আমাদের পৃথিবী', topics: ['Universe', 'Earth'] },
  { id: 'geo-03', subject: Subject.GEOGRAPHY, chapterNumber: 3, chapterTitle: 'মানচিত্র পঠন ও ব্যবহার', topics: ['Map Reading', 'Map Usage'] },
  { id: 'geo-04', subject: Subject.GEOGRAPHY, chapterNumber: 4, chapterTitle: 'পৃথিবীর অভ্যন্তরীণ ও বাহ্যিক গঠন', topics: ['Internal & External Structure of Earth'] },
  { id: 'geo-06', subject: Subject.GEOGRAPHY, chapterNumber: 6, chapterTitle: 'বারিমন্ডল', topics: ['Hydrosphere'] },
  { id: 'geo-10', subject: Subject.GEOGRAPHY, chapterNumber: 10, chapterTitle: 'বাংলাদেশের ভৌগোলিক বিবরণ', topics: ['Geographical Description of Bangladesh'] },
  { id: 'geo-14', subject: Subject.GEOGRAPHY, chapterNumber: 14, chapterTitle: 'বাংলাদেশের প্রাকৃতিক দুর্যোগ', topics: ['Natural Disasters of Bangladesh'] }
];
