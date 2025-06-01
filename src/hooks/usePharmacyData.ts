
import { useState, useEffect } from 'react';
import { Product, Movement, Alert, WhatsAppConfig } from '@/types/pharmacy';

// Produtos iniciais pré-cadastrados
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'analgesico',
    brand: 'EMS',
    unit: 'caixa',
    costPrice: 5.50,
    sellPrice: 8.90,
    stock: 150,
    minStock: 20,
    expirationDate: '2025-12-31',
    barcode: '7891234567890',
    description: 'Analgésico e antitérmico para dores leves a moderadas',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ibuprofeno 600mg',
    category: 'antinflamatorio',
    brand: 'Medley',
    unit: 'caixa',
    costPrice: 12.80,
    sellPrice: 18.50,
    stock: 80,
    minStock: 15,
    expirationDate: '2025-11-30',
    barcode: '7891234567891',
    description: 'Anti-inflamatório não esteroidal para dores e inflamações',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Dipirona 500mg',
    category: 'analgesico',
    brand: 'Neo Química',
    unit: 'caixa',
    costPrice: 4.20,
    sellPrice: 6.80,
    stock: 200,
    minStock: 25,
    expirationDate: '2026-01-15',
    barcode: '7891234567892',
    description: 'Analgésico e antitérmico de ação rápida',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Amoxicilina 875mg',
    category: 'antibiotico',
    brand: 'Eurofarma',
    unit: 'caixa',
    costPrice: 15.30,
    sellPrice: 23.90,
    stock: 60,
    minStock: 10,
    expirationDate: '2025-08-20',
    barcode: '7891234567893',
    description: 'Antibiótico de amplo espectro para infecções bacterianas',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Vitamina C 1g',
    category: 'vitamina',
    brand: 'Sanofi',
    unit: 'frasco',
    costPrice: 18.70,
    sellPrice: 28.90,
    stock: 45,
    minStock: 8,
    expirationDate: '2026-03-10',
    barcode: '7891234567894',
    description: 'Suplemento vitamínico para fortalecimento do sistema imunológico',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Omeprazol 20mg',
    category: 'outros',
    brand: 'Ranbaxy',
    unit: 'caixa',
    costPrice: 8.90,
    sellPrice: 14.50,
    stock: 120,
    minStock: 18,
    expirationDate: '2025-10-25',
    barcode: '7891234567895',
    description: 'Inibidor da bomba de prótons para tratamento de úlceras',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Shampoo Anticaspa 400ml',
    category: 'higiene',
    brand: 'Vichy',
    unit: 'frasco',
    costPrice: 32.50,
    sellPrice: 48.90,
    stock: 25,
    minStock: 5,
    expirationDate: '2026-06-30',
    barcode: '7891234567896',
    description: 'Shampoo dermatológico para controle da caspa',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Protetor Solar FPS 60',
    category: 'dermocosmetico',
    brand: 'La Roche-Posay',
    unit: 'bisnaga',
    costPrice: 45.80,
    sellPrice: 68.90,
    stock: 35,
    minStock: 6,
    expirationDate: '2026-04-15',
    barcode: '7891234567897',
    description: 'Protetor solar facial com alta proteção UVA/UVB',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Cetoconazol 2% Creme',
    category: 'dermocosmetico',
    brand: 'Globo',
    unit: 'bisnaga',
    costPrice: 12.40,
    sellPrice: 19.90,
    stock: 50,
    minStock: 8,
    expirationDate: '2025-09-12',
    barcode: '7891234567898',
    description: 'Antifúngico tópico para tratamento de micoses',
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Losartana 50mg',
    category: 'outros',
    brand: 'EMS',
    unit: 'caixa',
    costPrice: 6.70,
    sellPrice: 11.20,
    stock: 90,
    minStock: 12,
    expirationDate: '2025-12-05',
    barcode: '7891234567899',
    description: 'Anti-hipertensivo para controle da pressão arterial',
    createdAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Dorflex',
    category: 'analgesico',
    brand: 'Sanofi',
    unit: 'caixa',
    costPrice: 9.80,
    sellPrice: 15.50,
    stock: 110,
    minStock: 15,
    expirationDate: '2026-02-28',
    barcode: '7891234567800',
    description: 'Analgésico com relaxante muscular',
    createdAt: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Xarope Vick 44',
    category: 'outros',
    brand: 'P&G',
    unit: 'frasco',
    costPrice: 14.20,
    sellPrice: 21.90,
    stock: 40,
    minStock: 7,
    expirationDate: '2025-11-18',
    barcode: '7891234567801',
    description: 'Xarope expectorante para tosse produtiva',
    createdAt: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Complexo B',
    category: 'vitamina',
    brand: 'Catarinense',
    unit: 'frasco',
    costPrice: 11.50,
    sellPrice: 17.80,
    stock: 65,
    minStock: 10,
    expirationDate: '2026-05-22',
    barcode: '7891234567802',
    description: 'Complexo vitamínico do grupo B',
    createdAt: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Azitromicina 500mg',
    category: 'antibiotico',
    brand: 'Medley',
    unit: 'caixa',
    costPrice: 18.90,
    sellPrice: 29.50,
    stock: 30,
    minStock: 5,
    expirationDate: '2025-07-14',
    barcode: '7891234567803',
    description: 'Antibiótico macrolídeo para infecções respiratórias',
    createdAt: new Date().toISOString()
  },
  {
    id: '15',
    name: 'Hidratante Corporal 200ml',
    category: 'higiene',
    brand: 'Nivea',
    unit: 'frasco',
    costPrice: 15.40,
    sellPrice: 23.90,
    stock: 55,
    minStock: 9,
    expirationDate: '2026-08-30',
    barcode: '7891234567804',
    description: 'Hidratante corporal para pele seca',
    createdAt: new Date().toISOString()
  },
  {
    id: '16',
    name: 'Metformina 850mg',
    category: 'outros',
    brand: 'Neo Química',
    unit: 'caixa',
    costPrice: 7.30,
    sellPrice: 12.50,
    stock: 85,
    minStock: 13,
    expirationDate: '2025-10-08',
    barcode: '7891234567805',
    description: 'Antidiabético para controle da glicemia',
    createdAt: new Date().toISOString()
  },
  {
    id: '17',
    name: 'Sabonete Líquido Antisséptico',
    category: 'higiene',
    brand: 'Granado',
    unit: 'frasco',
    costPrice: 8.60,
    sellPrice: 13.90,
    stock: 75,
    minStock: 12,
    expirationDate: '2026-07-20',
    barcode: '7891234567806',
    description: 'Sabonete líquido com ação antisséptica',
    createdAt: new Date().toISOString()
  },
  {
    id: '18',
    name: 'Nimesulida 100mg',
    category: 'antinflamatorio',
    brand: 'Eurofarma',
    unit: 'caixa',
    costPrice: 10.80,
    sellPrice: 16.90,
    stock: 70,
    minStock: 11,
    expirationDate: '2025-09-25',
    barcode: '7891234567807',
    description: 'Anti-inflamatório para dores e febre',
    createdAt: new Date().toISOString()
  },
  {
    id: '19',
    name: 'Pomada Bepantol',
    category: 'dermocosmetico',
    brand: 'Bayer',
    unit: 'bisnaga',
    costPrice: 16.20,
    sellPrice: 24.90,
    stock: 42,
    minStock: 7,
    expirationDate: '2026-01-30',
    barcode: '7891234567808',
    description: 'Pomada regeneradora para pele irritada',
    createdAt: new Date().toISOString()
  },
  {
    id: '20',
    name: 'Captopril 25mg',
    category: 'outros',
    brand: 'EMS',
    unit: 'caixa',
    costPrice: 5.90,
    sellPrice: 9.80,
    stock: 95,
    minStock: 14,
    expirationDate: '2025-11-12',
    barcode: '7891234567809',
    description: 'Inibidor da ECA para hipertensão',
    createdAt: new Date().toISOString()
  },
  {
    id: '21',
    name: 'Clonazepam 2mg',
    category: 'outros',
    brand: 'Roche',
    unit: 'caixa',
    costPrice: 12.50,
    sellPrice: 19.90,
    stock: 25,
    minStock: 5,
    expirationDate: '2025-08-15',
    barcode: '7891234567810',
    description: 'Ansiolítico benzodiazepínico',
    createdAt: new Date().toISOString()
  },
  {
    id: '22',
    name: 'Vitamina D3 2000UI',
    category: 'vitamina',
    brand: 'Addera',
    unit: 'frasco',
    costPrice: 22.80,
    sellPrice: 34.90,
    stock: 38,
    minStock: 6,
    expirationDate: '2026-04-28',
    barcode: '7891234567811',
    description: 'Suplemento de vitamina D para ossos e imunidade',
    createdAt: new Date().toISOString()
  },
  {
    id: '23',
    name: 'Cefalexina 500mg',
    category: 'antibiotico',
    brand: 'Ranbaxy',
    unit: 'caixa',
    costPrice: 14.70,
    sellPrice: 22.90,
    stock: 45,
    minStock: 8,
    expirationDate: '2025-06-30',
    barcode: '7891234567812',
    description: 'Antibiótico cefalosporina para infecções',
    createdAt: new Date().toISOString()
  },
  {
    id: '24',
    name: 'Protetor Labial FPS 30',
    category: 'dermocosmetico',
    brand: 'Episol',
    unit: 'unidade',
    costPrice: 8.90,
    sellPrice: 14.50,
    stock: 60,
    minStock: 10,
    expirationDate: '2026-03-15',
    barcode: '7891234567813',
    description: 'Protetor labial com proteção solar',
    createdAt: new Date().toISOString()
  },
  {
    id: '25',
    name: 'Ácido Fólico 5mg',
    category: 'vitamina',
    brand: 'Medley',
    unit: 'caixa',
    costPrice: 6.40,
    sellPrice: 10.90,
    stock: 80,
    minStock: 12,
    expirationDate: '2026-02-18',
    barcode: '7891234567814',
    description: 'Vitamina B9 para gestantes e anemia',
    createdAt: new Date().toISOString()
  },
  {
    id: '26',
    name: 'Desodorante Antitranspirante',
    category: 'higiene',
    brand: 'Rexona',
    unit: 'unidade',
    costPrice: 7.20,
    sellPrice: 11.90,
    stock: 90,
    minStock: 15,
    expirationDate: '2026-09-10',
    barcode: '7891234567815',
    description: 'Desodorante com proteção 48h',
    createdAt: new Date().toISOString()
  },
  {
    id: '27',
    name: 'Diclofenaco Gel 1%',
    category: 'antinflamatorio',
    brand: 'Voltaren',
    unit: 'bisnaga',
    costPrice: 18.50,
    sellPrice: 28.90,
    stock: 35,
    minStock: 6,
    expirationDate: '2025-12-20',
    barcode: '7891234567816',
    description: 'Anti-inflamatório tópico para dores musculares',
    createdAt: new Date().toISOString()
  },
  {
    id: '28',
    name: 'Simeticona 40mg',
    category: 'outros',
    brand: 'EMS',
    unit: 'caixa',
    costPrice: 8.30,
    sellPrice: 13.50,
    stock: 65,
    minStock: 10,
    expirationDate: '2026-01-25',
    barcode: '7891234567817',
    description: 'Antiflatulento para gases intestinais',
    createdAt: new Date().toISOString()
  },
  {
    id: '29',
    name: 'Loratadina 10mg',
    category: 'outros',
    brand: 'Neo Química',
    unit: 'caixa',
    costPrice: 9.70,
    sellPrice: 15.80,
    stock: 55,
    minStock: 9,
    expirationDate: '2025-10-14',
    barcode: '7891234567818',
    description: 'Anti-histamínico para alergias',
    createdAt: new Date().toISOString()
  },
  {
    id: '30',
    name: 'Creme Dental Sensodyne',
    category: 'higiene',
    brand: 'GSK',
    unit: 'unidade',
    costPrice: 11.80,
    sellPrice: 18.90,
    stock: 72,
    minStock: 12,
    expirationDate: '2026-05-30',
    barcode: '7891234567819',
    description: 'Creme dental para dentes sensíveis',
    createdAt: new Date().toISOString()
  },
  {
    id: '31',
    name: 'Prednisolona 20mg',
    category: 'antinflamatorio',
    brand: 'Pharmacia',
    unit: 'caixa',
    costPrice: 13.90,
    sellPrice: 21.50,
    stock: 28,
    minStock: 5,
    expirationDate: '2025-07-22',
    barcode: '7891234567820',
    description: 'Corticosteroide anti-inflamatório',
    createdAt: new Date().toISOString()
  },
  {
    id: '32',
    name: 'Sulfato Ferroso 40mg',
    category: 'vitamina',
    brand: 'Catarinense',
    unit: 'frasco',
    costPrice: 8.60,
    sellPrice: 14.20,
    stock: 48,
    minStock: 8,
    expirationDate: '2026-03-08',
    barcode: '7891234567821',
    description: 'Suplemento de ferro para anemia',
    createdAt: new Date().toISOString()
  },
  {
    id: '33',
    name: 'Álcool Gel 70%',
    category: 'higiene',
    brand: 'Rioquímica',
    unit: 'frasco',
    costPrice: 4.50,
    sellPrice: 7.90,
    stock: 120,
    minStock: 20,
    expirationDate: '2026-12-31',
    barcode: '7891234567822',
    description: 'Álcool gel antisséptico para mãos',
    createdAt: new Date().toISOString()
  },
  {
    id: '34',
    name: 'Fluconazol 150mg',
    category: 'antibiotico',
    brand: 'Eurofarma',
    unit: 'caixa',
    costPrice: 16.40,
    sellPrice: 25.90,
    stock: 32,
    minStock: 6,
    expirationDate: '2025-09-18',
    barcode: '7891234567823',
    description: 'Antifúngico para candidíase',
    createdAt: new Date().toISOString()
  },
  {
    id: '35',
    name: 'Colágeno Hidrolisado',
    category: 'vitamina',
    brand: 'Sanavita',
    unit: 'frasco',
    costPrice: 28.90,
    sellPrice: 42.50,
    stock: 25,
    minStock: 5,
    expirationDate: '2026-06-15',
    barcode: '7891234567824',
    description: 'Suplemento de colágeno para pele e articulações',
    createdAt: new Date().toISOString()
  },
  {
    id: '36',
    name: 'Esmalte Fortalecedor',
    category: 'dermocosmetico',
    brand: 'Sally Hansen',
    unit: 'unidade',
    costPrice: 12.70,
    sellPrice: 19.90,
    stock: 40,
    minStock: 7,
    expirationDate: '2026-08-25',
    barcode: '7891234567825',
    description: 'Esmalte fortalecedor para unhas fracas',
    createdAt: new Date().toISOString()
  },
  {
    id: '37',
    name: 'Prednisona 5mg',
    category: 'antinflamatorio',
    brand: 'Medley',
    unit: 'caixa',
    costPrice: 11.20,
    sellPrice: 17.80,
    stock: 38,
    minStock: 6,
    expirationDate: '2025-11-30',
    barcode: '7891234567826',
    description: 'Corticosteroide para processos inflamatórios',
    createdAt: new Date().toISOString()
  },
  {
    id: '38',
    name: 'Solução Fisiológica 500ml',
    category: 'outros',
    brand: 'Halex Istar',
    unit: 'frasco',
    costPrice: 3.20,
    sellPrice: 5.90,
    stock: 150,
    minStock: 25,
    expirationDate: '2026-04-12',
    barcode: '7891234567827',
    description: 'Solução salina estéril para lavagem',
    createdAt: new Date().toISOString()
  },
  {
    id: '39',
    name: 'Vitamina E 400UI',
    category: 'vitamina',
    brand: 'Nature Made',
    unit: 'frasco',
    costPrice: 19.80,
    sellPrice: 29.90,
    stock: 35,
    minStock: 6,
    expirationDate: '2026-07-08',
    barcode: '7891234567828',
    description: 'Antioxidante para proteção celular',
    createdAt: new Date().toISOString()
  },
  {
    id: '40',
    name: 'Escova Dental Macia',
    category: 'higiene',
    brand: 'Oral-B',
    unit: 'unidade',
    costPrice: 5.40,
    sellPrice: 8.90,
    stock: 85,
    minStock: 15,
    expirationDate: '2027-01-01',
    barcode: '7891234567829',
    description: 'Escova dental com cerdas macias',
    createdAt: new Date().toISOString()
  },
  {
    id: '41',
    name: 'Ciprofloxacino 500mg',
    category: 'antibiotico',
    brand: 'EMS',
    unit: 'caixa',
    costPrice: 17.30,
    sellPrice: 26.80,
    stock: 30,
    minStock: 5,
    expirationDate: '2025-08-28',
    barcode: '7891234567830',
    description: 'Antibiótico quinolona para infecções urinárias',
    createdAt: new Date().toISOString()
  },
  {
    id: '42',
    name: 'Creme Anti-idade',
    category: 'dermocosmetico',
    brand: 'Eucerin',
    unit: 'frasco',
    costPrice: 42.60,
    sellPrice: 62.90,
    stock: 20,
    minStock: 4,
    expirationDate: '2026-05-18',
    barcode: '7891234567831',
    description: 'Creme facial anti-idade com ácido hialurônico',
    createdAt: new Date().toISOString()
  },
  {
    id: '43',
    name: 'Bromoprida 10mg',
    category: 'outros',
    brand: 'Neo Química',
    unit: 'caixa',
    costPrice: 7.80,
    sellPrice: 12.90,
    stock: 50,
    minStock: 8,
    expirationDate: '2025-12-15',
    barcode: '7891234567832',
    description: 'Antiemético para náuseas e vômitos',
    createdAt: new Date().toISOString()
  },
  {
    id: '44',
    name: 'Absorvente Noturno',
    category: 'higiene',
    brand: 'Always',
    unit: 'unidade',
    costPrice: 8.20,
    sellPrice: 13.50,
    stock: 60,
    minStock: 10,
    expirationDate: '2027-06-30',
    barcode: '7891234567833',
    description: 'Absorvente íntimo noturno com abas',
    createdAt: new Date().toISOString()
  },
  {
    id: '45',
    name: 'Ômega 3 1000mg',
    category: 'vitamina',
    brand: 'Vitafor',
    unit: 'frasco',
    costPrice: 24.50,
    sellPrice: 36.90,
    stock: 28,
    minStock: 5,
    expirationDate: '2026-02-28',
    barcode: '7891234567834',
    description: 'Suplemento de ácidos graxos essenciais',
    createdAt: new Date().toISOString()
  },
  {
    id: '46',
    name: 'Dexametasona 4mg',
    category: 'antinflamatorio',
    brand: 'Aché',
    unit: 'caixa',
    costPrice: 9.40,
    sellPrice: 15.20,
    stock: 42,
    minStock: 7,
    expirationDate: '2025-10-30',
    barcode: '7891234567835',
    description: 'Corticosteroide potente anti-inflamatório',
    createdAt: new Date().toISOString()
  },
  {
    id: '47',
    name: 'Fralda Geriátrica G',
    category: 'higiene',
    brand: 'Tena',
    unit: 'unidade',
    costPrice: 18.90,
    sellPrice: 28.50,
    stock: 25,
    minStock: 5,
    expirationDate: '2027-03-20',
    barcode: '7891234567836',
    description: 'Fralda descartável para adultos tamanho G',
    createdAt: new Date().toISOString()
  },
  {
    id: '48',
    name: 'Levotiroxina 50mcg',
    category: 'outros',
    brand: 'Merck',
    unit: 'caixa',
    costPrice: 14.80,
    sellPrice: 22.90,
    stock: 35,
    minStock: 6,
    expirationDate: '2025-09-05',
    barcode: '7891234567837',
    description: 'Hormônio da tireoide para hipotireoidismo',
    createdAt: new Date().toISOString()
  },
  {
    id: '49',
    name: 'Proteína Whey',
    category: 'vitamina',
    brand: 'Optimum',
    unit: 'frasco',
    costPrice: 68.90,
    sellPrice: 98.50,
    stock: 15,
    minStock: 3,
    expirationDate: '2026-08-15',
    barcode: '7891234567838',
    description: 'Suplemento proteico para atletas',
    createdAt: new Date().toISOString()
  },
  {
    id: '50',
    name: 'Termômetro Digital',
    category: 'outros',
    brand: 'G-Tech',
    unit: 'unidade',
    costPrice: 12.50,
    sellPrice: 19.90,
    stock: 30,
    minStock: 5,
    expirationDate: '2028-12-31',
    barcode: '7891234567839',
    description: 'Termômetro digital clínico',
    createdAt: new Date().toISOString()
  },
  {
    id: '51',
    name: 'Enxaguante Bucal',
    category: 'higiene',
    brand: 'Listerine',
    unit: 'frasco',
    costPrice: 9.30,
    sellPrice: 15.50,
    stock: 45,
    minStock: 8,
    expirationDate: '2026-11-22',
    barcode: '7891234567840',
    description: 'Enxaguante bucal antisséptico',
    createdAt: new Date().toISOString()
  },
  {
    id: '52',
    name: 'Rivotril 0,5mg',
    category: 'outros',
    brand: 'Roche',
    unit: 'caixa',
    costPrice: 15.20,
    sellPrice: 23.80,
    stock: 18,
    minStock: 3,
    expirationDate: '2025-06-18',
    barcode: '7891234567841',
    description: 'Ansiolítico benzodiazepínico',
    createdAt: new Date().toISOString()
  },
  {
    id: '53',
    name: 'Polivitamínico A-Z',
    category: 'vitamina',
    brand: 'Centrum',
    unit: 'frasco',
    costPrice: 26.40,
    sellPrice: 38.90,
    stock: 32,
    minStock: 6,
    expirationDate: '2026-04-30',
    barcode: '7891234567842',
    description: 'Complexo multivitamínico completo',
    createdAt: new Date().toISOString()
  }
];

export const usePharmacyData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    phoneNumber: '',
    enabled: false
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('pharmacy-products');
    const savedMovements = localStorage.getItem('pharmacy-movements');
    const savedAlerts = localStorage.getItem('pharmacy-alerts');
    const savedWhatsapp = localStorage.getItem('pharmacy-whatsapp');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Se não há produtos salvos, usar os produtos iniciais
      setProducts(initialProducts);
      // Criar movimentos de cadastro para todos os produtos iniciais
      const initialMovements = initialProducts.map(product => ({
        id: `mov-${product.id}`,
        productId: product.id,
        productName: product.name,
        type: 'cadastro' as const,
        quantity: product.stock,
        reason: 'Cadastro inicial do produto',
        date: product.createdAt,
        user: 'Sistema'
      }));
      setMovements(initialMovements);
    }

    if (savedMovements) setMovements(JSON.parse(savedMovements));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    if (savedWhatsapp) setWhatsappConfig(JSON.parse(savedWhatsapp));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pharmacy-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pharmacy-movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('pharmacy-alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('pharmacy-whatsapp', JSON.stringify(whatsappConfig));
  }, [whatsappConfig]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    // Add cadastro movement
    const movement: Movement = {
      id: Date.now().toString(),
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'cadastro',
      quantity: product.stock,
      reason: 'Cadastro inicial do produto',
      date: new Date().toISOString(),
      user: 'Sistema'
    };
    
    setMovements(prev => [...prev, movement]);
    checkStockAlert(newProduct);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    setMovements(prev => prev.filter(movement => movement.productId !== id));
    setAlerts(prev => prev.filter(alert => alert.productId !== id));
  };

  const addMovement = (productId: string, type: 'entrada' | 'saida', quantity: number, reason: string, unitPrice?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const movement: Movement = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type,
      quantity,
      unitPrice,
      totalValue: unitPrice ? unitPrice * quantity : undefined,
      reason,
      date: new Date().toISOString(),
      user: 'Usuário'
    };

    setMovements(prev => [...prev, movement]);

    // Update product stock
    const newStock = type === 'entrada' 
      ? product.stock + quantity 
      : product.stock - quantity;

    updateProduct(productId, { stock: Math.max(0, newStock) });
    
    // Check for stock alerts
    const updatedProduct = { ...product, stock: Math.max(0, newStock) };
    checkStockAlert(updatedProduct);
  };

  const checkStockAlert = (product: Product) => {
    const totalEntries = movements
      .filter(m => m.productId === product.id && (m.type === 'entrada' || m.type === 'cadastro'))
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const alertThreshold = totalEntries * 0.15; // 15% of total entries
    
    if (product.stock <= alertThreshold && product.stock <= product.minStock) {
      const existingAlert = alerts.find(a => a.productId === product.id && !a.resolved);
      
      if (!existingAlert) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          productId: product.id,
          productName: product.name,
          currentStock: product.stock,
          minStock: product.minStock,
          percentage: totalEntries > 0 ? (product.stock / totalEntries) * 100 : 0,
          createdAt: new Date().toISOString(),
          resolved: false
        };
        
        setAlerts(prev => [...prev, newAlert]);
        
        // Simulate WhatsApp notification (in real app, this would call an API)
        if (whatsappConfig.enabled && whatsappConfig.phoneNumber) {
          console.log(`📱 WhatsApp Alert to ${whatsappConfig.phoneNumber}: Produto ${product.name} com estoque baixo (${product.stock} unidades)`);
        }
      }
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return {
    products,
    movements,
    alerts,
    whatsappConfig,
    addProduct,
    updateProduct,
    removeProduct,
    addMovement,
    resolveAlert,
    setWhatsappConfig
  };
};
