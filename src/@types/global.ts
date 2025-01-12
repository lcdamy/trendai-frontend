export type NavProps = {
  isDashboard: boolean;
  names?: string;
  type?: string;
};

export type ButtonProps = {
  onClick: () => void;
  text: string;
  className: string;
  type: "submit" | "button";
};

export type UserType = "brand" | "influencer";

export interface SignupFormData {
  name: string;
  email: string;
  type: UserType;
  password: string;
  confirmPassword: string;
}

export interface SignupValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  type?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface CampaignFormData {
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CampaignValidationErrors {
  title?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export type CampaignFormProps = {
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  // onChange: (date: Date | null) => void;
  fieldName: "startDate" | "endDate";
};

export type CampaignComponentProps = {
  image: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  link: string;
  hasActions: boolean;
  handleShowCreateCampaign?: () => void;
  id?: string;
  status?: string;
  setRefetch?: () => void;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export interface TableRows {
  social?: string;
  content?: string;
  createdAt?: string;
  link?: string;
  status: string;
  actions: React.ReactNode;
  _id: string;
}

export type TableProps = {
  rows: TableRows[];
};

export type SocialMedia = "Instagram" | "Tiktok";

export interface ContentFormData {
  link: string;
  social: SocialMedia;
}

export interface ContentFormValidationErrors {
  link?: string;
  social?: string;
}

export interface CampaignFetchData {
  _id: string;
  title: string;
  start_date: string;
  end_date: string;
  image: string;
  desc: string;
  status: string;
  setRefetch?:() => void;
}

export type campaignTypes = {
  _id: string;
  start_date: string;
  end_date: string;
  image: string;
  desc: string;
  title: string;
};

export type influencerTypes = {
  _id?: string;
  email:string;
};