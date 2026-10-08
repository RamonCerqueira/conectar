import { api, BASE_API_URL } from './api';
export async function downloadDocument(endpoint: string, name: string) {
 const response=await api.get(endpoint,{responseType:'blob'});const url=URL.createObjectURL(response.data);
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
export function storagePath(value?: string): string | null {
 if (!value) return null;try { const u=new URL(value,BASE_API_URL);return u.pathname.startsWith('/storage/') ? u.pathname : null; } catch {return null;}
}
export async function openMaterial(value: string, name='material') {
 const path=storagePath(value);if(path) return downloadDocument(`/arquivos/download?path=${encodeURIComponent(path)}`,name);
 const url=new URL(value);if(!['https:','http:'].includes(url.protocol))throw Error('Link inválido.');window.open(url.href,'_blank','noopener,noreferrer');
}
