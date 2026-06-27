-- Inicialização do banco de dados Instituto Conectar
-- Este script roda apenas na primeira criação do container

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- Full-text search com trigrams
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- Busca sem acentuação
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- Índices GIN para JSONB

-- Configuração de timezone
SET timezone = 'America/Sao_Paulo';
