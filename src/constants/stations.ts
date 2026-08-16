export interface StationItem {
  code: string;
  name: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export const INDIAN_STATIONS: StationItem[] = [
  // Western Railway & Central Railway
  { code: "ST", name: "Surat Junction", city: "Surat", state: "Gujarat", latitude: 21.195, longitude: 72.829 },
  { code: "MMCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", latitude: 18.97, longitude: 72.819 },
  { code: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", city: "Mumbai", state: "Maharashtra", latitude: 18.94, longitude: 72.835 },
  { code: "LTT", name: "Lokmanya Tilak Terminus", city: "Mumbai", state: "Maharashtra", latitude: 19.069, longitude: 72.892 },
  { code: "BVI", name: "Borivali", city: "Mumbai", state: "Maharashtra", latitude: 19.23, longitude: 72.85 },
  { code: "TNA", name: "Thane", city: "Thane", state: "Maharashtra", latitude: 19.19, longitude: 72.98 },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad", state: "Gujarat", latitude: 23.023, longitude: 72.6 },
  { code: "BRC", name: "Vadodara Junction", city: "Vadodara", state: "Gujarat", latitude: 22.31, longitude: 73.18 },
  { code: "RTM", name: "Ratlam Junction", city: "Ratlam", state: "Madhya Pradesh", latitude: 23.33, longitude: 75.04 },
  { code: "PUNE", name: "Pune Junction", city: "Pune", state: "Maharashtra", latitude: 18.53, longitude: 73.87 },
  { code: "NGP", name: "Nagpur Junction", city: "Nagpur", state: "Maharashtra", latitude: 21.15, longitude: 79.09 },
  { code: "RJT", name: "Rajkot Junction", city: "Rajkot", state: "Gujarat", latitude: 22.31, longitude: 70.8 },
  { code: "BVC", name: "Bhavnagar Terminus", city: "Bhavnagar", state: "Gujarat", latitude: 21.77, longitude: 72.15 },
  { code: "VAPI", name: "Vapi", city: "Vapi", state: "Gujarat", latitude: 20.37, longitude: 72.9 },
  { code: "NK", name: "Nashik Road", city: "Nashik", state: "Maharashtra", latitude: 19.95, longitude: 73.83 },
  { code: "BSL", name: "Bhusaval Junction", city: "Bhusaval", state: "Maharashtra", latitude: 21.05, longitude: 75.8 },
  { code: "PVR", name: "Pandharpur", city: "Pandharpur", state: "Maharashtra", latitude: 17.67, longitude: 75.33 },
  { code: "KOP", name: "Kolhapur", city: "Kolhapur", state: "Maharashtra", latitude: 16.7, longitude: 74.24 },

  // Northern Railway & North Central Railway
  { code: "NDLS", name: "New Delhi", city: "New Delhi", state: "Delhi", latitude: 28.642, longitude: 77.222 },
  { code: "NZM", name: "Hazrat Nizamuddin", city: "New Delhi", state: "Delhi", latitude: 28.59, longitude: 77.25 },
  { code: "DLI", name: "Old Delhi Junction", city: "Delhi", state: "Delhi", latitude: 28.66, longitude: 77.23 },
  { code: "ANVT", name: "Anand Vihar Terminal", city: "Delhi", state: "Delhi", latitude: 28.65, longitude: 77.31 },
  { code: "DEC", name: "Delhi Cantt", city: "Delhi", state: "Delhi", latitude: 28.59, longitude: 77.12 },
  { code: "CNB", name: "Kanpur Central", city: "Kanpur", state: "Uttar Pradesh", latitude: 26.45, longitude: 80.35 },
  { code: "PRYJ", name: "Prayagraj Junction", city: "Prayagraj", state: "Uttar Pradesh", latitude: 25.44, longitude: 81.83 },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow", state: "Uttar Pradesh", latitude: 26.83, longitude: 80.92 },
  { code: "LJN", name: "Lucknow Junction", city: "Lucknow", state: "Uttar Pradesh", latitude: 26.83, longitude: 80.92 },
  { code: "BSB", name: "Varanasi Junction", city: "Varanasi", state: "Uttar Pradesh", latitude: 25.32, longitude: 82.98 },
  { code: "DDU", name: "Pt. Deen Dayal Upadhyaya Jn (Mughalsarai)", city: "Chandauli", state: "Uttar Pradesh", latitude: 25.28, longitude: 83.12 },
  { code: "GKP", name: "Gorakhpur Junction", city: "Gorakhpur", state: "Uttar Pradesh", latitude: 26.76, longitude: 83.37 },
  { code: "AGC", name: "Agra Cantt", city: "Agra", state: "Uttar Pradesh", latitude: 27.16, longitude: 78.01 },
  { code: "MTJ", name: "Mathura Junction", city: "Mathura", state: "Uttar Pradesh", latitude: 27.48, longitude: 77.67 },
  { code: "MB", name: "Moradabad Junction", city: "Moradabad", state: "Uttar Pradesh", latitude: 28.83, longitude: 78.78 },
  { code: "BE", name: "Bareilly Junction", city: "Bareilly", state: "Uttar Pradesh", latitude: 28.34, longitude: 79.42 },
  { code: "LDH", name: "Ludhiana Junction", city: "Ludhiana", state: "Punjab", latitude: 30.9, longitude: 75.85 },
  { code: "ASR", name: "Amritsar Junction", city: "Amritsar", state: "Punjab", latitude: 31.63, longitude: 74.87 },
  { code: "CDG", name: "Chandigarh Junction", city: "Chandigarh", state: "Chandigarh", latitude: 30.7, longitude: 76.78 },
  { code: "UMB", name: "Ambala Cantt", city: "Ambala", state: "Haryana", latitude: 30.34, longitude: 76.78 },
  { code: "JAT", name: "Jammu Tawi", city: "Jammu", state: "Jammu & Kashmir", latitude: 32.71, longitude: 74.88 },
  { code: "SVDK", name: "Shri Mata Vaishno Devi Katra", city: "Katra", state: "Jammu & Kashmir", latitude: 32.99, longitude: 74.93 },
  { code: "HW", name: "Haridwar Junction", city: "Haridwar", state: "Uttarakhand", latitude: 29.95, longitude: 78.16 },
  { code: "DDN", name: "Dehradun", city: "Dehradun", state: "Uttarakhand", latitude: 30.31, longitude: 78.03 },

  // Eastern Railway, East Central Railway, South Eastern Railway
  { code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", latitude: 22.583, longitude: 88.343 },
  { code: "SDAH", name: "Sealdah", city: "Kolkata", state: "West Bengal", latitude: 22.57, longitude: 88.37 },
  { code: "KOAA", name: "Kolkata Chitpur Terminus", city: "Kolkata", state: "West Bengal", latitude: 22.6, longitude: 88.37 },
  { code: "KGP", name: "Kharagpur Junction", city: "Kharagpur", state: "West Bengal", latitude: 22.33, longitude: 87.32 },
  { code: "NJP", name: "New Jalpaiguri (Siliguri)", city: "Siliguri", state: "West Bengal", latitude: 26.68, longitude: 88.44 },
  { code: "PNBE", name: "Patna Junction", city: "Patna", state: "Bihar", latitude: 25.6, longitude: 85.13 },
  { code: "PPTA", name: "Patliputra Junction", city: "Patna", state: "Bihar", latitude: 25.622, longitude: 85.069 },
  { code: "GAYA", name: "Gaya Junction", city: "Gaya", state: "Bihar", latitude: 24.8, longitude: 85.0 },
  { code: "DBG", name: "Darbhanga Junction", city: "Darbhanga", state: "Bihar", latitude: 26.15, longitude: 85.9 },
  { code: "MFP", name: "Muzaffarpur Junction", city: "Muzaffarpur", state: "Bihar", latitude: 26.12, longitude: 85.38 },
  { code: "BJU", name: "Barauni Junction", city: "Barauni", state: "Bihar", latitude: 25.47, longitude: 86.02 },
  { code: "RNC", name: "Ranchi Junction", city: "Ranchi", state: "Jharkhand", latitude: 23.35, longitude: 85.33 },
  { code: "DHN", name: "Dhanbad Junction", city: "Dhanbad", state: "Jharkhand", latitude: 23.79, longitude: 86.43 },
  { code: "TATA", name: "Tatanagar Junction (Jamshedpur)", city: "Jamshedpur", state: "Jharkhand", latitude: 22.77, longitude: 86.19 },
  { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar", state: "Odisha", latitude: 20.27, longitude: 85.84 },
  { code: "PURI", name: "Puri", city: "Puri", state: "Odisha", latitude: 19.81, longitude: 85.83 },
  { code: "CTC", name: "Cuttack Junction", city: "Cuttack", state: "Odisha", latitude: 20.46, longitude: 85.88 },

  // Southern Railway & South Central Railway & South Western Railway
  { code: "MAS", name: "Chennai Central", city: "Chennai", state: "Tamil Nadu", latitude: 13.08, longitude: 80.27 },
  { code: "MS", name: "Chennai Egmore", city: "Chennai", state: "Tamil Nadu", latitude: 13.08, longitude: 80.26 },
  { code: "SBC", name: "KSR Bengaluru", city: "Bengaluru", state: "Karnataka", latitude: 12.97, longitude: 77.57 },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru", state: "Karnataka", latitude: 13.02, longitude: 77.55 },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru", state: "Karnataka", latitude: 12.31, longitude: 76.65 },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad", state: "Telangana", latitude: 17.39, longitude: 78.47 },
  { code: "SC", name: "Secunderabad Junction", city: "Hyderabad", state: "Telangana", latitude: 17.43, longitude: 78.5 },
  { code: "BZA", name: "Vijayawada Junction", city: "Vijayawada", state: "Andhra Pradesh", latitude: 16.51, longitude: 80.62 },
  { code: "VSKP", name: "Visakhapatnam Junction", city: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.72, longitude: 83.29 },
  { code: "TPTY", name: "Tirupati", city: "Tirupati", state: "Andhra Pradesh", latitude: 13.63, longitude: 79.42 },
  { code: "TVC", name: "Thiruvananthapuram Central", city: "Thiruvananthapuram", state: "Kerala", latitude: 8.49, longitude: 76.95 },
  { code: "ERS", name: "Ernakulam Junction (Kochi)", city: "Kochi", state: "Kerala", latitude: 9.97, longitude: 76.28 },
  { code: "CLT", name: "Kozhikode (Calicut)", city: "Kozhikode", state: "Kerala", latitude: 11.25, longitude: 75.78 },
  { code: "MDU", name: "Madurai Junction", city: "Madurai", state: "Tamil Nadu", latitude: 9.92, longitude: 78.11 },
  { code: "CBE", name: "Coimbatore Junction", city: "Coimbatore", state: "Tamil Nadu", latitude: 11.0, longitude: 76.96 },

  // West Central & North Western & South East Central
  { code: "JP", name: "Jaipur Junction", city: "Jaipur", state: "Rajasthan", latitude: 26.92, longitude: 75.79 },
  { code: "JU", name: "Jodhpur Junction", city: "Jodhpur", state: "Rajasthan", latitude: 26.28, longitude: 73.02 },
  { code: "UJR", name: "Udaipur City", city: "Udaipur", state: "Rajasthan", latitude: 24.58, longitude: 73.69 },
  { code: "AII", name: "Ajmer Junction", city: "Ajmer", state: "Rajasthan", latitude: 26.45, longitude: 74.63 },
  { code: "KOTA", name: "Kota Junction", city: "Kota", state: "Rajasthan", latitude: 25.21, longitude: 75.86 },
  { code: "SG", name: "Suratgarh Junction", city: "Suratgarh", state: "Rajasthan", latitude: 29.32, longitude: 73.9 },
  { code: "BPL", name: "Bhopal Junction", city: "Bhopal", state: "Madhya Pradesh", latitude: 23.26, longitude: 77.41 },
  { code: "RKMP", name: "Rani Kamlapati", city: "Bhopal", state: "Madhya Pradesh", latitude: 23.22, longitude: 77.44 },
  { code: "INDB", name: "Indore Junction", city: "Indore", state: "Madhya Pradesh", latitude: 22.71, longitude: 75.86 },
  { code: "JBP", name: "Jabalpur Junction", city: "Jabalpur", state: "Madhya Pradesh", latitude: 23.16, longitude: 79.95 },
  { code: "GWL", name: "Gwalior Junction", city: "Gwalior", state: "Madhya Pradesh", latitude: 26.21, longitude: 78.18 },
  { code: "R", name: "Raipur Junction", city: "Raipur", state: "Chhattisgarh", latitude: 21.25, longitude: 81.63 },
  { code: "BSP", name: "Bilaspur Junction", city: "Bilaspur", state: "Chhattisgarh", latitude: 22.08, longitude: 82.15 },

  // North East Frontier Railway
  { code: "GHY", name: "Guwahati", city: "Guwahati", state: "Assam", latitude: 26.18, longitude: 91.75 },
  { code: "DBRG", name: "Dibrugarh", city: "Dibrugarh", state: "Assam", latitude: 27.47, longitude: 94.91 },
  { code: "AGTL", name: "Agartala", city: "Agartala", state: "Tripura", latitude: 23.83, longitude: 91.28 },
  { code: "SILR", name: "Silchar", city: "Silchar", state: "Assam", latitude: 24.82, longitude: 92.8 },
];
