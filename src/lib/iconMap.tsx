import {
  Blend, Mic, Frame, QrCode,
  Building2, FileText, Layers, MessageSquareCode,
  Settings, Quote,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './brandIcons';

export const ICON_MAP = {
  Blend,
  Mic,
  Frame,
  QrCode,
  Building2,
  FileText,
  Layers,
  MessageSquareCode,
  Settings,
  GithubIcon,
  LinkedinIcon,
  Quote,
} as const;

export type IconName = keyof typeof ICON_MAP;
