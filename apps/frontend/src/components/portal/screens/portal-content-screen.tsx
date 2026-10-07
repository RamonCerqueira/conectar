"use client";
import { FileText, BookOpen, ExternalLink } from "lucide-react";
import { BASE_API_URL } from "@/lib/api";
interface Props { exercicios: any[]; arquivos?: any[]; onCompleteExercise: (exercise:any) => void; }
function resourceUrl(path?:string) {
  if (!path) return null;
  try { const url = new URL(path, BASE_API_URL.replace(/\/api$/, "")); return ["https:","http:"].includes(url.protocol) ? url.href : null; } catch { return null; }
}
export function PortalContentScreen({ exercicios, arquivos = [], onCompleteExercise }: Props) {
  return <div className="space-y-4 pb-4"><div><h1 className="text-xl font-bold">Conteúdos e atividades</h1><p className="text-sm text-gray-500 mt-1">Materiais cadastrados pela equipe para sua criança.</p></div>
  <section className="space-y-3"><h2 className="font-bold flex gap-2"><BookOpen size={18}/>Atividades em casa</h2>{exercicios.length ? exercicios.map(ex => <article key={ex.id} className="rounded-2xl bg-white p-5 border border-purple-100 space-y-3"><h3 className="font-bold">{ex.titulo}</h3><p className="text-sm text-gray-600 whitespace-pre-wrap">{ex.descricao}</p>{resourceUrl(ex.url || ex.caminho) && <a href={resourceUrl(ex.url || ex.caminho)!} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-sm inline-flex gap-2 items-center">Abrir material<ExternalLink size={14}/></a>}<button disabled={ex.realizado === true} onClick={()=>onCompleteExercise(ex)} className="block w-full rounded-xl p-3 bg-purple-600 text-white disabled:bg-green-100 disabled:text-green-800">{ex.realizado ? "Atividade realizada" : "Marcar como realizada"}</button></article>) : <p className="rounded-2xl bg-white p-5 text-sm text-gray-500">Nenhuma atividade cadastrada no momento.</p>}</section>
  <section className="space-y-3"><h2 className="font-bold flex gap-2"><FileText size={18}/>Documentos</h2>{arquivos.length ? arquivos.map(file => <article key={file.id} className="rounded-2xl bg-white p-5 border border-purple-100"><p className="font-semibold">{file.nome}</p>{resourceUrl(file.caminho) && <a href={resourceUrl(file.caminho)!} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-sm mt-2 inline-block">Abrir documento</a>}</article>) : <p className="rounded-2xl bg-white p-5 text-sm text-gray-500">Ainda não há documentos cadastrados.</p>}</section></div>;
}
