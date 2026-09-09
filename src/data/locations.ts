export interface DistrictBlockMap {
  [district: string]: string[];
}

export interface StateData {
  name: string;
  districts: DistrictBlockMap;
}

export const INDIAN_STATES_DATA: Record<string, DistrictBlockMap> = {
  Odisha: {
    Angul: ['Angul', 'Athamallik', 'Banarpal', 'Chhendipada', 'Kaniha', 'Kishorenagar', 'Pallahara', 'Talcher'],
    Balangir: ['Agapur', 'Balangir', 'Bangomunda', 'Belpada', 'Deogaon', 'Gudvella', 'Khaprakhol', 'Loisingha', 'Muribahal', 'Patnagarh', 'Puintala', 'Saintala', 'Titilagarh', 'Turekela'],
    Balasore: ['Bahanaga', 'Balasore', 'Baliapal', 'Basta', 'Bhograi', 'Jaleswar', 'Khaira', 'Nilgiri', 'Oupada', 'Remuna', 'Simulia', 'Soro'],
    Bargarh: ['Ambabhona', 'Attabira', 'Barpali', 'Bargarh', 'Bhatli', 'Bheden', 'Bijepur', 'Gaisilet', 'Jharbandh', 'Padampur', 'Paikmal', 'Sohela'],
    Bhadrak: ['Basudevpur', 'Bhadrak', 'Bhandaripokhari', 'Bonth', 'Chandabali', 'Dhamanagar', 'Tihidi'],
    Boudh: ['Boudh', 'Harbhanga', 'Kantamal'],
    Cuttack: ['Athagarh', 'Banki', 'Baramba', 'Barang', 'Cuttack Sadar', 'Kantapada', 'Mahanga', 'Narasinghpur', 'Niali', 'Nischintakoili', 'Salepur', 'Tangi-Choudwar', 'Tigiria'],
    Deogarh: ['Barkote', 'Reamal', 'Tileibani'],
    Dhenkanal: ['Bhuban', 'Dhenkanal Sadar', 'Gondia', 'Hindol', 'Kamakhyanagar', 'Kankadahad', 'Odishapada', 'Parjang'],
    Gajapati: ['Gosani', 'Guma', 'Kashinagar', 'Mohana', 'Nuagada', 'R.Udayagiri', 'Rayagada'],
    Ganjam: ['Aska', 'Bellaguntha', 'Bhanjanagar', 'Buguda', 'Chhatrapur', 'Chikiti', 'Digapahandi', 'Ganjam', 'Hinjilicut', 'Jagannathprasad', 'Kabisuryanagar', 'Khallikote', 'Kukudakhandi', 'Patrapur', 'Polasara', 'Purushottampur', 'Rangeilunda', 'Sanakhemundi', 'Sheragada', 'Surada'],
    Jagatsinghpur: ['Balikuda', 'Biridi', 'Erasama', 'Jagatsinghpur', 'Kujang', 'Naugaon', 'Raghunathpur', 'Tirtol'],
    Jajpur: ['Badachana', 'Bari', 'Binjharpur', 'Danagadi', 'Dasarathpur', 'Dharmasala', 'Jajpur', 'Korei', 'Rasulpur', 'Sukinda'],
    Jharsuguda: ['Jharsuguda', 'Kolabira', 'Kirmira', 'Laikera', 'Lakhanpur'],
    Kalahandi: ['Bhawanipatna', 'Dharamgarh', 'Golamunda', 'Jaipatna', 'Junagarh', 'Kalampur', 'Karlamunda', 'Kesinga', 'Koksara', 'Lanjigarh', 'Madanpur Rampur', 'Narala', 'Thuamul Rampur'],
    Kandhamal: ['Baliguda', 'Chakapada', 'Daringbadi', 'G.Udayagiri', 'K.Nuagaon', 'Khajuripada', 'Kotagarh', 'Phiringia', 'Phulbani', 'Raikia', 'Tikabali', 'Tumudibandha'],
    Kendrapara: ['Aul', 'Derabish', 'Garadpur', 'Kendrapara', 'Mahakalapada', 'Marshaghai', 'Pattamundai', 'Rajkanika', 'Rajnagar'],
    Keonjhar: ['Anandapur', 'Banspal', 'Champua', 'Ghasipura', 'Ghatgaon', 'Harichandanpur', 'Hatadihi', 'Jhumpura', 'Joda', 'Keonjhar Sadar', 'Patna', 'Saharpada', 'Telkoi'],
    Khordha: ['Balianta', 'Balipatna', 'Banapur', 'Begunia', 'Bhubaneswar', 'Bolagarh', 'Chilika', 'Jatni', 'Khordha', 'Tangi'],
    Koraput: ['Bandhugaon', 'Borigumma', 'Dasamantapur', 'Jeypore', 'Koraput', 'Kotpad', 'Kundura', 'Lamtaput', 'Laxmipur', 'Nandapur', 'Narayanpatna', 'Pottangi', 'Semiliguda'],
    Malkangiri: ['Chitrakonda', 'Kalimela', 'Khairput', 'Korkunda', 'Malkangiri', 'Mathili', 'Podia'],
    Mayurbhanj: ['Badasahi', 'Bahalda', 'Bangriposi', 'Baripada', 'Betnoti', 'Bijatala', 'Bisoi', 'Gopabandhunagar', 'Jamda', 'Jashipur', 'Kaptipada', 'Karanjia', 'Khunta', 'Kuliana', 'Kusumi', 'Morada', 'Rairangpur', 'Raruan', 'Rasgovindpur', 'Samakhunta', 'Saraskana', 'Sukruli', 'Suliapada', 'Thakurmunda', 'Tiring', 'Udala'],
    Nabarangpur: ['Chandahandi', 'Dabugaon', 'Jharigaon', 'Kosagumuda', 'Nabarangpur', 'Nandahandi', 'Papadahandi', 'Raighar', 'Tentulikhunti', 'Umerkote'],
    Nayagarh: ['Bhapur', 'Daspalla', 'Gania', 'Khandapada', 'Nayagarh', 'Nuagaon', 'Odagaon', 'Ranpur'],
    Nuapada: ['Boden', 'Komna', 'Khariar', 'Nuapada', 'Sinapali'],
    Puri: ['Astrang', 'Brahmagiri', 'Delang', 'Gop', 'Kakatpur', 'Kanas', 'Krushnaprasad', 'Nimapara', 'Pipili', 'Puri Sadar', 'Satyabadi'],
    Rayagada: ['Bissam Cuttack', 'Chandrapur', 'Gudari', 'Gunupur', 'Kalyansinghpur', 'Kashipur', 'Kolnara', 'Muniguda', 'Padmapur', 'Ramanaguda', 'Rayagada'],
    Sambalpur: ['Bamra', 'Dhankauda', 'Jamankira', 'Jujumura', 'Kuchinda', 'Maneswar', 'Naktideul', 'Rairakhol', 'Rengali'],
    Subarnapur: ['Birmaharajpur', 'Dunguripali', 'Sonepur', 'Tarva', 'Ullunda'],
    Sundargarh: ['Balisankara', 'Bargaon', 'Bisra', 'Bonaigarh', 'Gurundia', 'Hemgir', 'Koilada', 'Kuarmunda', 'Kutra', 'Lathikata', 'Lahunipara', 'Lephripara', 'Nuagaon', 'Rajgangpur', 'Subdega', 'Sundargarh', 'Tangarpali']
  },
  'West Bengal': {
    Kolkata: ['Central Kolkata', 'North Kolkata', 'South Kolkata', 'East Kolkata'],
    Howrah: ['Bally', 'Howrah Sadar', 'Uluberia I', 'Uluberia II', 'Shyampur I', 'Amta I'],
    'North 24 Parganas': ['Barasat I', 'Barrackpore I', 'Habra I', 'Basirhat I', 'Bangaon'],
    'South 24 Parganas': ['Baruipur', 'Canning I', 'Diamond Harbour I', 'Kakdwip', 'Bhangar I'],
    Hooghly: ['Chinsurah-Mogra', 'Serampore-Uttarpara', 'Chandannagar', 'Arambagh', 'Tarakeswar'],
    Paschim_Medinipur: ['Midnapore Sadar', 'Kharagpur I', 'Debra', 'Dantan I', 'Ghatal'],
    Jhargram: ['Jhargram', 'Binpur I', 'Gopiballavpur I', 'Nayagram', 'Sankrail'],
    Purba_Medinipur: ['Tamluk', 'Haldia', 'Contai I', 'Egra I', 'Nandigram I']
  },
  'Andhra Pradesh': {
    Visakhapatnam: ['Anandapuram', 'Bheemunipatnam', 'Gajuwaka', 'Pendurthi', 'Visakhapatnam Urban'],
    Srikakulam: ['Srikakulam', 'Amadalavalasa', 'Ichchapuram', 'Narasannapeta', 'Palasa', 'Tekkali'],
    Vizianagaram: ['Vizianagaram', 'Bobbili', 'Cheepurupalli', 'Gajapathinagaram', 'Salur'],
    'East Godavari': ['Rajahmundry Urban', 'Kakinada Urban', 'Amalapuram', 'Peddapuram', 'Ramachandrapuram'],
    Krishna: ['Vijayawada Urban', 'Machilipatnam', 'Gudivada', 'Nuzvid', 'Jaggayyapeta'],
    Guntur: ['Guntur Urban', 'Tenali', 'Narasaraopet', 'Mangalagiri', 'Bapatla']
  },
  Jharkhand: {
    Ranchi: ['Ranchi Sadar', 'Kanke', 'Namkum', 'Ormanjhi', 'Ratu', 'Bundu'],
    'East Singhbhum (Jamshedpur)': ['Golmuri-cum-Jugsalai', 'Ghatshila', 'Potka', 'Baharagora', 'Musabani'],
    Dhanbad: ['Dhanbad', 'Jharia', 'Baghmara', 'Govindpur', 'Nirsa'],
    Bokaro: ['Chas', 'Bermo', 'Chandankiyari', 'Gumia', 'Petarwar'],
    Hazaribagh: ['Hazaribagh Sadar', 'Barhi', 'Barkagaon', 'Chouparan', 'Ichak']
  },
  Bihar: {
    Patna: ['Patna Sadar', 'Danapur', 'Phulwari Sharif', 'Barh', 'Masaurhi', 'Mokama'],
    Gaya: ['Gaya Town', 'Bodh Gaya', 'Sherghati', 'Tekari', 'Wazirganj'],
    Muzaffarpur: ['Mushahari', 'Kanti', 'Motipur', 'Paroo', 'Sahebganj'],
    Bhagalpur: ['Jagdishpur', 'Nathnagar', 'Sultanganj', 'Kahalgaon', 'Naugachhia']
  },
  Delhi: {
    'Central Delhi': ['Kotwali', 'Civil Lines', 'Karol Bagh'],
    'New Delhi': ['Chanakyapuri', 'Connaught Place', 'Parliament Street'],
    'South Delhi': ['Hauz Khas', 'Mehrauli', 'Saket'],
    'North Delhi': ['Model Town', 'Narela', 'Alipur'],
    'East Delhi': ['Gandhi Nagar', 'Preet Vihar', 'Mayur Vihar']
  },
  Maharashtra: {
    Mumbai_City: ['Colaba', 'Marine Lines', 'Byculla', 'Dadar', 'Worli'],
    'Mumbai Suburban': ['Andheri', 'Bandra', 'Borivali', 'Kurla', 'Ghatkopar'],
    Pune: ['Haveli', 'Pune City', 'Khed', 'Baramati', 'Shirur', 'Ambegaon'],
    Nagpur: ['Nagpur Urban', 'Nagpur Rural', 'Kamthi', 'Katol', 'Umred'],
    Thane: ['Thane', 'Kalyan', 'Ulhasnagar', 'Bhiwandi', 'Mira-Bhayandar']
  },
  Karnataka: {
    'Bengaluru Urban': ['Bengaluru North', 'Bengaluru South', 'Bengaluru East', 'Anekal'],
    Mysuru: ['Mysuru', 'Nanjangud', 'Hunsur', 'T. Narasipura', 'K.R. Nagar'],
    Dharwad: ['Dharwad', 'Hubballi Urban', 'Hubballi Rural', 'Kundgol', 'Navalgund'],
    Mangaluru_Dakshina_Kannada: ['Mangaluru', 'Bantwal', 'Belthangady', 'Puttur', 'Sullia']
  },
  'Tamil Nadu': {
    Chennai: ['Tondiarpet', 'Royapuram', 'Anna Nagar', 'Mylapore', 'Guindy', 'Adyar'],
    Coimbatore: ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam', 'Sulur'],
    Madurai: ['Madurai North', 'Madurai South', 'Melur', 'Thirumangalam', 'Vadipatti']
  },
  'Uttar Pradesh': {
    Lucknow: ['Lucknow Sadar', 'Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj'],
    Kanpur_Nagar: ['Kanpur Sadar', 'Bilhaur', 'Ghatampur'],
    Varanasi: ['Varanasi Sadar', 'Pindra', 'Rohaniya'],
    Prayagraj: ['Sadar', 'Phulpur', 'Koraon', 'Karchhana', 'Handia'],
    Noida_Gautam_Buddha_Nagar: ['Dadri', 'Jewar', 'Noida Sadar']
  },
  Rajasthan: {
    Jaipur: ['Jaipur', 'Amber', 'Sanganer', 'Chaksu', 'Bassai'],
    Jodhpur: ['Jodhpur', 'Luni', 'Bilara', 'Osian', 'Phalodi'],
    Udaipur: ['Girwa', 'Badgaon', 'Mavli', 'Vallabhnagar', 'Kherwara']
  },
  Gujarat: {
    Ahmedabad: ['Ahmedabad City', 'Daskroi', 'Sanand', 'Dholka', 'Viramgam'],
    Surat: ['Surat City', 'Chorasi', 'Olpad', 'Bardoli', 'Kamrej'],
    Vadodara: ['Vadodara', 'Padra', 'Karjan', 'Dabhoi', 'Savli']
  },
  'Madhya Pradesh': {
    Bhopal: ['Huzur', 'Berasia', 'Kolar'],
    Indore: ['Indore', 'Mhow', 'Depalpur', 'Sanwer'],
    Gwalior: ['Gwalior', 'Dabra', 'Bhitarwar']
  },
  Kerala: {
    Thiruvananthapuram: ['Thiruvananthapuram', 'Neyyattinkara', 'Nedumangad', 'Chirayinkeezhu'],
    Ernakulam: ['Kochi', 'Kanayannur', 'Aluva', 'Kunnathunad', 'Paravur'],
    Kozhikode: ['Kozhikode', 'Vadakara', 'Koyilandy', 'Thamarassery']
  },
  Punjab: {
    Amritsar: ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Baba Bakala'],
    Ludhiana: ['Ludhiana (East)', 'Ludhiana (West)', 'Jagraon', 'Samrala', 'Payal'],
    Jalandhar: ['Jalandhar-I', 'Jalandhar-II', 'Nakodar', 'Phillaur', 'Shahkot']
  },
  Haryana: {
    Gurugram: ['Gurugram', 'Sohna', 'Pataudi', 'Badshahpur'],
    Faridabad: ['Faridabad', 'Ballabgarh', 'Badkhal'],
    Ambala: ['Ambala', 'Ambala Cantt', 'Barara', 'Naraingarh']
  },
  Assam: {
    Kamrup_Metropolitan: ['Guwahati', 'Dispur', 'Sonapur', 'Chandrapur'],
    Cachar: ['Silchar', 'Sonai', 'Lakhipur', 'Katigorah'],
    Dibrugarh: ['Dibrugarh (East)', 'Dibrugarh (West)', 'Chabua', 'Naharkatia', 'Tingkhong']
  },
  Chhattisgarh: {
    Raipur: ['Raipur', 'Arang', 'Abhanpur', 'Tilda'],
    Bilaspur: ['Bilaspur', 'Bilha', 'Kota', 'Masturi', 'Takhatpur'],
    Durg: ['Durg', 'Patan', 'Dhamdha', 'Bhilai']
  },
  Telangana: {
    Hyderabad: ['Charminar', 'Khairatabad', 'Secunderabad', 'Serilingampally', 'Golconda'],
    Medchal_Malkajgiri: ['Malkajgiri', 'Kukatpally', 'Quthbullapur', 'Alwal', 'Medchal'],
    Warangal: ['Warangal', 'Hanamkonda', 'Kazipet', 'Wardhannapet']
  }
};

export const ALL_INDIAN_STATES: string[] = Object.keys(INDIAN_STATES_DATA);

export function getDistrictsForState(state: string): string[] {
  if (!state || !INDIAN_STATES_DATA[state]) return [];
  return Object.keys(INDIAN_STATES_DATA[state]);
}

export function getBlocksForDistrict(state: string, district: string): string[] {
  if (!state || !district || !INDIAN_STATES_DATA[state] || !INDIAN_STATES_DATA[state][district]) {
    return [];
  }
  return INDIAN_STATES_DATA[state][district];
}
