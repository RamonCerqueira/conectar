const assert = require('node:assert/strict');
const { JwtAuthGuard } = require('../apps/backend/dist/modules/auth/guards/jwt-auth.guard');
const base = Object.getPrototypeOf(JwtAuthGuard.prototype);
base.canActivate = async () => true;
const reflector = { getAllAndOverride: () => false };
const prisma = { responsavel: {findUnique: async () => ({pacienteId:'child-a',ativoPortal:true})}, exercicioCasa:{findUnique:async () => ({pacienteId:'child-a'})} };
const guard = new JwtAuthGuard(reflector,prisma);
function context(method,path,body={},perfil='PAIS') { const req = {method,path,body,user:{id:'parent-a',perfil}}; return {getHandler:()=>null,getClass:()=>null,switchToHttp:()=>({getRequest:()=>req})}; }
(async()=>{
 for (const path of ['/api/pacientes/child-a','/api/pacientes/child-a/agendamentos','/api/prontuarios/paciente/child-a','/api/arquivos/paciente/child-a']) assert.equal(await guard.canActivate(context('GET',path)),true);
 for (const path of ['/api/pacientes/child-b','/api/pacientes','/api/financeiro','/api/usuarios','/api/chat-interno']) await assert.rejects(guard.canActivate(context('GET',path)),/restrito/);
 assert.equal(await guard.canActivate(context('PUT','/api/exercicios/ex-a',{realizado:true})),true);
 await assert.rejects(guard.canActivate(context('PUT','/api/exercicios/ex-a',{realizado:true,pacienteId:'child-b'})),/restrito/);
 await assert.rejects(guard.canActivate(context('POST','/api/agenda',{pacienteId:'child-b'})),/restrito/);
 assert.equal(await guard.canActivate(context('GET','/api/usuarios',{},'ADMINISTRADOR')),true);
 prisma.responsavel.findUnique=async()=>({pacienteId:'child-a',ativoPortal:false});
 await assert.rejects(guard.canActivate(context('GET','/api/pacientes/child-a')),/desativado/);
 console.log('Portal: isolamento por criança, campos de resposta e acesso administrativo validados.');
})().catch(error=>{console.error(error);process.exitCode=1});
