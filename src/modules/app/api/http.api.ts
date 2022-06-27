import axios from 'axios';
import { POKEMON_API_URL } from '@/constants';

export const http = axios.create({
  baseURL: POKEMON_API_URL,
  responseType: 'json'
});
