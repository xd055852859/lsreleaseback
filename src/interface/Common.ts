import { User } from "./User";

export interface ResultProps {
  msg: string;
  data: any;
  status: number;
  pageNum?: number;
  totalNum?: number;
  total?: number;
}
export interface Domain {
  regionCode: string;
  logo: string;
  name: string;
  banner: string[] | null;
  clientKey: string;
  level: number;
}

export interface Tag {
  _key: string;
  icon?: string;
  name: string;
  type: string;
  unit?: string;
}
export interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
  codeName: string | undefined;
  fullAreaName: string | undefined;
}

export interface Comment {
  content: string;
  createTime: number;
  creatorInfo: User;
  targetUserInfo?: User;
  targetContent?: string;
  _key: string;
}
export interface Chart {
  value: number;
  name: string;
}

export const ROLE_OPTIONS = [
  {
    label: "超管",
    value: 0,
  },
  {
    label: "管理员",
    value: 1,
  },
  {
    label: "编辑",
    value: 2,
  },
  {
    label: "作者",
    value: 3,
  },
  {
    label: "只读",
    value: 4,
  },
];