import { create } from 'zustand';
import api from '@/lib/api';

type Collection = {
  id: string;
  displayName: string;
};

type Item = {
  id: string;
  fieldData: Record<string, string>;
};

