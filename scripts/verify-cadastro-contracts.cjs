const path=require('path'),fs=require('fs'),Module=require('module'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ts=require(root+'/apps/frontend/node_modules/typescript');
function load(file){const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,file);return m.exports;}
const {buildPacientePayload}=load(root+'/apps/frontend/src/lib/paciente-payload.ts');
const {profissionalLabel}=load(root+'/apps/frontend/src/lib/profissional-label.ts');
const {ValidationPipe}=require(root+'/apps/backend/node_modules/@nestjs/common');
const {CreatePacienteDto}=require(root+'/apps/backend/dist/modules/pacientes/dto/create-paciente.dto');
(async()=>{
 const empty={nome:'Teste contrato',dataNascimento:'2018-03-02',sexo:'FEMININO',status:'ATIVO'};
 for(const key of ['cpf','escola','serie','turnoEscolar','nomeProf','coordenador','responsavelNome','responsavelTel','responsavelEmail','responsavelParentesco','responsavelProfissao','diagnosticoDesc','diagnosticoCid','medicamentos','alergias','observacoesMed','sensibilidadeSensorial','hiperfoco','observacoes'])empty[key]='';
 const pipe=new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true,transformOptions:{enableImplicitConversion:true}});
 for(const kin of ['MAE','PAI','AVO_M','AVO_P','AVO','TIO','TUTOR','OUTRO']){
  const payload=JSON.parse(JSON.stringify(buildPacientePayload({...empty,responsavelNome:'Responsável teste',responsavelParentesco:kin,alergias:' lactose, dipirona, ',medicamentos:' A, B ',sensibilidadeSensorial:'ruídos',hiperfoco:'letras',diagnosticoDesc:'Teste',valorConsulta:150})));
  const dto=await pipe.transform(payload,{type:'body',metatype:CreatePacienteDto});assert.deepStrictEqual(dto.alergias,['lactose','dipirona']);assert(!('cpf'in dto));assert(dto.observacoesMed.includes('ruídos'));assert(!('responsavelNome'in dto));
 }
 assert.strictEqual(profissionalLabel({usuario:{nome:'Doutora teste'},especialidade:'Psicologia'}),'Doutora teste (Psicologia)');assert(profissionalLabel(null));assert.throws(()=>buildPacientePayload({...empty,dataNascimento:'inválido'}));
 console.log('PASS: 8 parentescos, DTO estrito, listas clínicas, CPF opcional, nome de profissional e data inválida');
})().catch(e=>{console.error(e.message);process.exitCode=1});
