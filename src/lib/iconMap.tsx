import {
  Blend, Bot, Building2, FileText, Frame,
  Layers, MessageSquareCode, Mic, QrCode, Quote, Settings,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './brandIcons';

export const ICON_MAP = {
  Blend,
  Bot,
  Building2,
  FileText,
  Frame,
  GithubIcon,
  Layers,
  LinkedinIcon,
  MessageSquareCode,
  Mic,
  QrCode,
  Quote,
  Settings,
} as const;

export type IconName = keyof typeof ICON_MAP;
