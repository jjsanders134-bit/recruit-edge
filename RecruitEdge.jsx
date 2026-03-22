import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const PHASES = [
  { id: 1, label: "Foundation", grades: "8th", years: "Current", color: "#F59E0B", active: true },
  { id: 2, label: "Introduction", grades: "9th", years: "2026-27", color: "#3B82F6" },
  { id: 3, label: "Development", grades: "10th", years: "2027-28", color: "#8B5CF6" },
  { id: 4, label: "Peak Recruiting", grades: "11th", years: "2028-29", color: "#EF4444" },
  { id: 5, label: "Decision", grades: "12th", years: "2029-30", color: "#10B981" },
];

const SE = { football: "\u{1F3C8}", basketball: "\u{1F3C0}", track: "\u{1F3C3}" };

const TD = {
  1: { t: "Phase 1: Foundation (8th Grade)", s: "Build the athletic, academic, and digital foundation before high school", m: [
    { task: "Establish baseline measurables in all 3 sports", c: "athletic" },
    { task: "Create dedicated recruiting email", c: "admin" },
    { task: "Begin filming training sessions and game highlights", c: "visibility" },
    { task: "Research high school programs and coaching staff", c: "research" },
    { task: "Map 9th grade courses to NCAA core requirements", c: "academic" },
    { task: "Attend at least 1 prospect camp this summer", c: "exposure" },
    { task: "Start measurables tracking log (update monthly)", c: "athletic" },
    { task: "Identify 3-5 target programs per sport", c: "research" },
    { task: "Build athletic profile/bio sheet", c: "visibility" },
    { task: "Register for summer AAU/travel ball or track club", c: "exposure" },
  ], kd: ["Spring/Summer 2026: Prospect camps", "Summer 2026: Build highlight footage", "Aug 2026: Start HS courses matter NOW", "Fall 2026: Freshman season begins"] },
  2: { t: "Phase 2: Introduction (9th Grade)", s: "Get on the radar. Coaches are watching.", m: [
    { task: "Create NCSA recruiting profile", c: "visibility" },
    { task: "Register with NCAA Eligibility Center", c: "compliance" },
    { task: "Send introductory emails to coaches", c: "outreach" },
    { task: "Attend 2-3 college camps", c: "exposure" },
    { task: "Build first 90-second highlight reel", c: "visibility" },
    { task: "Maintain 3.0+ GPA, aim for 3.5+", c: "academic" },
    { task: "Track all varsity stats from Day 1", c: "athletic" },
    { task: "Start recruiting social media", c: "visibility" },
    { task: "Attend 1+ college games per sport in person", c: "research" },
    { task: "Express D1 goals to HS coaching staff", c: "outreach" },
  ], kd: ["Sept 2026: NCAA Eligibility Center", "Dec-Feb 2027: Basketball season", "Mar-May 2027: Track benchmarks", "June 2027: College camps"] },
  3: { t: "Phase 3: Development (10th Grade)", s: "Separate from the pack. Get on coaching boards.", m: [
    { task: "Update highlight reels each season", c: "visibility" },
    { task: "Send updated stats quarterly to coaches", c: "outreach" },
    { task: "Attend elite camps (Nike, UA, national)", c: "exposure" },
    { task: "Take PSAT, begin test prep", c: "academic" },
    { task: "Build relationships with 2-3 coaches/sport", c: "outreach" },
    { task: "Begin unofficial campus visits", c: "research" },
    { task: "Narrow sport focus if front-runner emerges", c: "athletic" },
    { task: "Create updated athletic resume with trajectory", c: "visibility" },
    { task: "Research scholarship structures at targets", c: "research" },
    { task: "Verify NCAA core course progress", c: "compliance" },
  ], kd: ["Oct 2027: PSAT", "Jan 2028: Coaches build 2030 boards", "Spring 2028: Track benchmark times", "June 2028: Elite camp circuit"] },
  4: { t: "Phase 4: Peak Recruiting (11th Grade)", s: "The window. Contact rules open. Offers come.", m: [
    { task: "June 15: D1 coaches CAN contact you (football)", c: "compliance" },
    { task: "Take SAT/ACT, exceed NCAA minimums", c: "academic" },
    { task: "Schedule official visits (5 total)", c: "exposure" },
    { task: "Update highlight reel every 2-3 months", c: "visibility" },
    { task: "Weekly communication with top 10 targets", c: "outreach" },
    { task: "National combines and all-star events", c: "exposure" },
    { task: "Complete NCAA Eligibility certification", c: "compliance" },
    { task: "Evaluate offers across all dimensions", c: "research" },
    { task: "Narrow to 8-10 serious schools", c: "research" },
    { task: "Maintain/improve GPA", c: "academic" },
  ], kd: ["June 15, 2028: D1 football contact opens", "Aug 2028: Critical film season", "Spring 2029: D1 benchmark times", "Apr-June 2029: Official visits"] },
  5: { t: "Phase 5: Decision (12th Grade)", s: "Finalize commitment. Finish strong.", m: [
    { task: "National Signing Day (Dec early, Feb regular)", c: "compliance" },
    { task: "Complete all official visits before committing", c: "exposure" },
    { task: "Final NCAA Eligibility clearance", c: "compliance" },
    { task: "Negotiate financial aid package", c: "admin" },
    { task: "Maintain GPA for NCAA requirements", c: "academic" },
    { task: "Senior season: protect scholarship", c: "athletic" },
    { task: "Submit final SAT/ACT scores", c: "academic" },
    { task: "Sign National Letter of Intent", c: "compliance" },
    { task: "Plan summer bridge to college program", c: "athletic" },
    { task: "Thank coaches, mentors, supporters", c: "admin" },
  ], kd: ["Dec 2029: Early Signing", "Feb 2030: Regular Signing Day", "Spring 2030: Final transcripts", "June 2030: Graduation"] },
};

const BM = {
  football: { l: "Football", e: "\u{1F3C8}", metrics: [
    { n: "40-Yard Dash", el: "4.40-4.50s", of: "4.50-4.60s", wk: "4.60-4.75s", t8: "Sub 5.0s" },
    { n: "Shuttle", el: "4.0-4.1s", of: "4.1-4.3s", wk: "4.3-4.5s", t8: "Under 4.8s" },
    { n: "Vertical Jump", el: "36\"+", of: "32-36\"", wk: "28-32\"", t8: "24\"+" },
    { n: "Broad Jump", el: "10'6\"+", of: "9'6\"-10'6\"", wk: "9'-9'6\"", t8: "8'+" },
    { n: "Height", el: "6'1\"+", of: "5'11\"-6'1\"", wk: "5'10\"+", t8: "Track" },
    { n: "Weight", el: "190-210", of: "175-195", wk: "170-185", t8: "Track" },
  ]},
  basketball: { l: "Basketball", e: "\u{1F3C0}", metrics: [
    { n: "Vertical Jump", el: "38\"+", of: "34-38\"", wk: "30-34\"", t8: "24\"+" },
    { n: "Lane Agility", el: "10.5-11.0s", of: "11.0-11.8s", wk: "11.8-12.5s", t8: "Under 13.0s" },
    { n: "3/4 Court Sprint", el: "3.1-3.3s", of: "3.3-3.5s", wk: "3.5-3.7s", t8: "Under 4.0s" },
    { n: "PPG (Varsity)", el: "18+", of: "14-18", wk: "10-14", t8: "N/A" },
    { n: "Height", el: "6'3\"+ (G)", of: "6'0\"-6'3\"", wk: "5'10\"+", t8: "Track" },
  ]},
  track: { l: "Track & Field", e: "\u{1F3C3}", metrics: [
    { n: "400m", el: "46.0-47.5s", of: "47.5-49.0s", wk: "49.0-50.5s", t8: "Sub 56s" },
    { n: "200m", el: "20.5-21.5s", of: "21.5-22.5s", wk: "22.5-23.5s", t8: "Sub 25s" },
    { n: "100m", el: "10.3-10.7s", of: "10.7-11.0s", wk: "11.0-11.3s", t8: "Sub 12.0s" },
    { n: "Long Jump", el: "24'+", of: "22'-24'", wk: "20'-22'", t8: "16'+" },
    { n: "300m", el: "33.5-34.5s", of: "34.5-36.0s", wk: "36.0-38.0s", t8: "Sub 42s" },
  ]},
};

const SS = [
  { nm: "University of South Carolina", cn: "SEC", ti: "Power", co: "#73000A", fb: "FBS", bb: 1, tf: 1, sz: "~35K", dr: "Local", ci: "Columbia", sc: "Full athletic", ac: "Business, engineering", nt: "Hometown. SEC across all 3 sports." },
  { nm: "Clemson University", cn: "SEC", ti: "Power", co: "#F56600", fb: "FBS", bb: 1, tf: 1, sz: "~28K", dr: "2 hrs", ci: "Clemson", sc: "Full athletic", ac: "Engineering, architecture", nt: "Elite football and track. Top-10." },
  { nm: "Coastal Carolina", cn: "Sun Belt", ti: "G5", co: "#006F71", fb: "FBS", bb: 1, tf: 1, sz: "~12K", dr: "2.5 hrs", ci: "Conway", sc: "Full athletic", ac: "Marine science", nt: "Rising program near Myrtle Beach." },
  { nm: "Furman University", cn: "Southern", ti: "FCS", co: "#582C83", fb: "FCS", bb: 1, tf: 1, sz: "~2.8K", dr: "2 hrs", ci: "Greenville", sc: "Athletic+academic stack", ac: "Top-50 liberal arts", nt: "Elite academics + competitive FCS." },
  { nm: "Wofford College", cn: "Southern", ti: "FCS", co: "#866D4B", fb: "FCS", bb: 1, tf: 1, sz: "~1.7K", dr: "1.5 hrs", ci: "Spartanburg", sc: "Athletic+academic stack", ac: "Finance, pre-law", nt: "Small. Multi-sport athletes valued." },
  { nm: "The Citadel", cn: "Southern", ti: "FCS/Mil", co: "#003DA5", fb: "FCS", bb: 1, tf: 1, sz: "~3.7K", dr: "1.75 hrs", ci: "Charleston", sc: "Athletic+military", ac: "Engineering", nt: "Military college. Strong tradition." },
  { nm: "Charleston Southern", cn: "Big South", ti: "FCS", co: "#003366", fb: "FCS", bb: 1, tf: 1, sz: "~3.2K", dr: "1.75 hrs", ci: "Charleston", sc: "Athletic+academic", ac: "Business, nursing", nt: "Growing FCS program." },
  { nm: "SC State University", cn: "MEAC", ti: "HBCU", co: "#8B0000", fb: "FCS", bb: 1, tf: 1, sz: "~5K", dr: "45 min", ci: "Orangeburg", sc: "Athletic+HBCU aid", ac: "Engineering, business", nt: "HBCU. Strong track. Close to Columbia." },
  { nm: "Presbyterian College", cn: "Pioneer/BS", ti: "FCS", co: "#002855", fb: "non-schol", bb: 1, tf: 1, sz: "~1K", dr: "1 hr", ci: "Clinton", sc: "BB/TF only", ac: "Pre-med, liberal arts", nt: "Very small. FB non-scholarship." },
  { nm: "USC Upstate", cn: "Big South", ti: "No FB", co: "#00594C", fb: null, bb: 1, tf: 1, sz: "~6K", dr: "1.5 hrs", ci: "Spartanburg", sc: "BB and TF", ac: "Nursing, business", nt: "No football. D1 BB and track." },
  { nm: "Winthrop University", cn: "Big South", ti: "No FB", co: "#87002E", fb: null, bb: 1, tf: 1, sz: "~6K", dr: "1.25 hrs", ci: "Rock Hill", sc: "BB and TF", ac: "Education, arts", nt: "Strong D1 basketball." },
  { nm: "College of Charleston", cn: "CAA", ti: "No FB/TF", co: "#800000", fb: null, bb: 1, tf: null, sz: "~10K", dr: "1.75 hrs", ci: "Charleston", sc: "BB only", ac: "Marine bio, arts", nt: "BB only. Beautiful campus." },
];

const CAMPS = [
  { id: 1, n: "Shane Beamer Youth Football Camp", sp: "football", ti: 1, dt: "June 15-17, 2026", lo: "Columbia, SC", co: "TBD", dr: "Local", cl: true },
  { id: 2, n: "Nike Basketball Camp (Cardinal Newman)", sp: "basketball", ti: 1, dt: "Summer 2026 (TBD)", lo: "Columbia, SC", co: "TBD", dr: "Local", cl: false },
  { id: 3, n: "Gamecock XC/Track Camp", sp: "track", ti: 1, dt: "July 22-26, 2026", lo: "Columbia, SC", co: "TBD", dr: "Local", cl: true },
  { id: 4, n: "Furman Football Mega Camp", sp: "football", ti: 2, dt: "June/July 2026 (TBD)", lo: "Greenville, SC", co: "$70-75", dr: "2 hrs", cl: false },
  { id: 5, n: "Offense-Defense Camp", sp: "football", ti: 2, dt: "Summer 2026 (TBD)", lo: "Myrtle Beach, SC", co: "$239-339", dr: "2.5 hrs", cl: false },
  { id: 6, n: "Wofford Football Camp", sp: "football", ti: 3, dt: "June 2026 (TBD)", lo: "Spartanburg, SC", co: "TBD", dr: "1.5 hrs", cl: false },
  { id: 7, n: "SC State Football Camp", sp: "football", ti: 3, dt: "Summer 2026 (TBD)", lo: "Orangeburg, SC", co: "TBD", dr: "45 min", cl: false },
  { id: 8, n: "PGC Basketball", sp: "basketball", ti: 3, dt: "Summer 2026 (TBD)", lo: "SC TBD", co: "$500-1K+", dr: "TBD", cl: false },
  { id: 9, n: "Furman Basketball Camp", sp: "basketball", ti: 3, dt: "Summer 2026 (TBD)", lo: "Greenville, SC", co: "TBD", dr: "2 hrs", cl: false },
  { id: 10, n: "Wofford Track Camp", sp: "track", ti: 3, dt: "Summer 2026", lo: "Spartanburg, SC", co: "TBD", dr: "1.5 hrs", cl: false },
  { id: 11, n: "IMG Academy Football", sp: "football", ti: 4, dt: "Future (10th-11th)", lo: "Bradenton, FL", co: "$2K-4K+", dr: "Fly", cl: true },
  { id: 12, n: "NBPA Top 100", sp: "basketball", ti: 4, dt: "Invite Only", lo: "Rock Hill, SC", co: "Invite", dr: "1.25 hrs", cl: true },
  { id: 13, n: "Adidas Track Nationals", sp: "track", ti: 4, dt: "Future", lo: "National", co: "TBD", dr: "Travel", cl: true },
  { id: 14, n: "SPIRE Academy Track", sp: "track", ti: 4, dt: "Future (10th-11th)", lo: "Geneva, OH", co: "TBD", dr: "Fly", cl: true },
];

const TL = { 1: "Must-Attend", 2: "Strongly Recommended", 3: "Schedule Permitting", 4: "Aspirational" };
const TCO = { 1: "#EF4444", 2: "#F59E0B", 3: "#6B7280", 4: "#8B5CF6" };
const SO = [{ v: "not-started", l: "Not Started", c: "#64748B" }, { v: "researching", l: "Researching", c: "#F59E0B" }, { v: "registered", l: "Registered", c: "#3B82F6" }, { v: "paid", l: "Paid", c: "#10B981" }, { v: "attended", l: "Attended", c: "#8B5CF6" }, { v: "skipping", l: "Skipping", c: "#EF4444" }];
const CAT = { athletic: "#F59E0B", academic: "#3B82F6", visibility: "#8B5CF6", outreach: "#EC4899", exposure: "#10B981", compliance: "#EF4444", research: "#6366F1", admin: "#6B7280" };
const OT = [
  { ph: "9th Grade: Initial Introduction", su: "Class of 2030 | [Sport] | [Position]", bd: "Dear Coach [Last Name],\n\nI am [Full Name], a [position] at [HS] in [City, SC]. Class of 2030.\n\nHeight/Weight: [X]/[X] | GPA: [X]\n[Key Stat]: [Value]\n\nHighlights: [Link] | Resume: [Attached]\n\nI plan to attend [camp] this summer.\n\nRespectfully,\n[Name] | [Email] | Class of 2030", tp: ["Under 200 words", "Always include video", "Personalize each", "Send Tue-Thu 8-10 AM"] },
  { ph: "10th Grade: Follow-Up Updates", su: "Updated Stats | [Name] | 2030", bd: "Dear Coach [Last Name],\n\nUpdated measurables:\n[Metric]: [Old] to [New]\nGPA: [Current]\n\nSeason: [Achievement]\nFilm: [Link]\n\nI [attended your camp / visited] and was impressed by [detail].\n\nWould a call or visit be possible?\n\n[Name] | [Email]", tp: ["Quarterly updates", "Reference prior interactions", "Show trajectory"] },
  { ph: "11th Grade: Official Visit Request", su: "Official Visit Request | [Name] | 2030", bd: "Dear Coach [Last Name],\n\nJunior season:\n[Top Achievement] | [Measurables]\nGPA: [X] | SAT/ACT: [X] | NCAA ID: [X]\n\n[University] is in my top [3/5].\nAvailable: [dates].\n\n[Name]", tp: ["5 official visits total", "Parent review before sending", "Follow up in 48 hours"] },
];
const NC = [{ s: "English", r: 4, d: "All 4 years" }, { s: "Math (Algebra I+)", r: 3, d: "Alg I, Geometry, Alg II" }, { s: "Natural/Physical Sci", r: 2, d: "1 lab science min" }, { s: "Additional Core", r: 1, d: "From above" }, { s: "Social Science", r: 2, d: "History, Gov, Econ" }, { s: "Additional Core Electives", r: 4, d: "Any above + world lang" }];
const NS = [{ g: "3.550+", s: 400, a: 37 }, { g: "3.000", s: 620, a: 52 }, { g: "2.500", s: 820, a: 68 }, { g: "2.300", s: 900, a: 75 }];
const PME = [{ k: "400m", l: "400m", u: "s", d1: 49, c: "#F59E0B" }, { k: "200m", l: "200m", u: "s", d1: 22.5, c: "#3B82F6" }, { k: "100m", l: "100m", u: "s", d1: 11, c: "#EF4444" }, { k: "40yd", l: "40-Yard", u: "s", d1: 4.6, c: "#10B981" }, { k: "Vertical", l: "Vertical", u: "in", d1: 32, c: "#8B5CF6" }];

const PARENT_ITEMS = {
  1: ["Research HS programs and coaching staffs", "Set up recruiting emails (parent + athlete)", "Get camera/stabilizer for filming", "Create shared Google Drive for recruiting", "Map NCAA courses vs HS catalog", "Register for summer camps early", "Build parent network with D1 families", "Establish baseline measurables", "Budget for camps, travel, visits", "Clean up social media"],
  2: ["Register with NCAA Eligibility Center", "Build first highlight reel", "Register for 2-3 camps per sport", "Quarterly GPA check-ins", "Track coach contact info", "Set up recruiting Twitter/X", "Attend college games together"],
  3: ["Plan unofficial visits (3-5)", "Register for SAT/ACT prep", "Update highlight reels each season", "Build HS coach relationships", "Research financial aid at targets", "Verify NCAA core course progress"],
  4: ["Manage official visit schedule (5 total)", "Submit SAT/ACT scores", "Coordinate transcripts", "Create offer comparison sheet", "Understand NLI terms", "Emotional support: junior year is intense"],
  5: ["Review NLI before signing", "Final transcripts sent", "Plan commitment announcement", "Coordinate summer bridge", "Celebrate: you built this together"],
};

const MIDLANDS_HS = [
  { name: "Spring Valley", city: "Columbia", cls: "5A", county: "Richland", sports: "FB, BB, TF", note: "Large 5A program. Strong athletic tradition.", change: "" },
  { name: "Lexington", city: "Lexington", cls: "5A", county: "Lexington", sports: "FB, BB, TF", note: "Competitive 5A across all sports.", change: "" },
  { name: "River Bluff", city: "Lexington", cls: "5A", county: "Lexington", sports: "FB, BB, TF", note: "Newer school. Growing athletic programs.", change: "" },
  { name: "Blythewood", city: "Blythewood", cls: "5A", county: "Richland", sports: "FB, BB, TF", note: "Strong football and basketball. 5A contender.", change: "" },
  { name: "Sumter", city: "Sumter", cls: "5A", county: "Sumter", sports: "FB, BB, TF", note: "Perennial 5A football power.", change: "" },
  { name: "Dutch Fork", city: "Irmo", cls: "5A", county: "Lexington", sports: "FB, BB, TF", note: "Dynasty football program. Multiple state titles. Top D1 pipeline.", change: "" },
  { name: "Gray Collegiate Academy", city: "West Columbia", cls: "5A", county: "Lexington", sports: "FB, BB, TF", note: "Jumped from 4A to 5A. War Eagles rising fast.", change: "4A \u2192 5A" },
  { name: "Ridge View", city: "Columbia", cls: "5A", county: "Richland", sports: "FB, BB, TF", note: "Strong multi-sport school. Blazers competitive in all 3.", change: "" },
  { name: "Chapin", city: "Chapin", cls: "5A", county: "Lexington", sports: "FB, BB, TF", note: "Growing 5A program in Lexington County.", change: "" },
  { name: "White Knoll", city: "Lexington", cls: "5A", county: "Lexington", sports: "FB, BB, TF", note: "Timberwolves. Solid across sports.", change: "" },
  { name: "Lugoff-Elgin", city: "Lugoff", cls: "4A", county: "Kershaw", sports: "FB, BB, TF", note: "Moved from 5A. Could be more competitive at 4A level.", change: "5A \u2192 4A" },
  { name: "Westwood", city: "Blythewood", cls: "4A", county: "Richland", sports: "FB, BB, TF", note: "Dropped from 5A. Redhawks rebuilding.", change: "5A \u2192 4A" },
  { name: "Irmo", city: "Irmo", cls: "4A", county: "Richland", sports: "FB, BB, TF", note: "5A D2 runner-up last 2 years. Now 4A. Could dominate at this level.", change: "5A \u2192 4A" },
  { name: "Richland Northeast", city: "Columbia", cls: "4A", county: "Richland", sports: "FB, BB, TF", note: "Cavaliers. Midlands 4A competitor.", change: "" },
  { name: "Dreher", city: "Columbia", cls: "4A", county: "Richland", sports: "FB, BB, TF", note: "Downtown Columbia. Blue Devils.", change: "" },
  { name: "A.C. Flora", city: "Columbia", cls: "4A", county: "Richland", sports: "FB, BB, TF", note: "Falcons. Strong academics + athletics in Forest Acres.", change: "" },
  { name: "Brookland-Cayce", city: "Cayce", cls: "4A", county: "Lexington", sports: "FB, BB, TF", note: "Bearcats. Solid Lexington County program.", change: "" },
  { name: "Airport", city: "West Columbia", cls: "3A", county: "Lexington", sports: "FB, BB, TF", note: "Dropped from 4A. Eagles could be very competitive at 3A.", change: "4A \u2192 3A" },
  { name: "Lower Richland", city: "Hopkins", cls: "3A", county: "Richland", sports: "FB, BB, TF", note: "Diamond Hornets. Strong football tradition. Dropped from 4A.", change: "4A \u2192 3A" },
  { name: "Gilbert", city: "Gilbert", cls: "3A", county: "Lexington", sports: "FB, BB, TF", note: "Indians. Lexington County. Dropped from 4A.", change: "4A \u2192 3A" },
  { name: "Camden", city: "Camden", cls: "3A", county: "Kershaw", sports: "FB, BB, TF", note: "Bulldogs. Strong Kershaw County program. Dropped from 4A.", change: "4A \u2192 3A" },
  { name: "Crestwood", city: "Sumter", cls: "3A", county: "Sumter", sports: "FB, BB, TF", note: "Knights. Sumter County. Dropped from 4A.", change: "4A \u2192 3A" },
  { name: "Swansea", city: "Swansea", cls: "3A", county: "Lexington", sports: "FB, BB, TF", note: "Tigers. Small-town Lexington County program.", change: "" },
  { name: "Orangeburg-Wilkinson", city: "Orangeburg", cls: "2A", county: "Orangeburg", sports: "FB, BB, TF", note: "Bruins. Dropped from 3A. Near SC State campus.", change: "3A \u2192 2A" },
  { name: "Keenan", city: "Columbia", cls: "2A", county: "Richland", sports: "FB, BB, TF", note: "Raiders. Columbia city school. Dropped from 3A.", change: "3A \u2192 2A" },
  { name: "Newberry", city: "Newberry", cls: "2A", county: "Newberry", sports: "FB, BB, TF", note: "Bulldogs. Near Newberry College. Dropped from 3A.", change: "3A \u2192 2A" },
  { name: "Pelion", city: "Pelion", cls: "2A", county: "Lexington", sports: "FB, BB, TF", note: "Panthers. Small Lexington County program.", change: "" },
  { name: "Saluda", city: "Saluda", cls: "2A", county: "Saluda", sports: "FB, BB, TF", note: "Tigers. Rural Saluda County.", change: "" },
  { name: "Columbia", city: "Columbia", cls: "2A", county: "Richland", sports: "FB, BB, TF", note: "Capitals. City of Columbia school.", change: "" },
  { name: "Mid-Carolina", city: "Prosperity", cls: "2A", county: "Newberry", sports: "FB, BB, TF", note: "Rebels. Newberry County.", change: "" },
  { name: "Strom Thurmond", city: "Johnston", cls: "2A", county: "Edgefield", sports: "FB, BB, TF", note: "Rebels. Won 2A state title 2025.", change: "" },
  { name: "American Leadership Academy", city: "Lexington", cls: "2A", county: "Lexington", sports: "FB, BB, TF", note: "Charter school. Growing program.", change: "" },
  { name: "Lake Marion", city: "Santee", cls: "2A", county: "Orangeburg", sports: "FB, BB, TF", note: "Gators. Orangeburg County.", change: "" },
  { name: "Manning", city: "Manning", cls: "2A", county: "Clarendon", sports: "FB, BB, TF", note: "Monarchs. Clarendon County.", change: "" },
  { name: "Fairfield Central", city: "Winnsboro", cls: "1A", county: "Fairfield", sports: "FB, BB, TF", note: "Griffins. Dropped from 2A. Could dominate 1A.", change: "2A \u2192 1A" },
  { name: "Batesburg-Leesville", city: "Batesburg", cls: "1A", county: "Lexington", sports: "FB, BB, TF", note: "Panthers. Dropped from 2A.", change: "2A \u2192 1A" },
  { name: "Eau Claire", city: "Columbia", cls: "1A", county: "Richland", sports: "FB, BB, TF", note: "Shamrocks. Historic Columbia school. Dropped from 2A.", change: "2A \u2192 1A" },
  { name: "C.A. Johnson", city: "Columbia", cls: "1A", county: "Richland", sports: "FB, BB, TF", note: "Columbia city school.", change: "" },
  { name: "Ridge Spring-Monetta", city: "Ridge Spring", cls: "1A", county: "Saluda", sports: "FB, BB, TF", note: "Trojans. Small rural program.", change: "" },
  { name: "Calhoun County", city: "St. Matthews", cls: "1A", county: "Calhoun", sports: "FB, BB, TF", note: "Saints. Small county school.", change: "" },
  { name: "Wagener-Salley", city: "Wagener", cls: "1A", county: "Aiken", sports: "FB, BB, TF", note: "War Eagles. Aiken County.", change: "" },
  { name: "Barnwell", city: "Barnwell", cls: "1A", county: "Barnwell", sports: "FB, BB, TF", note: "Warhorses. Dropped from 2A.", change: "2A \u2192 1A" },
  { name: "Edisto", city: "Cordova", cls: "1A", county: "Orangeburg", sports: "FB, BB, TF", note: "Cougars. Dropped from 2A.", change: "2A \u2192 1A" },
  { name: "North", city: "North", cls: "1A", county: "Orangeburg", sports: "FB, BB, TF", note: "Bulldogs. Orangeburg County.", change: "" },
  { name: "Scott's Branch", city: "Summerton", cls: "1A", county: "Clarendon", sports: "FB, BB, TF", note: "Eagles. Clarendon County.", change: "" },
  { name: "Bethune-Bowman", city: "Bowman", cls: "1A", county: "Orangeburg", sports: "FB, BB, TF", note: "Mohawks. Orangeburg County.", change: "" },
];

const CLS_COLORS = { "5A": "#EF4444", "4A": "#F59E0B", "3A": "#3B82F6", "2A": "#8B5CF6", "1A": "#10B981" };

const Ico = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Arr = ({ open }) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", color: "#475569" }}><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.hd{background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(239,68,68,.08),rgba(59,130,246,.08));border-bottom:1px solid rgba(245,158,11,.2);padding:18px 20px;position:sticky;top:0;z-index:100;backdrop-filter:blur(20px)}
.hd h1{font-weight:900;font-size:24px;background:linear-gradient(135deg,#F59E0B,#EF4444,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hd p{font-family:'Space Mono',monospace;font-size:10px;color:#64748B;letter-spacing:2px;text-transform:uppercase;margin-top:2px}
.ts{display:flex;gap:1px;padding:6px 12px;background:rgba(15,23,42,.9);border-bottom:1px solid rgba(255,255,255,.04);overflow-x:auto}
.tb{padding:7px 10px;border:none;background:transparent;color:#4B5563;font-size:11px;font-weight:500;cursor:pointer;border-radius:5px;white-space:nowrap;display:flex;align-items:center;gap:3px;transition:all .15s}
.tb:hover{background:rgba(255,255,255,.04);color:#94A3B8}
.tb.on{background:rgba(245,158,11,.12);color:#F59E0B;font-weight:600}
.ct{padding:16px 20px;max-width:1100px}
.cd{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:18px;margin-bottom:10px}
.cd:hover{border-color:rgba(255,255,255,.1)}
.cd h3{font-weight:700;font-size:15px;color:#F1F5F9;margin-bottom:10px}
.ps{display:flex;gap:5px;margin-bottom:16px;flex-wrap:wrap}
.phb{padding:5px 12px;border:1px solid rgba(255,255,255,.08);border-radius:5px;background:transparent;color:#64748B;font-size:11px;cursor:pointer;position:relative}
.phb.on{border-color:var(--c);color:var(--c);background:rgba(255,255,255,.02);font-weight:600}
.phb .nw{position:absolute;top:-6px;right:-6px;background:#F59E0B;color:#0B1120;font-size:7px;font-weight:700;padding:1px 4px;border-radius:3px}
.bd{display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.4px}
.mi{display:flex;align-items:flex-start;gap:8px;padding:8px 4px;border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer;border-radius:3px}
.mi:hover{background:rgba(255,255,255,.015)}
.ck{width:18px;height:18px;border:2px solid rgba(255,255,255,.15);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.ck.on{background:#10B981;border-color:#10B981;color:#fff}
.prb{width:100%;height:4px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden}
.prf{height:100%;border-radius:2px;transition:width .4s}
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:16px}
.scd{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center}
.scd .v{font-weight:800;font-size:26px;line-height:1}
.scd .lb{font-size:8px;color:#64748B;text-transform:uppercase;letter-spacing:1px;margin-top:3px;font-family:'Space Mono',monospace}
.stb{padding:6px 14px;border:1px solid rgba(255,255,255,.08);border-radius:5px;background:transparent;color:#94A3B8;font-size:12px;cursor:pointer}
.stb.on{background:rgba(245,158,11,.12);border-color:#F59E0B;color:#F59E0B;font-weight:600}
table.bt{width:100%;border-collapse:collapse;font-size:11px}
.bt th{text-align:left;padding:7px 8px;font-family:'Space Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#4B5563;border-bottom:1px solid rgba(255,255,255,.06)}
.bt td{padding:8px;border-bottom:1px solid rgba(255,255,255,.03);color:#CBD5E1}
.bt tr:hover{background:rgba(255,255,255,.015)}
.el{color:#10B981;font-weight:600}.ofr{color:#3B82F6;font-weight:600}.wk{color:#F59E0B}
.kd{padding:7px 12px;background:rgba(59,130,246,.05);border-left:3px solid #3B82F6;border-radius:0 4px 4px 0;margin-bottom:5px;font-size:11px;color:#94A3B8}
.tip{background:rgba(245,158,11,.06);border-left:3px solid #F59E0B;padding:10px 14px;border-radius:0 6px 6px 0;margin-top:8px}
.inp{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:5px 8px;color:#E2E8F0;font-size:11px;outline:none;width:100%}
.inp:focus{border-color:#F59E0B}
.btn{padding:5px 12px;background:#F59E0B;color:#0B1120;border:none;border-radius:4px;font-size:10px;font-weight:600;cursor:pointer}
.sel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:3px 6px;color:#E2E8F0;font-size:10px;cursor:pointer}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@media(max-width:768px){.hd{padding:12px}.hd h1{font-size:18px}.ct{padding:10px}.sg{grid-template-columns:repeat(2,1fr)}}`;

export default function RecruitEdge() {
  const [tab, setTab] = useState("overview");
  const [phase, setPhase] = useState(1);
  const [checks, setChecks] = useState({});
  const [sport, setSport] = useState("football");
  const [meas, setMeas] = useState({});
  const [measI, setMeasI] = useState(null);
  const [iv, setIv] = useState("");
  const [pe, setPe] = useState([]);
  const [ne, setNe] = useState({});
  const [pm, setPm] = useState("400m");
  const [campSt, setCampSt] = useState({});
  const [campCk, setCampCk] = useState({});
  const [campCo, setCampCo] = useState({});
  const [expCamp, setExpCamp] = useState(null);
  const [campFilt, setCampFilt] = useState("all");
  const [coaches, setCoaches] = useState([]);
  const [cf, setCf] = useState({ name: "", school: "", sport: "football", email: "", notes: "" });
  const [showCf, setShowCf] = useState(false);
  const [schInt, setSchInt] = useState({});
  const [expSch, setExpSch] = useState(null);
  const [cmpList, setCmpList] = useState([]);
  const [expTpl, setExpTpl] = useState(0);
  const [hsFilt, setHsFilt] = useState("all");
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [academics, setAcademics] = useState({ gpa: "", coreCourses: 0, testPrepStarted: false, satScore: "", actScore: "" });
  const [visChecks, setVisChecks] = useState({ recruitEmail: false, highlightReel: false, ncsaProfile: false, socialMedia: false, athleteResume: false, filmSessions: false });
  const [saveStatus, setSaveStatus] = useState("...");
  const [showExport, setShowExport] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const saveTimer = useRef(null);

  // Test storage on mount, then load data
  useEffect(() => {
    const init = async () => {
      if (!window.storage) { setSaveStatus("No storage"); setStorageLoaded(true); return; }

      // Test: can we write at all?
      let storageWorks = false;
      try {
        const testResult = await window.storage.set("test", "1");
        storageWorks = !!testResult;
      } catch (e) {
        storageWorks = false;
      }
      setCanSave(storageWorks);

      if (!storageWorks) {
        setSaveStatus("\u26A0\uFE0F Use Export");
        setStorageLoaded(true);
        return;
      }

      // Storage works — try to load saved data
      try {
        let data = null;
        const keys = ["redata", "re-data", "recruitedge-state", "d1-dashboard-state"];
        for (const k of keys) {
          try { const r = await window.storage.get(k); if (r && r.value) { data = r.value; break; } } catch(e) {}
        }
        if (data) {
          const saved = JSON.parse(data);
          if (saved.checks) setChecks(saved.checks);
          if (saved.meas) setMeas(saved.meas);
          if (saved.pe) setPe(saved.pe);
          if (saved.campSt) setCampSt(saved.campSt);
          if (saved.campCk) setCampCk(saved.campCk);
          if (saved.campCo) setCampCo(saved.campCo);
          if (saved.coaches) setCoaches(saved.coaches);
          if (saved.schInt) setSchInt(saved.schInt);
          if (saved.cmpList) setCmpList(saved.cmpList);
          if (saved.academics) setAcademics(saved.academics);
          if (saved.visChecks) setVisChecks(saved.visChecks);
          setSaveStatus("\u2705 Loaded");
          setTimeout(() => setSaveStatus(""), 3000);
        } else {
          setSaveStatus("\u2705 Ready");
        }
      } catch (e) {
        setSaveStatus("\u2705 Ready");
      }
      setStorageLoaded(true);
    };
    init();
  }, []);

  // Auto-save when data changes (only if storage works)
  useEffect(() => {
    if (!storageLoaded || !canSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const payload = JSON.stringify({ checks, meas, pe, campSt, campCk, campCo, coaches, schInt, cmpList, academics, visChecks });
        const result = await window.storage.set("redata", payload);
        setSaveStatus(result ? "\u2705 Saved" : "\u26A0\uFE0F Retry");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (e) {
        setSaveStatus("\u26A0\uFE0F Export to save");
      }
    }, 800);
  }, [checks, meas, pe, campSt, campCk, campCo, coaches, schInt, cmpList, storageLoaded, academics, visChecks, canSave]);

  // Export: always works regardless of storage
  const exportData = () => {
    const data = JSON.stringify({ checks, meas, pe, campSt, campCk, campCo, coaches, schInt, cmpList, academics, visChecks, exportDate: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "recruit-edge-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click(); URL.revokeObjectURL(url);
    setSaveStatus("\u2705 Exported!");
  };

  // Import data from JSON file
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const saved = JSON.parse(ev.target.result);
        if (saved.checks) setChecks(saved.checks);
        if (saved.meas) setMeas(saved.meas);
        if (saved.pe) setPe(saved.pe);
        if (saved.campSt) setCampSt(saved.campSt);
        if (saved.campCk) setCampCk(saved.campCk);
        if (saved.campCo) setCampCo(saved.campCo);
        if (saved.coaches) setCoaches(saved.coaches);
        if (saved.schInt) setSchInt(saved.schInt);
        if (saved.cmpList) setCmpList(saved.cmpList);
        if (saved.academics) setAcademics(saved.academics);
        if (saved.visChecks) setVisChecks(saved.visChecks);
        setSaveStatus("\u{1F4E5} Imported!");
      } catch (err) { setSaveStatus("\u26A0\uFE0F Bad file"); }
    };
    reader.readAsText(file);
  };

  const tog = (k) => setChecks((p) => ({ ...p, [k]: !p[k] }));
  const prog = (ph) => {
    const items = TD[ph]?.m || [];
    const done = items.filter((_, i) => checks[ph + "-" + i]).length;
    return items.length ? Math.round((done / items.length) * 100) : 0;
  };
  const savM = (s, m) => {
    if (iv.trim()) setMeas((p) => ({ ...p, [s + "-" + m]: { v: iv.trim(), d: new Date().toLocaleDateString() } }));
    setMeasI(null);
    setIv("");
  };
  const [entryMsg, setEntryMsg] = useState("");
  const addPE = () => {
    // Auto-fill date if empty
    const entry = { ...ne };
    if (!entry.date) {
      const now = new Date();
      entry.date = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    // Check if at least one measurable has a value
    const hasValue = PME.some((m) => entry[m.k] != null && entry[m.k] !== "");
    if (!hasValue) {
      setEntryMsg("\u26A0\uFE0F Enter at least one measurable");
      setTimeout(() => setEntryMsg(""), 3000);
      return;
    }
    setPe((p) => [...p, entry]);
    setNe({});
    setEntryMsg("\u2705 Entry saved!");
    setTimeout(() => setEntryMsg(""), 3000);
  };
  const addCoach = () => {
    if (!cf.name) return;
    setCoaches((p) => [...p, { ...cf, id: Date.now(), dt: new Date().toLocaleDateString(), st: "initial" }]);
    setCf({ name: "", school: "", sport: "football", email: "", notes: "" });
    setShowCf(false);
  };

  const regCount = Object.values(campSt).filter((s) => ["registered", "paid", "attended"].includes(s)).length;
  const totalSpend = Object.values(campCo).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const curMetric = PME.find((m) => m.k === pm) || PME[0];

  // Quick readiness score for overview
  const quickScore = (() => {
    const totalM = Object.keys(BM).reduce((s, sp) => s + BM[sp].metrics.length, 0);
    const aS = Math.min(20, Math.round((Object.keys(meas).length / Math.max(totalM, 1)) * 20));
    const gV = parseFloat(academics.gpa) || 0;
    const acS = (gV >= 3.5 ? 8 : gV >= 3.0 ? 6 : gV >= 2.5 ? 4 : gV > 0 ? 2 : 0) + Math.min(8, Math.round((academics.coreCourses / 16) * 8)) + (academics.testPrepStarted ? 2 : 0) + (academics.satScore ? 1 : 0) + (academics.actScore ? 1 : 0);
    const viS = Math.round((Object.values(visChecks).filter(Boolean).length / Math.max(Object.keys(visChecks).length, 1)) * 15);
    const rC = coaches.filter(c => ["responded", "relationship", "recruiting"].includes(c.st)).length;
    const oS = Math.min(15, Math.round(Math.min(coaches.length, 10) / 10 * 8) + Math.round(Math.min(rC, 5) / 5 * 7));
    const tS = Math.round(prog(phase) / 100 * 15);
    const pI = PARENT_ITEMS[phase] || [];
    const pS = Math.round((pI.filter((_, i) => checks["p-" + phase + "-" + i]).length / Math.max(pI.length, 1)) * 15);
    return aS + acS + viS + oS + tS + pS;
  })();

  const tabList = [
    { id: "overview", i: "\u{1F4CA}", l: "Overview" },
    { id: "readiness", i: "\u{1F3AF}", l: "Readiness" },
    { id: "timeline", i: "\u{1F4C5}", l: "Timeline" },
    { id: "benchmarks", i: "\u{1F4CF}", l: "Benchmarks" },
    { id: "progress", i: "\u{1F4C8}", l: "Progress" },
    { id: "camps", i: "\u{26FA}", l: "Camps" },
    { id: "outreach", i: "\u{1F4E7}", l: "Outreach" },
    { id: "contacts", i: "\u{1F4C7}", l: "Coaches" },
    { id: "ncaa", i: "\u{1F393}", l: "NCAA" },
    { id: "visibility", i: "\u{1F4E1}", l: "Visibility" },
    { id: "schools", i: "\u{1F3EB}", l: "Schools" },
    { id: "highschools", i: "\u{1F3C6}", l: "HS Programs" },
    { id: "compare", i: "\u{2696}\u{FE0F}", l: "Compare" },
    { id: "parent", i: "\u{1F469}\u{200D}\u{1F466}", l: "Parent" },
  ];

  const campCheckItems = ["Registered", "Payment sent", "Physical form", "Travel booked", "Resume printed", "Film gear", "Staff researched", "Follow-up sent"];

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: "linear-gradient(145deg,#0B1120,#111827)", color: "#E2E8F0", minHeight: "100vh", width: "100%" }}>
      <style>{CSS}</style>
      <div className="hd"><h1>RECRUIT EDGE</h1><p>Class of 2030 | Football | Basketball | Track & Field</p>
        <div style={{ position: "absolute", top: 6, right: 12, display: "flex", alignItems: "center", gap: 8 }}>
          {saveStatus && <span style={{ fontSize: 10, color: saveStatus.includes("\u2705") ? "#10B981" : saveStatus.includes("\u26A0") ? "#EF4444" : "#94A3B8", fontFamily: "'Space Mono',monospace" }}>{saveStatus}</span>}
          <button onClick={() => setShowExport(!showExport)} style={{ fontSize: !canSave ? 12 : 10, background: !canSave ? "#EF4444" : "rgba(255,255,255,.06)", border: "1px solid " + (!canSave ? "#EF4444" : "rgba(255,255,255,.1)"), color: !canSave ? "#FFF" : "#94A3B8", borderRadius: 4, padding: !canSave ? "2px 10px" : "2px 8px", cursor: "pointer", animation: !canSave ? "pulse 2s infinite" : "none" }}>{!canSave ? "\u{1F4BE} SAVE" : "\u{1F4BE}"}</button>
        </div>
        {showExport && <div style={{ position: "absolute", top: 52, right: 12, background: "#1E293B", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, padding: 14, zIndex: 200, width: 220, boxShadow: "0 8px 24px rgba(0,0,0,.4)" }}>
          <p style={{ fontSize: 11, color: !canSave ? "#EF4444" : "#64748B", marginBottom: 10, fontWeight: !canSave ? 700 : 400 }}>{!canSave ? "\u26A0\uFE0F Cloud save unavailable. Use Export to save your data to a file, then Import to restore." : "Backup your data"}</p>
          <button onClick={exportData} style={{ width: "100%", padding: "8px 10px", fontSize: 12, background: "#10B981", color: "#0B1120", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>{"\u{1F4E4}"} Export Backup (Download)</button>
          <label style={{ display: "block", width: "100%", padding: "8px 10px", fontSize: 12, background: "rgba(255,255,255,.06)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, fontWeight: 600, cursor: "pointer", textAlign: "center" }}>{"\u{1F4E5}"} Import Backup (Restore)<input type="file" accept=".json" onChange={importData} style={{ display: "none" }} /></label>
        </div>}
      </div>
      <div className="ts">{tabList.map((t) => <button key={t.id} className={"tb" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>{t.i} {t.l}</button>)}</div>
      <div className="ct">

        {/* OVERVIEW */}
        {tab === "overview" && (<div>
          <div className="sg">
            <div className="scd" style={{ cursor: "pointer", borderColor: quickScore >= 60 ? "rgba(16,185,129,0.3)" : quickScore >= 30 ? "rgba(59,130,246,0.3)" : "rgba(245,158,11,0.3)" }} onClick={() => setTab("readiness")}><div className="v" style={{ color: quickScore >= 60 ? "#10B981" : quickScore >= 30 ? "#3B82F6" : "#F59E0B" }}>{quickScore}</div><div className="lb">Readiness</div></div>
            <div className="scd"><div className="v" style={{ color: "#F59E0B" }}>8th</div><div className="lb">Grade</div></div>
            <div className="scd"><div className="v" style={{ color: "#10B981" }}>{prog(1)}%</div><div className="lb">Phase 1</div></div>
            <div className="scd"><div className="v" style={{ color: "#8B5CF6" }}>{regCount}</div><div className="lb">Camps</div></div>
            <div className="scd"><div className="v" style={{ color: "#EC4899" }}>{coaches.length}</div><div className="lb">Contacts</div></div>
          </div>
          <div className="cd" style={{ borderColor: "rgba(245,158,11,.2)" }}>
            <h3>{"\u{1F3AF}"} Current Phase: Foundation</h3>
            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7, marginBottom: 10 }}>Pre-high school runway. Most families start junior year - you are <strong style={{ color: "#F59E0B" }}>3 years ahead</strong>.</p>
            <div className="prb"><div className="prf" style={{ width: prog(1) + "%", background: "linear-gradient(90deg,#F59E0B,#EF4444)" }} /></div>
          </div>
          <div className="cd"><h3>{"\u{1F5FA}\u{FE0F}"} 5-Phase Journey</h3>
            {PHASES.map((p) => (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.03)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.active ? p.color : "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center", color: p.active ? "#0B1120" : "#4B5563", fontWeight: 800, fontSize: 13, border: p.active ? "none" : "1px solid rgba(255,255,255,.06)" }}>{p.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: p.active ? p.color : "#94A3B8" }}>{p.label} {p.active && <span style={{ fontSize: 8, background: "#F59E0B", color: "#0B1120", padding: "1px 4px", borderRadius: 3, marginLeft: 6, fontWeight: 700 }}>NOW</span>}</div>
                <div style={{ fontSize: 10, color: "#4B5563" }}>{p.grades} | {p.years}</div>
              </div>
              <div style={{ width: 60 }}><div className="prb"><div className="prf" style={{ width: prog(p.id) + "%", background: p.color }} /></div></div>
            </div>))}
          </div>
        </div>)}

        {/* READINESS SCORE */}
        {tab === "readiness" && (() => {
          // SCORING ENGINE - 6 categories, 0-100 total
          // Athletic (20 pts): measurables logged
          const totalMetrics = Object.keys(BM).reduce((s, sp) => s + BM[sp].metrics.length, 0);
          const loggedMetrics = Object.keys(meas).length;
          const athleticScore = Math.min(20, Math.round((loggedMetrics / Math.max(totalMetrics, 1)) * 20));

          // Academic (20 pts): GPA (8), core courses (8), test prep (4)
          const gpaVal = parseFloat(academics.gpa) || 0;
          const gpaScore = gpaVal >= 3.5 ? 8 : gpaVal >= 3.0 ? 6 : gpaVal >= 2.5 ? 4 : gpaVal > 0 ? 2 : 0;
          const courseScore = Math.min(8, Math.round((academics.coreCourses / 16) * 8));
          const testScore = academics.testPrepStarted ? 2 : 0;
          const satBonus = academics.satScore ? 1 : 0;
          const actBonus = academics.actScore ? 1 : 0;
          const academicScore = gpaScore + courseScore + testScore + satBonus + actBonus;

          // Visibility (15 pts): checklist items
          const visTotal = Object.keys(visChecks).length;
          const visDone = Object.values(visChecks).filter(Boolean).length;
          const visibilityScore = Math.round((visDone / Math.max(visTotal, 1)) * 15);

          // Outreach (15 pts): coach contacts and their statuses
          const coachCount = coaches.length;
          const respondedCoaches = coaches.filter(c => ["responded", "relationship", "recruiting"].includes(c.st)).length;
          const outreachScore = Math.min(15, Math.round(Math.min(coachCount, 10) / 10 * 8) + Math.round(Math.min(respondedCoaches, 5) / 5 * 7));

          // Timeline (15 pts): current phase milestones
          const timelineScore = Math.round(prog(phase) / 100 * 15);

          // Parent (15 pts): parent action items
          const parentItems = PARENT_ITEMS[phase] || [];
          const parentDone = parentItems.filter((_, i) => checks["p-" + phase + "-" + i]).length;
          const parentScore = Math.round((parentDone / Math.max(parentItems.length, 1)) * 15);

          const totalScore = athleticScore + academicScore + visibilityScore + outreachScore + timelineScore + parentScore;

          const categories = [
            { name: "Athletic", score: athleticScore, max: 20, color: "#F59E0B", icon: "\u{1F3C8}", tip: loggedMetrics === 0 ? "Log your first measurables in the Benchmarks tab" : loggedMetrics < totalMetrics ? "Log measurables for all 3 sports (" + loggedMetrics + "/" + totalMetrics + " done)" : "All measurables logged! Update monthly to track trajectory." },
            { name: "Academic", score: academicScore, max: 20, color: "#3B82F6", icon: "\u{1F4DA}", tip: !academics.gpa ? "Enter your GPA below to boost this score" : academics.coreCourses < 4 ? "Map your 9th grade courses to NCAA requirements" : !academics.testPrepStarted ? "Start SAT/ACT prep planning" : "Academic tracking on point!" },
            { name: "Visibility", score: visibilityScore, max: 15, color: "#8B5CF6", icon: "\u{1F4F1}", tip: visDone === 0 ? "Complete your first visibility item: create a recruiting email" : visDone < visTotal ? (visTotal - visDone) + " visibility items remaining" : "Full digital presence established!" },
            { name: "Outreach", score: outreachScore, max: 15, color: "#EC4899", icon: "\u{1F4E7}", tip: coachCount === 0 ? "Add your first coach contact after a camp or outreach email" : respondedCoaches === 0 ? "Keep emailing! Responses come with persistence." : respondedCoaches + " coaches engaged. Keep building relationships." },
            { name: "Timeline", score: timelineScore, max: 15, color: "#10B981", icon: "\u{2705}", tip: prog(phase) < 25 ? "Focus on completing Phase " + phase + " milestones (" + prog(phase) + "% done)" : prog(phase) < 75 ? "Good progress on Phase " + phase + "! " + (100 - prog(phase)) + "% remaining" : "Phase " + phase + " nearly complete! Strong execution." },
            { name: "Parent", score: parentScore, max: 15, color: "#14B8A6", icon: "\u{1F469}\u{200D}\u{1F466}", tip: parentDone === 0 ? "Check off parent action items in the Parent tab" : parentDone < parentItems.length ? (parentItems.length - parentDone) + " parent items remaining for Phase " + phase : "All parent actions complete for this phase!" },
          ];

          const tier = totalScore >= 80 ? { label: "D1 Ready", color: "#10B981" } : totalScore >= 60 ? { label: "On Track", color: "#3B82F6" } : totalScore >= 40 ? { label: "Building", color: "#F59E0B" } : totalScore >= 20 ? { label: "Starting", color: "#F97316" } : { label: "Begin", color: "#EF4444" };

          // SVG circular gauge
          const radius = 70;
          const circ = 2 * Math.PI * radius;
          const offset = circ - (totalScore / 100) * circ;

          return (<div>
            {/* Main Score Gauge */}
            <div className="cd" style={{ borderColor: tier.color + "40", textAlign: "center", padding: 30 }}>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>{"\u{1F3AF}"} D1 Readiness Score</h3>
              <p style={{ fontSize: 11, color: "#64748B", marginBottom: 20 }}>Based on 6 recruiting dimensions. Updated in real-time as you complete actions.</p>
              <svg width="180" height="180" viewBox="0 0 180 180" style={{ margin: "0 auto", display: "block" }}>
                <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="90" cy="90" r={radius} fill="none" stroke={tier.color} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={offset}
                  transform="rotate(-90 90 90)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                <text x="90" y="82" textAnchor="middle" fill="#F1F5F9" fontSize="36" fontWeight="800">{totalScore}</text>
                <text x="90" y="102" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="'Space Mono',monospace">/100</text>
                <text x="90" y="122" textAnchor="middle" fill={tier.color} fontSize="12" fontWeight="700">{tier.label}</text>
              </svg>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                {[{ l: "0-19", c: "#EF4444", t: "Begin" }, { l: "20-39", c: "#F97316", t: "Starting" }, { l: "40-59", c: "#F59E0B", t: "Building" }, { l: "60-79", c: "#3B82F6", t: "On Track" }, { l: "80-100", c: "#10B981", t: "D1 Ready" }].map((t) => (
                  <div key={t.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: totalScore >= parseInt(t.l) && totalScore <= parseInt(t.l.split("-")[1]) ? t.c : "#374151" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.c, opacity: totalScore >= parseInt(t.l) && totalScore <= parseInt(t.l.split("-")[1]) ? 1 : 0.3 }} />{t.t}
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="cd">
              <h3>Category Breakdown</h3>
              {categories.map((cat) => (
                <div key={cat.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{cat.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: cat.color, fontWeight: 700 }}>{cat.score}/{cat.max}</span>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: (cat.score / cat.max * 100) + "%", background: cat.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                  <p style={{ fontSize: 10, color: "#94A3B8", fontStyle: "italic" }}>{"\u{2192}"} {cat.tip}</p>
                </div>
              ))}
            </div>

            {/* Academic Input Section */}
            <div className="cd" style={{ borderColor: "rgba(59,130,246,0.2)" }}>
              <h3>{"\u{1F4DA}"} Academic Tracking</h3>
              <p style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Enter academic data to improve your readiness score. This data feeds the Academic category (20 points max).</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Core GPA</label><input className="inp" type="number" step="0.01" min="0" max="4.0" placeholder="e.g. 3.5" value={academics.gpa} onChange={(e) => setAcademics((p) => ({ ...p, gpa: e.target.value }))} /></div>
                <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Core Courses Done (of 16)</label><input className="inp" type="number" min="0" max="16" placeholder="0" value={academics.coreCourses || ""} onChange={(e) => setAcademics((p) => ({ ...p, coreCourses: parseInt(e.target.value) || 0 }))} /></div>
                <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>SAT Score</label><input className="inp" type="number" placeholder="Optional" value={academics.satScore} onChange={(e) => setAcademics((p) => ({ ...p, satScore: e.target.value }))} /></div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
                <label style={{ fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={academics.testPrepStarted} onChange={(e) => setAcademics((p) => ({ ...p, testPrepStarted: e.target.checked }))} style={{ accentColor: "#3B82F6" }} />
                  Test Prep Started
                </label>
              </div>
            </div>

            {/* Visibility Checklist */}
            <div className="cd" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
              <h3>{"\u{1F4F1}"} Visibility Checklist</h3>
              <p style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>Check off visibility items to improve your score. These are the digital assets coaches look for.</p>
              {[
                { k: "recruitEmail", l: "Dedicated recruiting email created" },
                { k: "highlightReel", l: "Highlight reel filmed (even informal)" },
                { k: "ncsaProfile", l: "NCSA or recruiting profile created" },
                { k: "socialMedia", l: "Recruiting social media account active" },
                { k: "athleteResume", l: "Athletic resume / bio sheet built" },
                { k: "filmSessions", l: "Regular filming of training sessions" },
              ].map((item) => (
                <div key={item.k} className="mi" style={{ padding: "6px 4px" }} onClick={() => setVisChecks((p) => ({ ...p, [item.k]: !p[item.k] }))}>
                  <div className={"ck" + (visChecks[item.k] ? " on" : "")} style={{ width: 16, height: 16 }}>{visChecks[item.k] && <Ico />}</div>
                  <span style={{ fontSize: 12, color: visChecks[item.k] ? "#4B5563" : "#CBD5E1", textDecoration: visChecks[item.k] ? "line-through" : "none" }}>{item.l}</span>
                </div>
              ))}
            </div>

            {/* Top 3 Recommendations */}
            <div className="cd" style={{ borderColor: "rgba(245,158,11,0.2)" }}>
              <h3>{"\u{1F4A1}"} Top Recommendations to Boost Your Score</h3>
              {categories
                .sort((a, b) => (a.score / a.max) - (b.score / b.max))
                .slice(0, 3)
                .map((cat, i) => (
                  <div key={cat.name} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderLeft: "3px solid " + cat.color, borderRadius: "0 6px 6px 0", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>#{i + 1}: {cat.name}</span>
                      <span style={{ fontSize: 10, color: "#4B5563" }}>({cat.score}/{cat.max} points)</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#CBD5E1" }}>{cat.tip}</p>
                  </div>
                ))}
            </div>

            {/* Phase Benchmark */}
            <div className="cd">
              <h3>Where You Should Be by Phase</h3>
              <div style={{ overflowX: "auto" }}>
                <table className="bt">
                  <thead><tr><th>Phase</th><th>Target Score</th><th>Focus Areas</th></tr></thead>
                  <tbody>
                    <tr style={{ background: phase === 1 ? "rgba(245,158,11,0.06)" : "transparent" }}><td style={{ fontWeight: phase === 1 ? 700 : 400, color: phase === 1 ? "#F59E0B" : "#CBD5E1" }}>1: Foundation (8th){phase === 1 ? " \u2190 YOU" : ""}</td><td>15-30</td><td>Measurables baseline, academic setup, first camp</td></tr>
                    <tr style={{ background: phase === 2 ? "rgba(59,130,246,0.06)" : "transparent" }}><td style={{ fontWeight: phase === 2 ? 700 : 400, color: phase === 2 ? "#3B82F6" : "#CBD5E1" }}>2: Introduction (9th){phase === 2 ? " \u2190 YOU" : ""}</td><td>30-50</td><td>Profiles live, first outreach, 3+ camps attended</td></tr>
                    <tr style={{ background: phase === 3 ? "rgba(139,92,246,0.06)" : "transparent" }}><td style={{ fontWeight: phase === 3 ? 700 : 400, color: phase === 3 ? "#8B5CF6" : "#CBD5E1" }}>3: Development (10th){phase === 3 ? " \u2190 YOU" : ""}</td><td>50-70</td><td>Coach relationships building, strong academics, updated film</td></tr>
                    <tr style={{ background: phase === 4 ? "rgba(239,68,68,0.06)" : "transparent" }}><td style={{ fontWeight: phase === 4 ? 700 : 400, color: phase === 4 ? "#EF4444" : "#CBD5E1" }}>4: Peak Recruiting (11th){phase === 4 ? " \u2190 YOU" : ""}</td><td>70-85</td><td>Active coach communication, official visits, strong measurables</td></tr>
                    <tr style={{ background: phase === 5 ? "rgba(16,185,129,0.06)" : "transparent" }}><td style={{ fontWeight: phase === 5 ? 700 : 400, color: phase === 5 ? "#10B981" : "#CBD5E1" }}>5: Decision (12th){phase === 5 ? " \u2190 YOU" : ""}</td><td>85-100</td><td>Offers in hand, NLI ready, all boxes checked</td></tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>Your current score of {totalScore} {totalScore >= 15 ? "is on track" : "has room to grow"} for Phase {phase}. {totalScore < 15 ? "Start by logging measurables and completing Phase 1 milestones." : totalScore < 30 ? "Focus on the top 3 recommendations above." : "Keep building momentum across all categories."}</p>
            </div>
          </div>);
        })()}

        {/* TIMELINE */}
        {tab === "timeline" && (<div>
          <div className="ps">{PHASES.map((p) => <button key={p.id} className={"phb" + (phase === p.id ? " on" : "")} style={{ "--c": p.color }} onClick={() => setPhase(p.id)}>{p.id === 1 && <span className="nw">NOW</span>}{p.label}</button>)}</div>
          <div className="cd">
            <h3>{TD[phase].t}</h3>
            <p style={{ fontSize: 11, color: "#64748B", marginBottom: 12, fontStyle: "italic" }}>{TD[phase].s}</p>
            <div className="prb" style={{ marginBottom: 14 }}><div className="prf" style={{ width: prog(phase) + "%", background: PHASES.find((p) => p.id === phase)?.color }} /></div>
            {TD[phase].m.map((m, i) => (<div key={i} className="mi" onClick={() => tog(phase + "-" + i)}>
              <div className={"ck" + (checks[phase + "-" + i] ? " on" : "")}>{checks[phase + "-" + i] && <Ico />}</div>
              <span style={{ fontSize: 12, color: checks[phase + "-" + i] ? "#4B5563" : "#CBD5E1", textDecoration: checks[phase + "-" + i] ? "line-through" : "none", lineHeight: 1.5 }}>
                {m.task} <span className="bd" style={{ background: (CAT[m.c] || "#666") + "15", color: CAT[m.c], marginLeft: 6 }}>{m.c}</span>
              </span>
            </div>))}
          </div>
          <div className="cd"><h3>{"\u{1F4CC}"} Key Dates</h3>{TD[phase].kd.map((d, i) => <div key={i} className="kd">{d}</div>)}</div>
        </div>)}

        {/* BENCHMARKS */}
        {tab === "benchmarks" && (<div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {Object.entries(BM).map(([k, s]) => <button key={k} className={"stb" + (sport === k ? " on" : "")} onClick={() => setSport(k)}>{s.e} {s.l}</button>)}
          </div>
          <div className="cd">
            <h3>{BM[sport].e} {BM[sport].l} - D1 Benchmarks</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="bt"><thead><tr><th>Metric</th><th>D1 Elite</th><th>D1 Offer</th><th>Walk-On</th><th>8th Target</th><th>Current</th></tr></thead>
                <tbody>{BM[sport].metrics.map((m, i) => {
                  const mk = sport + "-" + m.n;
                  return (<tr key={i}>
                    <td style={{ fontWeight: 600, color: "#E2E8F0" }}>{m.n}</td>
                    <td className="el">{m.el}</td><td className="ofr">{m.of}</td><td className="wk">{m.wk}</td>
                    <td style={{ color: "#4B5563", fontStyle: "italic", fontSize: 10 }}>{m.t8}</td>
                    <td>{measI === mk
                      ? <span><input className="inp" style={{ width: 80, display: "inline" }} value={iv} onChange={(e) => setIv(e.target.value)} onKeyDown={(e) => e.key === "Enter" && savM(sport, m.n)} autoFocus /> <button className="btn" onClick={() => savM(sport, m.n)}>Save</button></span>
                      : meas[mk]
                        ? <span style={{ color: "#10B981", fontFamily: "'Space Mono',monospace", fontSize: 11, cursor: "pointer" }} onClick={() => { setMeasI(mk); setIv(meas[mk].v); }}>{meas[mk].v} {"\u2713"}</span>
                        : <span style={{ color: "#374151", cursor: "pointer", fontSize: 10 }} onClick={() => { setMeasI(mk); setIv(""); }}>+ Log</span>
                    }</td>
                  </tr>);
                })}</tbody></table>
            </div>
          </div>
        </div>)}

        {/* PROGRESS CHART */}
        {tab === "progress" && (<div>
          <div className="cd" style={{ borderColor: "rgba(245,158,11,.2)" }}>
            <h3>{"\u{1F4C8}"} Measurables Progress Over Time</h3>
            <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14 }}>Track improvement. Coaches love trajectory. Dashed line = D1 scholarship benchmark.</p>
            <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
              {PME.map((m) => <button key={m.k} className={"stb" + (pm === m.k ? " on" : "")} style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setPm(m.k)}>{m.l}</button>)}
            </div>
            {pe.filter((e) => e[pm] != null).length > 0 ? (
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={pe.filter((e) => e[pm] != null)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                    <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 10 }} stroke="rgba(255,255,255,.06)" />
                    <YAxis tick={{ fill: "#64748B", fontSize: 10 }} stroke="rgba(255,255,255,.06)" reversed={pm !== "Vertical"} />
                    <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, color: "#E2E8F0", fontSize: 11 }} />
                    <ReferenceLine y={curMetric.d1} stroke="#EF4444" strokeDasharray="6 3" label={{ value: "D1: " + curMetric.d1 + curMetric.u, fill: "#EF4444", fontSize: 9 }} />
                    <Line type="monotone" dataKey={pm} stroke={curMetric.c} strokeWidth={3} dot={{ fill: curMetric.c, r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "#4B5563", fontStyle: "italic", padding: 20, textAlign: "center" }}>No entries yet. Add your first entry below to start tracking progress.</p>
            )}
          </div>
          <div className="cd">
            <h3>{"\u2795"} Add Entry</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 6, marginBottom: 10 }}>
              <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Date</label><input className="inp" placeholder={new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })} value={ne.date || ""} onChange={(e) => setNe((p) => ({ ...p, date: e.target.value }))} /></div>
              {PME.map((m) => <div key={m.k}><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>{m.l}</label><input className="inp" type="number" step="0.01" placeholder="-" value={ne[m.k] || ""} onChange={(e) => setNe((p) => ({ ...p, [m.k]: e.target.value ? parseFloat(e.target.value) : null }))} /></div>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn" style={{ padding: "8px 18px", fontSize: 12 }} onClick={addPE}>Save Entry</button>
              {entryMsg && <span style={{ fontSize: 11, color: entryMsg.includes("\u2705") ? "#10B981" : "#F59E0B", fontWeight: 600 }}>{entryMsg}</span>}
            </div>
          </div>
          {pe.length > 0 && <div className="cd"><h3>All Entries ({pe.length})</h3><table className="bt"><thead><tr><th>Date</th>{PME.map((m) => <th key={m.k}>{m.l}</th>)}<th></th></tr></thead><tbody>{pe.map((e, i) => <tr key={i}><td style={{ fontWeight: 600 }}>{e.date}</td>{PME.map((m) => <td key={m.k} style={{ fontFamily: "'Space Mono',monospace", color: e[m.k] ? "#10B981" : "#374151" }}>{e[m.k] || "-"}</td>)}<td><button onClick={() => { if (confirm("Delete this entry?")) setPe((p) => p.filter((_, j) => j !== i)); }} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 12 }}>{"\u{1F5D1}"}</button></td></tr>)}</tbody></table></div>}
        </div>)}

        {/* CAMPS */}
        {tab === "camps" && (<div>
          <div className="sg">
            <div className="scd"><div className="v" style={{ color: "#F59E0B" }}>{CAMPS.length}</div><div className="lb">Total</div></div>
            <div className="scd"><div className="v" style={{ color: "#3B82F6" }}>{regCount}</div><div className="lb">Registered</div></div>
            <div className="scd"><div className="v" style={{ color: "#10B981" }}>${totalSpend || 0}</div><div className="lb">Spent</div></div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
            {["all", "football", "basketball", "track"].map((f) => <button key={f} className={"stb" + (campFilt === f ? " on" : "")} style={{ fontSize: 10, padding: "4px 8px" }} onClick={() => setCampFilt(f)}>{f === "all" ? "All" : (SE[f] || "") + " " + f.charAt(0).toUpperCase() + f.slice(1)}</button>)}
          </div>
          {[1, 2, 3, 4].map((tier) => {
            const tc = CAMPS.filter((c) => (campFilt === "all" || c.sp === campFilt) && c.ti === tier);
            if (!tc.length) return null;
            return (<div key={tier}>
              <div style={{ padding: "8px 0 4px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: TCO[tier], fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Tier {tier}: {TL[tier]}</span>
                <div style={{ flex: 1, height: 1, background: TCO[tier] + "30" }} />
              </div>
              {tc.map((camp) => {
                const st = SO.find((s) => s.v === (campSt[camp.id] || "not-started"));
                const isExp = expCamp === camp.id;
                return (<div key={camp.id} className="cd" style={{ cursor: "pointer" }} onClick={() => setExpCamp(isExp ? null : camp.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span>{SE[camp.sp]}</span><span style={{ fontWeight: 600, fontSize: 13 }}>{camp.n}</span>
                        {camp.cl && <span className="bd" style={{ background: "rgba(16,185,129,.12)", color: "#10B981" }}>{"\u{1F4C5}"}</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "#4B5563", marginLeft: 22 }}>{camp.dt} | {camp.lo} | {camp.dr}</div>
                      <div style={{ marginLeft: 22, marginTop: 3 }}><span className="bd" style={{ background: st.c + "15", color: st.c }}>{st.l}</span></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <select className="sel" value={campSt[camp.id] || "not-started"} onClick={(e) => e.stopPropagation()} onChange={(e) => { e.stopPropagation(); setCampSt((p) => ({ ...p, [camp.id]: e.target.value })); }}>
                        {SO.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                      </select>
                      <Arr open={isExp} />
                    </div>
                  </div>
                  {isExp && (<div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.04)" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: "#4B5563" }}>Est: {camp.co}</span>
                      <span style={{ fontSize: 10, color: "#4B5563" }}>Actual: $</span>
                      <input className="inp" type="number" style={{ width: 70 }} value={campCo[camp.id] || ""} onClick={(e) => e.stopPropagation()} onChange={(e) => setCampCo((p) => ({ ...p, [camp.id]: e.target.value }))} />
                    </div>
                    {campCheckItems.map((item, i) => (<div key={i} className="mi" style={{ padding: "4px 2px" }} onClick={(e) => { e.stopPropagation(); setCampCk((p) => ({ ...p, [camp.id + "-" + i]: !p[camp.id + "-" + i] })); }}>
                      <div className={"ck" + (campCk[camp.id + "-" + i] ? " on" : "")} style={{ width: 14, height: 14 }}>{campCk[camp.id + "-" + i] && <Ico />}</div>
                      <span style={{ fontSize: 11, color: campCk[camp.id + "-" + i] ? "#4B5563" : "#CBD5E1", textDecoration: campCk[camp.id + "-" + i] ? "line-through" : "none" }}>{item}</span>
                    </div>))}
                  </div>)}
                </div>);
              })}
            </div>);
          })}
        </div>)}

        {/* OUTREACH */}
        {tab === "outreach" && (<div>
          <div className="cd" style={{ borderColor: "rgba(236,72,153,.15)" }}>
            <h3>{"\u{1F4E7}"} Coach Outreach</h3>
            <p style={{ fontSize: 11, color: "#94A3B8" }}><strong style={{ color: "#EC4899" }}>Key:</strong> D1 coaches cannot contact before June 15 after soph year. <strong style={{ color: "#10B981" }}>Athlete-initiated contact is ALWAYS allowed.</strong></p>
          </div>
          {OT.map((t, i) => (<div key={i} className="cd" style={{ cursor: "pointer" }} onClick={() => setExpTpl(expTpl === i ? -1 : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, fontSize: 13, color: "#E2E8F0" }}>{t.ph}</div><div style={{ fontSize: 10, color: "#4B5563", marginTop: 2 }}>Subject: {t.su}</div></div>
              <Arr open={expTpl === i} />
            </div>
            {expTpl === i && (<div style={{ marginTop: 10 }}>
              <pre style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, lineHeight: 1.7, color: "#94A3B8", whiteSpace: "pre-wrap", marginBottom: 10 }}>{t.bd}</pre>
              <div className="tip">
                <div style={{ fontWeight: 600, fontSize: 9, color: "#F59E0B", marginBottom: 4, fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>Tips</div>
                {t.tp.map((tip, j) => <div key={j} style={{ fontSize: 11, color: "#CBD5E1", padding: "2px 0" }}>{"\u2192"} {tip}</div>)}
              </div>
            </div>)}
          </div>))}
        </div>)}

        {/* COACH CONTACTS */}
        {tab === "contacts" && (<div>
          <div className="cd" style={{ borderColor: "rgba(245,158,11,.2)" }}>
            <h3>{"\u{1F4C7}"} Coach Contact Tracker</h3>
            <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 10 }}>Your recruiting CRM. Track every coach interaction across all three sports.</p>
            <button className="btn" onClick={() => setShowCf(!showCf)}>{showCf ? "Cancel" : "+ Add Coach"}</button>
          </div>
          {showCf && (<div className="cd">
            <h3>New Contact</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Name *</label><input className="inp" value={cf.name} onChange={(e) => setCf((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>School</label><input className="inp" value={cf.school} onChange={(e) => setCf((p) => ({ ...p, school: e.target.value }))} /></div>
              <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Sport</label><select className="sel" style={{ width: "100%", padding: "6px" }} value={cf.sport} onChange={(e) => setCf((p) => ({ ...p, sport: e.target.value }))}><option value="football">Football</option><option value="basketball">Basketball</option><option value="track">Track</option></select></div>
              <div><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Email</label><input className="inp" value={cf.email} onChange={(e) => setCf((p) => ({ ...p, email: e.target.value }))} /></div>
              <div style={{ gridColumn: "1/3" }}><label style={{ fontSize: 9, color: "#4B5563", textTransform: "uppercase" }}>Notes</label><input className="inp" value={cf.notes} onChange={(e) => setCf((p) => ({ ...p, notes: e.target.value }))} /></div>
            </div>
            <button className="btn" onClick={addCoach}>Save</button>
          </div>)}
          {coaches.length === 0
            ? <div className="cd"><p style={{ fontSize: 12, color: "#4B5563", fontStyle: "italic" }}>No contacts yet. Start adding after camps and outreach.</p></div>
            : coaches.map((c, i) => (<div key={c.id} className="cd">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}><span>{SE[c.sport]}</span><span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span><span className="bd" style={{ background: "rgba(255,255,255,.04)", color: "#94A3B8" }}>{c.school}</span></div>
                  {c.email && <div style={{ fontSize: 10, color: "#3B82F6", marginLeft: 22 }}>{c.email}</div>}
                  {c.notes && <div style={{ fontSize: 11, color: "#CBD5E1", marginLeft: 22, marginTop: 3, fontStyle: "italic" }}>{c.notes}</div>}
                </div>
                <select className="sel" value={c.st} onChange={(e) => { const u = [...coaches]; u[i] = { ...c, st: e.target.value }; setCoaches(u); }}>
                  <option value="initial">Initial</option><option value="emailed">Emailed</option><option value="responded">Responded</option><option value="relationship">Building</option><option value="recruiting">Recruiting</option><option value="cold">Cold</option>
                </select>
              </div>
              <div style={{ marginTop: 6, fontSize: 9, color: "#374151", fontFamily: "'Space Mono',monospace", marginLeft: 22 }}>Added: {c.dt}</div>
            </div>))}
        </div>)}

        {/* NCAA */}
        {tab === "ncaa" && (<div>
          <div className="cd">
            <h3>{"\u{1F393}"} NCAA Core Courses (D1)</h3>
            <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 12 }}><strong style={{ color: "#F59E0B" }}>16 core courses</strong> in grades 9-12.</p>
            <table className="bt"><thead><tr><th>Subject</th><th>Required</th><th>Details</th></tr></thead>
              <tbody>
                {NC.map((c, i) => <tr key={i}><td style={{ fontWeight: 600, color: "#E2E8F0" }}>{c.s}</td><td style={{ color: "#F59E0B", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{c.r}</td><td style={{ color: "#94A3B8" }}>{c.d}</td></tr>)}
                <tr style={{ borderTop: "2px solid rgba(245,158,11,.3)" }}><td style={{ fontWeight: 800, color: "#F59E0B" }}>TOTAL</td><td style={{ fontWeight: 800, color: "#F59E0B" }}>16</td><td style={{ color: "#94A3B8" }}>Grades 9-12</td></tr>
              </tbody></table>
          </div>
          <div className="cd">
            <h3>GPA/Test Sliding Scale</h3>
            <table className="bt"><thead><tr><th>Core GPA</th><th>SAT</th><th>ACT</th></tr></thead>
              <tbody>{NS.map((r, i) => <tr key={i}><td style={{ fontWeight: 700, color: "#10B981" }}>{r.g}</td><td>{r.s}</td><td>{r.a}</td></tr>)}</tbody></table>
          </div>
        </div>)}

        {/* VISIBILITY */}
        {tab === "visibility" && (<div>
          <div className="cd" style={{ borderColor: "rgba(139,92,246,.2)" }}>
            <h3>{"\u{1F4E1}"} Visibility = Talent x Exposure x Accessibility</h3>
            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7 }}>Most athletes miss D1 not from talent, but exposure or accessibility gaps.</p>
          </div>
          {[
            { t: "Digital Presence", items: ["Create recruiting email", "Film 2-3 sessions/week", "Build 1-page bio sheet", "Start measurables log"], c: "#3B82F6" },
            { t: "In-Person Exposure", items: ["Attend 1-2 prospect camps", "Join AAU/travel or track club", "Compete in combines/showcases"], c: "#10B981" },
            { t: "Social Media", items: ["Clean up all profiles", "Curate athletic highlights", "Follow target programs and coaches"], c: "#8B5CF6" },
          ].map((s, i) => (<div key={i} className="cd">
            <h3 style={{ color: s.c }}>{s.t}</h3>
            {s.items.map((item, j) => <div key={j} style={{ padding: "4px 0", fontSize: 12, color: "#CBD5E1", display: "flex", gap: 8 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: s.c, flexShrink: 0, marginTop: 5 }} />{item}</div>)}
          </div>))}
        </div>)}

        {/* SC SCHOOLS */}
        {tab === "schools" && (<div>
          <div className="cd"><h3>{"\u{1F3EB}"} SC D1 Schools ({SS.length})</h3><p style={{ fontSize: 11, color: "#94A3B8" }}>Click to expand. Set interest. Check Compare for side-by-side.</p></div>
          {SS.map((s, i) => (<div key={i} className="cd" style={{ borderColor: s.co + "30", cursor: "pointer" }} onClick={() => setExpSch(expSch === s.nm ? null : s.nm)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: s.co }} /><span style={{ fontWeight: 700, fontSize: 14, color: "#F1F5F9" }}>{s.nm}</span></div>
                <div style={{ marginLeft: 16, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <span className="bd" style={{ background: "rgba(255,255,255,.04)", color: "#94A3B8" }}>{s.cn}</span>
                  <span className="bd" style={{ background: "rgba(255,255,255,.04)", color: "#4B5563" }}>{s.ci} | {s.dr}</span>
                  {s.fb && <span className="bd" style={{ background: "rgba(245,158,11,.1)", color: "#F59E0B" }}>{"\u{1F3C8}"}{s.fb}</span>}
                  {s.bb && <span className="bd" style={{ background: "rgba(59,130,246,.1)", color: "#3B82F6" }}>{"\u{1F3C0}"}</span>}
                  {s.tf && <span className="bd" style={{ background: "rgba(16,185,129,.1)", color: "#10B981" }}>{"\u{1F3C3}"}</span>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
                <select className="sel" value={schInt[s.nm] || "none"} onClick={(e) => e.stopPropagation()} onChange={(e) => { e.stopPropagation(); setSchInt((p) => ({ ...p, [s.nm]: e.target.value })); }}>
                  <option value="none">Interest</option><option value="top">Top</option><option value="target">Target</option><option value="watching">Watch</option><option value="notfit">No</option>
                </select>
                <label style={{ fontSize: 9, color: "#4B5563", display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }} onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={cmpList.includes(s.nm)} onChange={(e) => { e.stopPropagation(); setCmpList((p) => p.includes(s.nm) ? p.filter((x) => x !== s.nm) : [...p, s.nm].slice(0, 4)); }} style={{ accentColor: "#F59E0B" }} />Compare
                </label>
              </div>
            </div>
            {expSch === s.nm && (<div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.04)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[["Size", s.sz], ["Tier", s.ti], ["Scholarships", s.sc], ["Academics", s.ac]].map(([lbl, val]) => (
                  <div key={lbl}><div style={{ fontSize: 8, color: "#374151", textTransform: "uppercase", letterSpacing: 1 }}>{lbl}</div><div style={{ fontSize: 12, color: "#CBD5E1" }}>{val}</div></div>
                ))}
              </div>
              <div className="tip"><div style={{ fontSize: 9, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Space Mono',monospace", marginBottom: 3 }}>Scouting Report</div><div style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.7 }}>{s.nt}</div></div>
            </div>)}
          </div>))}
        </div>)}

        {/* HIGH SCHOOLS */}
        {tab === "highschools" && (<div>
          <div className="cd" style={{ borderColor: "rgba(245,158,11,.2)" }}>
            <h3>{"\u{1F3C6}"} Midlands High School Programs (2026-2028 SCHSL)</h3>
            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7, marginBottom: 8 }}>
              All Midlands area high schools with their <strong style={{ color: "#F59E0B" }}>2026-2028 SCHSL classifications</strong>. Several schools changed classification levels for this cycle. Schools marked with arrows show their reclassification movement.
            </p>
            <p style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Understanding classifications matters for recruiting. A standout player at a smaller classification may get less exposure than an average player at 5A, so camp attendance and film become even more critical.</p>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
            {["all", "5A", "4A", "3A", "2A", "1A"].map((f) => (
              <button key={f} className={"stb" + (hsFilt === f ? " on" : "")} style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => setHsFilt(f)}>
                {f === "all" ? "All Classes" : f}
                {f !== "all" && <span style={{ marginLeft: 4, fontSize: 9, color: "#64748B" }}>({MIDLANDS_HS.filter((s) => s.cls === f).length})</span>}
              </button>
            ))}
          </div>

          {["5A", "4A", "3A", "2A", "1A"].filter((cls) => hsFilt === "all" || hsFilt === cls).map((cls) => {
            const schools = MIDLANDS_HS.filter((s) => s.cls === cls);
            if (!schools.length) return null;
            return (
              <div key={cls}>
                <div style={{ padding: "10px 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: CLS_COLORS[cls], fontFamily: "'Space Mono',monospace", letterSpacing: 1 }}>CLASS {cls}</span>
                  <span style={{ fontSize: 10, color: "#4B5563" }}>({schools.length} schools)</span>
                  <div style={{ flex: 1, height: 1, background: CLS_COLORS[cls] + "30" }} />
                </div>
                <div className="cd" style={{ overflowX: "auto" }}>
                  <table className="bt">
                    <thead><tr><th>School</th><th>City</th><th>County</th><th>Class</th><th>Change</th><th>Notes</th></tr></thead>
                    <tbody>
                      {schools.map((s, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: "#E2E8F0" }}>{s.name}</td>
                          <td>{s.city}</td>
                          <td style={{ color: "#94A3B8" }}>{s.county}</td>
                          <td><span className="bd" style={{ background: CLS_COLORS[cls] + "20", color: CLS_COLORS[cls] }}>{cls}</span></td>
                          <td>{s.change ? <span style={{ color: "#F59E0B", fontSize: 10, fontWeight: 600 }}>{s.change}</span> : <span style={{ color: "#374151" }}>-</span>}</td>
                          <td style={{ fontSize: 10, color: "#94A3B8", maxWidth: 200 }}>{s.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <div className="cd" style={{ borderColor: "rgba(16,185,129,.15)" }}>
            <h3>Strategic Notes for Recruiting</h3>
            <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.8 }}>
              <p><strong style={{ color: "#EF4444" }}>5A Programs (10 schools):</strong> Highest exposure. Coaches from USC, Clemson, and other Power 5 programs regularly attend these games. Dutch Fork is the premier D1 pipeline in the Midlands. Gray Collegiate jumping to 5A is a big story.</p>
              <p style={{ marginTop: 6 }}><strong style={{ color: "#F59E0B" }}>4A Programs (7 schools):</strong> Irmo dropping from 5A is huge. They were a 5A D2 runner-up and could dominate 4A. Great exposure with less competition for attention than 5A.</p>
              <p style={{ marginTop: 6 }}><strong style={{ color: "#3B82F6" }}>3A Programs (6 schools):</strong> Multiple schools dropped from 4A. Airport, Lower Richland, Gilbert, and Camden all bring 4A-level talent to 3A. These programs could produce college-level athletes who get overlooked without camps.</p>
              <p style={{ marginTop: 6 }}><strong style={{ color: "#8B5CF6" }}>2A Programs (12 schools):</strong> Orangeburg-Wilkinson, Keenan, and Newberry dropping from 3A. Athletes here need camps and highlight reels even more to get noticed.</p>
              <p style={{ marginTop: 6 }}><strong style={{ color: "#10B981" }}>1A Programs (14 schools):</strong> Biggest reclassification impact. Fairfield Central, Eau Claire, Batesburg-Leesville all dropped from 2A. Camp attendance is essential for D1 exposure at this level.</p>
            </div>
          </div>
        </div>)}

        {/* COMPARE */}
        {tab === "compare" && (<div>
          <div className="cd">
            <h3>{"\u{2696}\u{FE0F}"} School Comparison</h3>
            <p style={{ fontSize: 11, color: "#94A3B8" }}>{cmpList.length === 0 ? "No schools selected. Check Compare on up to 4 schools in the Schools tab." : "Comparing " + cmpList.length + " school" + (cmpList.length > 1 ? "s" : "") + ". Max 4."}</p>
          </div>
          {cmpList.length > 0 && (<div className="cd" style={{ overflowX: "auto" }}>
            <table className="bt">
              <thead><tr><th style={{ minWidth: 100 }}>Factor</th>{cmpList.map((nm) => { const s = SS.find((x) => x.nm === nm); return <th key={nm} style={{ minWidth: 130 }}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: s?.co }} />{nm.replace("University of ", "").replace(" University", "")}</div></th>; })}</tr></thead>
              <tbody>
                {[
                  { l: "Conference", k: "cn" }, { l: "Tier", k: "ti" }, { l: "City", k: "ci" }, { l: "Drive", k: "dr" }, { l: "Size", k: "sz" },
                  { l: "Football", fn: (s) => s.fb ? ("\u2705 " + s.fb) : "\u274C" },
                  { l: "Basketball", fn: (s) => s.bb ? "\u2705 D1" : "\u274C" },
                  { l: "Track", fn: (s) => s.tf ? "\u2705 D1" : "\u274C" },
                  { l: "Scholarships", k: "sc" }, { l: "Academics", k: "ac" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "#E2E8F0" }}>{row.l}</td>
                    {cmpList.map((nm) => { const s = SS.find((x) => x.nm === nm); return <td key={nm}>{row.fn ? row.fn(s) : (s?.[row.k] || "-")}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)}
        </div>)}

        {/* PARENT */}
        {tab === "parent" && (<div>
          <div className="ps">{PHASES.map((p) => <button key={p.id} className={"phb" + (phase === p.id ? " on" : "")} style={{ "--c": p.color }} onClick={() => setPhase(p.id)}>{p.id === 1 && <span className="nw">NOW</span>}{p.label}</button>)}</div>
          <div className="cd" style={{ borderColor: "rgba(245,158,11,.2)" }}>
            <h3>{"\u{1F469}\u{200D}\u{1F466}"} Parent Actions - Phase {phase}</h3>
            {(PARENT_ITEMS[phase] || []).map((item, i) => (<div key={i} className="mi" onClick={() => tog("p-" + phase + "-" + i)}>
              <div className={"ck" + (checks["p-" + phase + "-" + i] ? " on" : "")}>{checks["p-" + phase + "-" + i] && <Ico />}</div>
              <span style={{ fontSize: 12, color: checks["p-" + phase + "-" + i] ? "#4B5563" : "#CBD5E1", textDecoration: checks["p-" + phase + "-" + i] ? "line-through" : "none" }}>{item}</span>
            </div>))}
          </div>
          <div className="cd">
            <h3>Your Role by Phase</h3>
            <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.8 }}>
              <p><strong style={{ color: "#F59E0B" }}>8th:</strong> <strong>Architect</strong></p>
              <p><strong style={{ color: "#3B82F6" }}>9th:</strong> <strong>Project Manager</strong></p>
              <p><strong style={{ color: "#8B5CF6" }}>10th:</strong> <strong>Strategist</strong></p>
              <p><strong style={{ color: "#EF4444" }}>11th:</strong> <strong>Advisor</strong> (he leads)</p>
              <p><strong style={{ color: "#10B981" }}>12th:</strong> <strong>Closer</strong></p>
            </div>
          </div>
        </div>)}

      </div>
    </div>
  );
}
