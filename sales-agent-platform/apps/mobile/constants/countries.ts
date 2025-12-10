export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾' },
  { name: 'Afghanistan', code: 'AF', dialCode: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', dialCode: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
  { name: 'Brunei', code: 'BN', dialCode: '+673', flag: '🇧🇳' },
  { name: 'Cambodia', code: 'KH', dialCode: '+855', flag: '🇰🇭' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷' },
  { name: 'Hong Kong', code: 'HK', dialCode: '+852', flag: '🇭🇰' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', dialCode: '+98', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', dialCode: '+964', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', dialCode: '+962', flag: '🇯🇴' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼' },
  { name: 'Laos', code: 'LA', dialCode: '+856', flag: '🇱🇦' },
  { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: '🇱🇧' },
  { name: 'Macau', code: 'MO', dialCode: '+853', flag: '🇲🇴' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { name: 'Myanmar', code: 'MM', dialCode: '+95', flag: '🇲🇲' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', dialCode: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭' },
  { name: 'Taiwan', code: 'TW', dialCode: '+886', flag: '🇹🇼' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷' },
  { name: 'Ukraine', code: 'UA', dialCode: '+380', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳' },
].sort((a, b) => a.name.localeCompare(b.name));

// Move Malaysia to the top
const malaysiaIndex = COUNTRIES.findIndex((c) => c.code === 'MY');
if (malaysiaIndex > 0) {
  const malaysia = COUNTRIES[malaysiaIndex];
  COUNTRIES.splice(malaysiaIndex, 1);
  COUNTRIES.unshift(malaysia);
}

export const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === 'MY') || COUNTRIES[0];

