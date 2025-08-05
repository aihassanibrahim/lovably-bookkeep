# Changelog

Alla viktiga ändringar i BizPal kommer att dokumenteras i denna fil.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
och detta projekt följer [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Ny strukturerad sidomeny med collapsible-sektioner
- Quick Actions för "Ny intäkt" och "Ny utgift"
- Förbättrad dashboard med affärsöversikt
- Mobile navigation med bottom bar och slide-out menu
- Supabase-integration för all affärsdata
- Row Level Security (RLS) för användardata

### Changed
- Migrerat från localStorage till Supabase för affärsdata
- Uppdaterat orders-schema för förenklad struktur
- Förbättrat UI/UX med moderna komponenter

### Fixed
- Användardata-isolering mellan olika konton
- Responsiv design för mobil och desktop

## [1.0.0] - 2025-08-04

### Added
- Grundläggande ekonomisystem
- Användarautentisering med Supabase
- Orderhantering
- Kundhantering
- Produkthantering
- Transaktionshantering
- Tema-stöd (ljus/mörk)
- Responsiv design

### Security
- Row Level Security implementerat
- Säker användarautentisering
- Databas-migrationer med RLS-policies 