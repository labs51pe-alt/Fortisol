
export interface Region {
  id: string;
  name: string;
  provinces: Province[];
}

export interface Province {
  id: string;
  name: string;
  districts: string[];
}

export const PERU_LOCATIONS: Region[] = [
  {
    id: "01",
    name: "Amazonas",
    provinces: [
      { id: "0101", name: "Chachapoyas", districts: ["Chachapoyas", "Asuncion", "Balsas", "Cheto", "Chiliquin", "Chuquibamba", "Granada", "Huancas", "La Jalca", "Leimebamba", "Levanto", "Magdalena", "Mariscal Castilla", "Molinopampa", "Montevideo", "Olleros", "Quinjalca", "San Francisco de Daguas", "Santo Tomas", "Soloco", "Sonche"] },
      { id: "0102", name: "Bagua", districts: ["Bagua", "Aramango", "Copallin", "El Parco", "Imaza", "La Peca"] },
      { id: "0103", name: "Bongará", districts: ["Jumbilla", "Corosha", "Cuispes", "Florida", "Jazan", "Recta", "San Carlos", "Shipasbamba", "Valera", "Yambrasbamba", "Chisquilla"] },
      { id: "0104", name: "Condorcanqui", districts: ["Nieva", "El Cenepa", "Rio Santiago"] },
      { id: "0105", name: "Luya", districts: ["Lamud", "Camporredondo", "Cocabamba", "Colcamar", "Conila", "Inguilpata", "Longuita", "Lonya Chico", "Luya", "Luya Viejo", "Maria", "Ocalli", "Ocumal", "Pisuquia", "Providencia", "San Cristobal", "San Francisco del Yeso", "San Jeronimo", "San Juan de Lopecancha", "Santa Catalina", "Santo Tomas", "Tingo", "Trita"] },
      { id: "0106", name: "Rodríguez de Mendoza", districts: ["San Nicolas", "Chirimoto", "Cochamal", "Huambo", "Limabamba", "Longar", "Mariscal Benavides", "Milpuc", "Omia", "Santa Rosa", "Totora", "Vista Alegre"] },
      { id: "0107", name: "Utcubamba", districts: ["Bagua Grande", "Cajaruro", "Cumba", "El Milagro", "Jamalca", "Lonya Grande", "Yamon"] }
    ]
  },
  {
    id: "02",
    name: "Áncash",
    provinces: [
      { id: "0201", name: "Huaraz", districts: ["Huaraz", "Cochabamba", "Colcabamba", "Huanchay", "Jangas", "La Libertad", "Olleros", "Pampas", "Pariacoto", "Pira", "Tarica", "Independencia"] },
      { id: "0202", name: "Aija", districts: ["Aija", "Coris", "Huacllan", "La Merced", "Succha"] },
      { id: "0203", name: "Antonio Raymondi", districts: ["Llamellin", "Aczo", "Chaccho", "Chingas", "Puentepiedra", "San Juan de Rontoy"] },
      { id: "0204", name: "Asunción", districts: ["Chacas", "Acochaca"] },
      { id: "0205", name: "Bolognesi", districts: ["Chiquian", "Abelardo Pardo Lezameta", "Antonio Encinas", "Aquia", "Cajacay", "Canis", "Colquioc", "Huallanca", "Huasta", "Huayllacayan", "La Primavera", "Mangas", "Pacllon", "San Miguel de Corpanqui", "Ticllos"] },
      { id: "0206", name: "Carhuaz", districts: ["Carhuaz", "Acopampa", "Amashca", "Anta", "Marcara", "Pariahuanca", "San Miguel de Aco", "Shilla", "Tinco", "Yungar", "Yungay"] },
      { id: "0207", name: "Carlos Fermín Fitzcarrald", districts: ["San Luis", "San Nicolas", "Yauya"] },
      { id: "0208", name: "Casma", districts: ["Casma", "Buena Vista Alta", "Comandante Noel", "Yautan"] },
      { id: "0209", name: "Corongo", districts: ["Corongo", "Aco", "Bambas", "Cusca", "La Pampa", "Yanac", "Yupan"] },
      { id: "0210", name: "Huari", districts: ["Huari", "Anra", "Cajay", "Chavin de Huantar", "Huacachi", "Huacchis", "Huachis", "Huantar", "Masin", "Paucas", "Ponto", "Rahuapampa", "Rapayan", "San Marcos", "San Pedro de Chana", "Uco"] },
      { id: "0211", name: "Huarmey", districts: ["Huarmey", "Cochapeti", "Culebras", "Huayan", "Malvas"] },
      { id: "0212", name: "Huaylas", districts: ["Caraz", "Huallanca", "Huata", "Huaylas", "Mato", "Pamparomas", "Pueblo Libre", "Santa Cruz", "Santo Toribio", "Yuracmarca"] },
      { id: "0213", name: "Mariscal Luzuriaga", districts: ["Piscobamba", "Casca", "Eleazar Guzman Barron", "Fidel Olivas Escudero", "Llama", "Llumpa", "Lucma", "Musga"] },
      { id: "0214", name: "Ocros", districts: ["Ocros", "Acas", "Cajamarquilla", "Carhuapampa", "Cochas", "Congas", "Llipa", "San Cristobal de Rajan", "San Pedro", "Santiago de Chilcas"] },
      { id: "0215", name: "Pallasca", districts: ["Cabana", "Bolognesi", "Conchucos", "Huacaschuque", "Huandoval", "Lacabamba", "Llapo", "Pallasca", "Pampas", "Santa Rosa", "Tauca"] },
      { id: "0216", name: "Pomabamba", districts: ["Pomabamba", "Huayllan", "Parobamba", "Quinuabamba"] },
      { id: "0217", name: "Recuay", districts: ["Recuay", "Catac", "Cotaparaco", "Huayllapampa", "Llacllin", "Marca", "Pampas Chico", "Pararin", "Tapacocha", "Ticapampa"] },
      { id: "0218", name: "Santa", districts: ["Chimbote", "Caceres del Peru", "Coishco", "Macate", "Moro", "Nepeña", "Samanco", "Santa", "Nuevo Chimbote"] },
      { id: "0219", name: "Sihuas", districts: ["Sihuas", "Acobamba", "Alfonso Ugarte", "Cashapampa", "Chimbote", "Huayllabamba", "Quiches", "Ragash", "San Juan", "Sicsibamba"] },
      { id: "0220", name: "Yungay", districts: ["Yungay", "Cascapara", "Mancos", "Matacoto", "Quillo", "Ranrahirca", "Shupluy", "Yanama"] }
    ]
  },
  {
    id: "03",
    name: "Apurímac",
    provinces: [
      { id: "0301", name: "Abancay", districts: ["Abancay", "Chacoche", "Circa", "Curahuasi", "Huanipaca", "Lambrama", "Pichirhua", "San Pedro de Cachora", "Tamburco"] },
      { id: "0302", name: "Andahuaylas", districts: ["Andahuaylas", "Andarapa", "Chiara", "Huancarama", "Huancaray", "Huayana", "Kishuara", "Pacobamba", "Pacucha", "Pampachiri", "Pomacocha", "San Antonio de Cachi", "San Jeronimo", "San Miguel de Chaccrampa", "Santa Maria de Chicmo", "Talavera", "Tumay Huaraca", "Turpo", "Kaquiabamba", "Jose Maria Arguedas"] },
      { id: "0303", name: "Antabamba", districts: ["Antabamba", "El Oro", "Huaquirca", "Juan Espinoza Medrano", "Oropesa", "Pachaconas", "Sabaino"] },
      { id: "0304", name: "Aymaraes", districts: ["Chalhuanca", "Capaya", "Caraybamba", "Chapimarca", "Colcabamba", "Cotaruse", "Ihuayllo", "Justo Apu Sahuaraura", "Lucre", "Pocohuanca", "San Juan de Chacña", "Sañayca", "Soraya", "Tapairihua", "Tintay", "Toraya", "Yanaca"] },
      { id: "0305", name: "Cotabambas", districts: ["Tambobamba", "Cotabambas", "Coyllurqui", "Haquira", "Mara", "Challhuahuacho"] },
      { id: "0306", name: "Chincheros", districts: ["Chincheros", "Anco_Huallo", "Cocharcas", "Huaccana", "Ocobamba", "Ongoy", "Uranmarca", "Ranracancha", "Rocchacc", "El Porvenir", "Los Chankas"] },
      { id: "0307", name: "Grau", districts: ["Chuquibambilla", "Curpahuasi", "Gamarra", "Huayllati", "Mamara", "Micaela Bastidas", "Pataypampa", "Progreso", "San Antonio", "Santa Rosa", "Turpay", "Vilcabamba", "Virundo", "Pachaconas"] }
    ]
  },
  {
    id: "04",
    name: "Arequipa",
    provinces: [
      { id: "0401", name: "Arequipa", districts: ["Arequipa", "Alto Selva Alegre", "Cayma", "Cerro Colorado", "Characato", "Chiguata", "Jacobo Hunter", "La Joya", "Mariano Melgar", "Miraflores", "Mollebaya", "Paucarpata", "Pocsi", "Polobaya", "Quequeña", "Sabandia", "Sachaca", "San Juan de Siguas", "San Juan de Tarucani", "Santa Isabel de Siguas", "Santa Rita de Siguas", "Socabaya", "Tiabaya", "Uchumayo", "Vitor", "Yanahuara", "Yarabamba", "Yura", "Jose Luis Bustamante y Rivero"] },
      { id: "0402", name: "Camaná", districts: ["Camana", "Jose Maria Quimper", "Mariano Nicolas Valcarcel", "Mariscal Caceres", "Nicolas de Pierola", "Ocoña", "Quilca", "Samuel Pastor"] },
      { id: "0403", name: "Caravelí", districts: ["Caraveli", "Acari", "Atico", "Atiquipa", "Bella Union", "Cahuacho", "Chala", "Chaparra", "Huanuhuanu", "Jaqui", "Lomas", "Quicacha", "Yauca"] },
      { id: "0404", name: "Castilla", districts: ["Aplao", "Andagua", "Ayo", "Chachas", "Chilcaymarca", "Choco", "Huancarqui", "Machaguay", "Orcopampa", "Pampacolca", "Tipan", "Uñon", "Uraca", "Viraco"] },
      { id: "0405", name: "Caylloma", districts: ["Chivay", "Achoma", "Cabanaconde", "Callalli", "Caylloma", "Coporaque", "Huambo", "Huanca", "Ichupampa", "Lari", "Lluta", "Maca", "Madrigal", "San Antonio de Chuca", "Sibayo", "Tapay", "Tisco", "Tuti", "Yanque", "Majes"] },
      { id: "0406", name: "Condesuyos", districts: ["Chuquibamba", "Andaray", "Cayarani", "Chichas", "Iray", "Rio Grande", "Salamanca", "Yanaquihua"] },
      { id: "0407", name: "Islay", districts: ["Mollendo", "Cocachacra", "Dean Valdivia", "Islay", "Mejia", "Punta de Bombon"] },
      { id: "0408", name: "La Unión", districts: ["Cotahuasi", "Alca", "Charcana", "Huaynacotas", "Pampamarca", "Puyca", "Quechualla", "Sayla", "Tauria", "Tomepampa", "Toro"] }
    ]
  },
  {
    id: "05",
    name: "Ayacucho",
    provinces: [
      { id: "0501", name: "Huamanga", districts: ["Ayacucho", "Acocro", "Acos Vinchos", "Carmen Alto", "Chiara", "Ocros", "Pacaycasa", "Quinua", "San Jose de Ticllas", "San Juan Bautista", "Santiago de Pischa", "Socos", "Tambillo", "Vinchos", "Jesus Nazareno", "Andres Avelino Caceres Dorregaray"] },
      { id: "0502", name: "Cangallo", districts: ["Cangallo", "Chuschi", "Los Morochucos", "Maria Parado de Bellido", "Paras", "Totos"] },
      { id: "0503", name: "Huanca Sancos", districts: ["Sancos", "Carapo", "Sacsamarca", "Santiago de Lucanamarca"] },
      { id: "0504", name: "Huanta", districts: ["Huanta", "Ayahuanco", "Huamanguilla", "Iguain", "Llochegua", "Santillana", "Sivia", "Luricocha", "Canayre", "Uchuraccay", "Pucacolpa", "Chaca"] },
      { id: "0505", name: "La Mar", districts: ["San Miguel", "Anco", "Ayna", "Chilcas", "Chungui", "Luis Carranza", "Santa Rosa", "Tambo", "Samugari", "Anchihuay", "Oronccoy"] },
      { id: "0506", name: "Lucanas", districts: ["Puquio", "Aucara", "Cabana", "Carmen Salcedo", "Chaviña", "Chipao", "Huac-Huas", "Laramate", "Leoncio Prado", "Llauta", "Lucanas", "Ocaña", "Otoca", "Saisa", "San Cristobal", "San Juan", "San Pedro", "San Pedro de Palco", "Sancos", "Santa Ana de Huaycahuacho", "Santa Lucia"] },
      { id: "0507", name: "Parinacochas", districts: ["Coracora", "Chumpi", "Coronel Castañeda", "Pacapausa", "Pullo", "Puyusca", "San Francisco de Ravacayco", "Upahuacho"] },
      { id: "0508", name: "Paucar del Sara Sara", districts: ["Pausa", "Colta", "Corculla", "Lampa", "Marcabamba", "Oyolo", "Pararca", "San Javier de Alpabamba", "San Jose de Ushua", "Sara Sara"] },
      { id: "0509", name: "Víctor Fajardo", districts: ["Huancapi", "Alcamenca", "Apongo", "Asquipata", "Canaria", "Cayara", "Colca", "Huamanquiquia", "Huancaraylla", "Huaya", "Sarhua", "Vilcanchos"] },
      { id: "0510", name: "Vilcas Huamán", districts: ["Vilcas Huaman", "Accomarca", "Carhuanca", "Concepcion", "Huambalpa", "Independencia", "Saurama", "Vischongo"] },
      { id: "0511", name: "Sucre", districts: ["Querobamba", "Belén", "Chalcos", "Chilcayoc", "Huacaña", "Morcolla", "Paico", "San Pedro de Larcay", "San Salvador de Quije", "Santiago de Paucaray", "Soras"] }
    ]
  },
  {
    id: "06",
    name: "Cajamarca",
    provinces: [
      { id: "0601", name: "Cajamarca", districts: ["Cajamarca", "Asuncion", "Chetilla", "Cospan", "Encañada", "Jesus", "Llacanora", "Los Baños del Inca", "Magdalena", "Matara", "Namora", "San Juan"] },
      { id: "0602", name: "Cajabamba", districts: ["Cajabamba", "Cachachi", "Condebamba", "Sitacocha"] },
      { id: "0603", name: "Celendín", districts: ["Celendin", "Chumuch", "Cortegana", "Huasmin", "Jorge Chavez", "Jose Galvez", "Miguel Iglesias", "Ocumal", "Oxamarca", "Sorochuco", "Sucre", "Utco", "La Libertad de Pallan"] },
      { id: "0604", name: "Chota", districts: ["Chota", "Anguia", "Chadin", "Chalamarca", "Chiguirip", "Chimban", "Choropampa", "Cochabamba", "Conchan", "Huambos", "Lajas", "Llama", "Miracosta", "Paccha", "Pion", "Querocoto", "San Juan de Licupis", "Tacabamba", "Tocmoche", "Chalamarca"] },
      { id: "0605", name: "Contumazá", districts: ["Contumaza", "Chilete", "Cupisnique", "Guzmango", "San Benito", "Santa Cruz de Toledo", "Tantarica", "Yonan"] },
      { id: "0606", name: "Cutervo", districts: ["Cutervo", "Callayuc", "Choros", "Cujillo", "La Ramada", "Pimpingos", "Querocotillo", "San Andres de Cutervo", "San Juan de Cutervo", "San Luis de Lucma", "Santa Cruz", "Santo Domingo de la Capilla", "Santo Tomas", "Socota", "Toribio Casanova"] },
      { id: "0607", name: "Hualgayoc", districts: ["Bambamarca", "Chugur", "Hualgayoc"] },
      { id: "0608", name: "Jaén", districts: ["Jaen", "Bellavista", "Chontali", "Colasay", "Huabal", "Las Pirias", "Pomahuaca", "Pucara", "Sallique", "San Felipe", "San Jose del Alto", "Santa Rosa"] },
      { id: "0609", name: "San Ignacio", districts: ["San Ignacio", "Chirinos", "Huarango", "La Coipa", "Namballe", "San Jose de Lourdes", "Tabaconas"] },
      { id: "0610", name: "San Marcos", districts: ["Pedro Galvez", "Chancay", "Eduardo Villanueva", "Gregorio Pita", "Ichocan", "Jose Manuel Quiroz", "Jose Sabogal"] },
      { id: "0611", name: "San Miguel", districts: ["San Miguel", "San Silvestre de Cochan", "Calquis", "Catilluc", "El Prado", "Llapa", "Nanchoc", "Niepos", "San Gregorio", "Tongod", "Union Agua Blanca", "Bolivar"] },
      { id: "0612", name: "San Pablo", districts: ["San Pablo", "San Bernardino", "San Luis", "Tumbaden"] },
      { id: "0613", name: "Santa Cruz", districts: ["Santa Cruz", "Andabamba", "Catache", "Chancaybaños", "La Esperanza", "Ninabamba", "Pulan", "Saucepampa", "Sexi", "Uticyacu", "Yauyucan"] }
    ]
  },
  {
    id: "07",
    name: "Callao",
    provinces: [
      { id: "0701", name: "Callao", districts: ["Callao", "Bellavista", "Carmen de la Legua Reynoso", "La Perla", "La Punta", "Ventanilla", "Mi Perú"] }
    ]
  },
  {
    id: "08",
    name: "Cusco",
    provinces: [
      { id: "0801", name: "Cusco", districts: ["Cusco", "Ccorca", "Poroy", "San Jeronimo", "San Sebastian", "Santiago", "Saylla", "Wanchaq"] },
      { id: "0802", name: "Acomayo", districts: ["Acomayo", "Acopia", "Acos", "Mosoc Llacta", "Pomacanchi", "Rondocan", "Sangarara"] },
      { id: "0803", name: "Anta", districts: ["Anta", "Ancahuasi", "Cacharimayo", "Chinchaypujio", "Huarocondo", "Limatambo", "Mollepata", "Pucyura", "Zurite"] },
      { id: "0804", name: "Calca", districts: ["Calca", "Coya", "Lamay", "Lares", "Pisac", "San Salvador", "Taray", "Yanatile"] },
      { id: "0805", name: "Canas", districts: ["Yanaoca", "Checca", "Kunturkanki", "Langui", "Layo", "Pampamarca", "Quehue", "Tupac Amaru"] },
      { id: "0806", name: "Canchis", districts: ["Sicuani", "Checacupe", "Combapata", "Marangani", "Pitumarca", "San Pablo", "San Pedro", "Tinta"] },
      { id: "0807", name: "Chumbivilcas", districts: ["Santo Tomas", "Capacmarca", "Chamaca", "Colquemarca", "Livitaca", "Llusco", "Quiñota", "Velille"] },
      { id: "0808", name: "Espinar", districts: ["Yauri", "Condoroma", "Coporaque", "Ocoruro", "Pallpata", "Pichigua", "Suyckutambo", "Alto Pichigua"] },
      { id: "0809", name: "La Convención", districts: ["Santa Ana", "Echarate", "Huayopata", "Maranura", "Ocobamba", "Quellouno", "Quimbiri", "Santa Teresa", "Vilcabamba", "Pichari", "Inkawasi", "Villa Virgen", "Villa Kintiarina", "Megantoni"] },
      { id: "0810", name: "Paruro", districts: ["Paruro", "Accha", "Ccapi", "Colcha", "Huanoquite", "Omacha", "Paccaritambo", "Pillpinto", "Yaurisque"] },
      { id: "0811", name: "Paucartambo", districts: ["Paucartambo", "Caicay", "Challabamba", "Colquepata", "Huancarani", "Kosñipata"] },
      { id: "0812", name: "Quispicanchi", districts: ["Urcos", "Andahuaylillas", "Camanti", "Ccarhuayo", "Ccatca", "Cusipata", "Huaro", "Lucre", "Marcapata", "Oropesa", "Quiquijana", "Ocongate"] },
      { id: "0813", name: "Urubamba", districts: ["Urubamba", "Chinchero", "Huayllabamba", "Machupicchu", "Maras", "Ollantaytambo", "Yucay"] }
    ]
  },
  {
    id: "09",
    name: "Huancavelica",
    provinces: [
      { id: "0901", name: "Huancavelica", districts: ["Huancavelica", "Acobambilla", "Acoria", "Conayca", "Cuenca", "Huachocolpa", "Huayllahuara", "Izcuchaca", "Laria", "Manta", "Mariscal Caceres", "Moya", "Nuevo Occoro", "Palca", "Pilchaca", "Vilca", "Yauli", "Ascension"] },
      { id: "0902", name: "Acobamba", districts: ["Acobamba", "Andabamba", "Anta", "Caja", "Marcas", "Paucara", "Pomacocha", "Rosario"] },
      { id: "0903", name: "Angaraes", districts: ["Lircay", "Anchonga", "Callanmarca", "Congalla", "Chincho", "Huayllay-Grande", "Huanca-Huanca", "Julcamarca", "San Antonio de Antaparco", "San Jose de Terere", "Santo Tomas de Pata", "Secclla"] },
      { id: "0904", name: "Castrovirreyna", districts: ["Castrovirreyna", "Arma", "Aurahua", "Capillas", "Chupamarca", "Cocas", "Huachos", "Huamatambo", "Mollepampa", "San Juan", "Santa Ana", "Tantara", "Ticrapo"] },
      { id: "0905", name: "Churcampa", districts: ["Churcampa", "Anco", "Chinchihuasi", "El Carmen", "La Merced", "Locroja", "Paucarbamba", "San Pedro de Coris", "Pachamarca", "Cosme"] },
      { id: "0906", name: "Huaytará", districts: ["Huaytara", "Ayavi", "Córdoba", "Huayacundo Arma", "Laramarca", "Ocoyo", "Pilpichaca", "Querco", "Quito-Arma", "San Antonio de Cusicancha", "San Francisco de Sangayaico", "San Isidro", "Santiago de Chocorvos", "Santiago de Quirahuara", "Santo Domingo de Capillas", "Tambo"] },
      { id: "0907", name: "Tayacaja", districts: ["Pampas", "Acostambo", "Acraquia", "Ahuaycha", "Colcabamba", "Daniel Hernandez", "Huachocolpa", "Huaribamba", "Ñahuimpuquio", "Pazos", "Quishuar", "Salcabamba", "Salcahuasi", "San Marcos de Rocchac", "Surcubamba", "Tintay Puncu", "Quichuas", "Andaymarca", "Roble", "Pichos", "Santiago de Tucuma"] }
    ]
  },
  {
    id: "10",
    name: "Huánuco",
    provinces: [
      { id: "1001", name: "Huánuco", districts: ["Huanuco", "Amarilis", "Chinchao", "Churubamba", "Margos", "Quisqui", "San Francisco de Cayran", "San Pedro de Chaulan", "Santa Maria del Valle", "Yarumayo", "Pillco Marca", "Yacus"] },
      { id: "1002", name: "Ambo", districts: ["Ambo", "Cayna", "Colpas", "Conchamarca", "Huacar", "San Francisco", "San Rafael", "Tomay Kichwa"] },
      { id: "1003", name: "Dos de Mayo", districts: ["La Union", "Chuquis", "Marias", "Pachas", "Quivilla", "Ripan", "Shunqui", "Sillapata", "Yanas"] },
      { id: "1004", name: "Huacaybamba", districts: ["Huacaybamba", "Canchabamba", "Cochabamba", "Pinra"] },
      { id: "1005", name: "Huamalíes", districts: ["Llata", "Arancay", "Chavin de Pariarca", "Jacas Grande", "Jircan", "Monzon", "Punchao", "Puños", "Singa", "Tantamayo", "Miraflores"] },
      { id: "1006", name: "Leoncio Prado", districts: ["Rupa-Rupa", "Daniel Alomia Robles", "Hermilio Valdizan", "Jose Crespo y Castillo", "Luyando", "Mariano Damaso Beraun", "Pucayacu", "Castillo Grande", "Pueblo Nuevo", "Santo Domingo de Anda"] },
      { id: "1007", name: "Marañón", districts: ["Huacrachuco", "Cholon", "San Buenaventura", "La Morada", "Santa Rosa de Alto Yanajanca"] },
      { id: "1008", name: "Pachitea", districts: ["Panao", "Chaglla", "Molino", "Umari"] },
      { id: "1009", name: "Puerto Inca", districts: ["Puerto Inca", "Codo del Pozuzo", "Honoria", "Tournavista", "Yuyapichis"] },
      { id: "1010", name: "Lauricocha", districts: ["Jesus", "Baños", "Jivia", "Queropalca", "San Francisco de Asis", "San Miguel de Cauri", "Roundos"] },
      { id: "1011", name: "Yarowilca", districts: ["Chavinillo", "Cahuac", "Chacabamba", "Aparicio Pomares", "Jacas Chico", "Obas", "Pampamarca", "Choras"] }
    ]
  },
  {
    id: "11",
    name: "Ica",
    provinces: [
      { id: "1101", name: "Ica", districts: ["Ica", "La Tinguiña", "Los Aquijes", "Ocucaje", "Pachacutec", "Parcona", "Pueblo Nuevo", "Salas", "San Jose de los Molinos", "San Juan Bautista", "Santiago", "Subtanjalla", "Tate", "Yauca del Rosario"] },
      { id: "1102", name: "Chincha", districts: ["Chincha Alta", "Alto Laran", "Chavin", "Chincha Baja", "El Carmen", "El Recreo", "Grocio Prado", "Pueblo Nuevo", "San Juan de Yanac", "San Pedro de Huacarpana", "Sunampe", "Tambo de Mora"] },
      { id: "1103", name: "Nasca", districts: ["Nasca", "Changuillo", "El Ingenio", "Marcona", "Vista Alegre"] },
      { id: "1104", name: "Palpa", districts: ["Palpa", "Llipata", "Santa Cruz", "Tibillo", "Rio Grande"] },
      { id: "1105", name: "Pisco", districts: ["Pisco", "Huancano", "Humay", "Independencia", "Paracas", "San Andres", "San Clemente", "Tupac Amaru Inca"] }
    ]
  },
  {
    id: "12",
    name: "Junín",
    provinces: [
      { id: "1201", name: "Huancayo", districts: ["Huancayo", "Carhuacallanga", "Chacapampa", "Chicche", "Chilca", "Chongos Alto", "Chupuro", "Colca", "Cullhuas", "El Tambo", "Huacrapuquio", "Hualhuas", "Huancan", "Huasicancha", "Huayucachi", "Ingenio", "Pariahuanca", "Pilcomayo", "Pucara", "Quichuay", "Quilcas", "San Agustin", "San Jeronimo de Tunan", "Saño", "Sapallanga", "Sicaya", "Santo Domingo de Acobamba", "Viques"] },
      { id: "1202", name: "Concepción", districts: ["Concepcion", "Aco", "Andamarca", "Chambara", "Cochas", "Comas", "Heroinas Toledo", "Manzanares", "Mariscal Castilla", "Matahuasi", "Mito", "Nueve de Julio", "Orcotuna", "San Jose de Quero", "Santa Rosa de Ocopa"] },
      { id: "1203", name: "Chanchamayo", districts: ["Chanchamayo", "Perene", "Pichanaqui", "San Luis de Shuaro", "San Ramon", "Vitoc"] },
      { id: "1204", name: "Jauja", districts: ["Jauja", "Acolla", "Apata", "Ataura", "Canchayllo", "Curicaca", "El Mantaro", "Huamali", "Huaripampa", "Huertas", "Janjaillo", "Julcan", "Leonor Ordoñez", "Llocllapampa", "Marco", "Masma", "Masma Chicche", "Molinos", "Monobamba", "Muqui", "Muquiyauyo", "Paca", "Paccha", "Pancan", "Parco", "Pomacancha", "Ricran", "San Lorenzo", "San Pedro de Chunan", "Sausa", "Sincos", "Tunan Marca", "Yauli", "Yauyos"] },
      { id: "1205", name: "Junín", districts: ["Junin", "Carhuamayo", "Ondores", "Ulcumayo"] },
      { id: "1206", name: "Satipo", districts: ["Satipo", "Coviriali", "Llaylla", "Mazamari", "Pampa Hermosa", "Pangoa", "Rio Negro", "Rio Tambo", "Vizcatan del Ene"] },
      { id: "1207", name: "Tarma", districts: ["Tarma", "Acobamba", "Huaracayo", "Huasahuasi", "La Union", "Palca", "Palcamayo", "San Pedro de Cajas", "Tapo"] },
      { id: "1208", name: "Yauli", districts: ["La Oroya", "Chacapalpa", "Huay-Huay", "Marcapomacocha", "Morococha", "Paccha", "Santa Barbara de Carhuacayan", "Santa Rosa de Sacco", "Suitucancha", "Yauli"] },
      { id: "1209", name: "Chupaca", districts: ["Chupaca", "Ahuac", "Chongos Bajo", "Huachac", "Huamancaca Chico", "San Juan de Iscos", "San Juan de Jarpa", "Tres de Diciembre", "Yanacancha"] }
    ]
  },
  {
    id: "13",
    name: "La Libertad",
    provinces: [
      { id: "1301", name: "Trujillo", districts: ["Trujillo", "El Porvenir", "Florencia de Mora", "Huanchaco", "La Esperanza", "Laredo", "Moche", "Poroto", "Salaverry", "Simbal", "Victor Larco Herrera"] },
      { id: "1302", name: "Ascope", districts: ["Ascope", "Chicama", "Chocope", "Magdalena de Cao", "Paijan", "Razuri", "Santiago de Cao", "Casa Grande"] },
      { id: "1303", name: "Bolívar", districts: ["Bolivar", "Bambamarca", "Condormarca", "Longotea", "Uchumarca", "Ucuncha"] },
      { id: "1304", name: "Chepén", districts: ["Chepen", "Pacanga", "Pueblo Nuevo"] },
      { id: "1305", name: "Julcán", districts: ["Julcan", "Calamarca", "Carabamba", "Huaso"] },
      { id: "1306", name: "Otuzco", districts: ["Otuzco", "Agallpampa", "Charat", "Huaranchal", "La Cuesta", "Mache", "Paranday", "Salpo", "Sinsicap", "Usquil"] },
      { id: "1307", name: "Pacasmayo", districts: ["San Pedro de Lloc", "Guadalupe", "Jequetepeque", "Pacasmayo", "San Jose"] },
      { id: "1308", name: "Pataz", districts: ["Tayabamba", "Buldibuyo", "Chillia", "Huancaspata", "Huaylillas", "Huayo", "Ongon", "Parcoy", "Pataz", "Pias", "Santiago de Challas", "Taurija", "Urpay"] },
      { id: "1309", name: "Sánchez Carrión", districts: ["Huamachuco", "Chugay", "Curgos", "Marcabal", "Sanagorán", "Sarin", "Sartimbamba"] },
      { id: "1310", name: "Santiago de Chuco", districts: ["Santiago de Chuco", "Angasmarca", "Cachicadan", "Mollebamba", "Mollepata", "Quiruvilca", "Santa Cruz de Chuca", "Sitabamba"] },
      { id: "1311", name: "Gran Chimú", districts: ["Cascas", "Lucma", "Marmot", "Sayapullo"] },
      { id: "1312", name: "Virú", districts: ["Viru", "Chao", "Guadalupito"] }
    ]
  },
  {
    id: "14",
    name: "Lambayeque",
    provinces: [
      { id: "1401", name: "Chiclayo", districts: ["Chiclayo", "Chongoyape", "Eten", "Eten Puerto", "Jose Leonardo Ortiz", "La Victoria", "Lagunas", "Monsefu", "Nueva Arica", "Oyotun", "Picsi", "Pimentel", "Reque", "Santa Rosa", "Saña", "Cayalti", "Patapo", "Pomalca", "Pucala", "Tuman"] },
      { id: "1402", name: "Ferreñafe", districts: ["Ferreñafe", "Cañaris", "Incahuasi", "Manuel Antonio Mesones Muro", "Pitipo", "Pueblo Nuevo"] },
      { id: "1403", name: "Lambayeque", districts: ["Lambayeque", "Chochope", "Illimo", "Jayanca", "Mochumi", "Morrope", "Motupe", "Olmos", "Pacora", "Salas", "San Jose", "Tucume"] }
    ]
  },
  {
    id: "15",
    name: "Lima",
    provinces: [
      { id: "1501", name: "Lima", districts: ["Lima", "Ancon", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesus Maria", "La Molina", "La Victoria", "Lince", "Lurin", "Magdalena del Mar", "Miraflores", "Pachacamac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rimac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martin de Porres", "San Miguel", "Santa Anita", "Santa Maria del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa Maria del Triunfo", "Los Olivos", "San Juan de Lurigancho", "San Martin de Porres"] },
      { id: "1502", name: "Barranca", districts: ["Barranca", "Paramonga", "Pativilca", "Supe", "Supe Puerto"] },
      { id: "1503", name: "Cajatambo", districts: ["Cajatambo", "Copa", "Gorgor", "Huancapon", "Manas"] },
      { id: "1504", name: "Canta", districts: ["Canta", "Arahuay", "Huamantanga", "Huaros", "Lachaqui", "San Buenaventura", "Santa Rosa de Quives"] },
      { id: "1505", name: "Cañete", districts: ["San Vicente de Cañete", "Asia", "Calango", "Cerro Azul", "Coayllo", "Imperial", "Lunahuana", "Mala", "Nuevo Imperial", "Pacaran", "Quilmana", "San Antonio", "San Luis", "Santa Cruz de Flores", "Zúñiga"] },
      { id: "1506", name: "Huaral", districts: ["Huaral", "Atavillos Alto", "Atavillos Bajo", "27 de Noviembre", "Ihuari", "Lampian", "Pacaraos", "San Miguel de Acos", "Santa Cruz de Andamarca", "Sumbilca", "Chancay"] },
      { id: "1507", name: "Huarochirí", districts: ["Matucana", "Antioquia", "Callahuanca", "Carampoma", "Chicla", "Cuenca", "Huachupampa", "Huanza", "Huarochiri", "Lahuaytambo", "Langa", "Laraos", "Mariatana", "Ricardo Palma", "San Andres de Tupicocha", "San Antonio", "San Bartolome", "San Damian", "San Juan de Iris", "San Juan de Tantaranche", "San Lorenzo de Quinti", "San Mateo", "San Mateo de Otao", "San Pedro de Casta", "San Pedro de Huancayre", "Sangallaya", "Santa Cruz de Cocachacra", "Santa Eulalia", "Santiago de Anchucaya", "Santiago de Tuna", "Santo Domingo de los Olleros", "Surco"] },
      { id: "1508", name: "Huaura", districts: ["Huacho", "Ambar", "Caleta de Carquin", "Checras", "Hualmay", "Huaura", "Leoncio Prado", "Paccho", "Santa Leonor", "Santa Maria", "Sayan", "Vegueta"] },
      { id: "1509", name: "Oyón", districts: ["Oyon", "Andajes", "Caujul", "Cochamarca", "Navan", "Pachangara"] },
      { id: "1510", name: "Yauyos", districts: ["Yauyos", "Alis", "Ayauca", "Ayaviri", "Azangaro", "Cacra", "Carania", "Catahuasi", "Chocos", "Cochas", "Colonia", "Hongos", "Huampara", "Huancaya", "Huangascar", "Huantan", "Huañec", "Laraos", "Lincha", "Madean", "Miraflores", "Omas", "Putinja", "Quinches", "Quinocay", "San Joaquin", "San Pedro de Pilas", "Tanta", "Tauripampa", "Tomas", "Tupe", "Viñac", "Vitis"] }
    ]
  },
  {
    id: "16",
    name: "Loreto",
    provinces: [
      { id: "1601", name: "Maynas", districts: ["Iquitos", "Alto Nanay", "Fernando Lores", "Indiana", "Las Amazonas", "Mazan", "Napo", "Punchana", "Putumayo", "Torres Causana", "Belén", "San Juan Bautista"] },
      { id: "1602", name: "Alto Amazonas", districts: ["Yurimaguas", "Balsapuerto", "Jeberos", "Lagunas", "Santa Cruz", "Teniente Cesar Lopez Rojas"] },
      { id: "1603", name: "Loreto", districts: ["Nauta", "Parinari", "Tigre", "Trompeteros", "Urarinas"] },
      { id: "1604", name: "Mariscal Ramón Castilla", districts: ["Ramon Castilla", "Pebas", "Yavari", "San Pablo"] },
      { id: "1605", name: "Requena", districts: ["Requena", "Alto Tapiche", "Capelo", "Emilio San Martin", "Maquia", "Puinahua", "Saquena", "Soplin", "Tapiche", "Jenaro Herrera", "Yaquerana"] },
      { id: "1606", name: "Ucayali", districts: ["Contamana", "Inahuaya", "Padre Marquez", "Pampa Hermosa", "Sarayacu", "Vargas Guerra"] },
      { id: "1607", name: "Datem del Marañón", districts: ["Barranca", "Cahuapanas", "Manseriche", "Morona", "Pastaza", "Andoas"] },
      { id: "1608", name: "Putumayo", districts: ["Putumayo", "Rosa Panduro", "Teniente Manuel Clavero", "Yaguas"] }
    ]
  },
  {
    id: "17",
    name: "Madre de Dios",
    provinces: [
      { id: "1701", name: "Tambopata", districts: ["Puerto Maldonado", "Inambari", "Las Piedras", "Laberinto"] },
      { id: "1702", name: "Manu", districts: ["Manu", "Fitzcarrald", "Madre de Dios", "Huepetuhe"] },
      { id: "1703", name: "Tahuamanu", districts: ["Iñapari", "Iberia", "Tahuamanu"] }
    ]
  },
  {
    id: "18",
    name: "Moquegua",
    provinces: [
      { id: "1801", name: "Mariscal Nieto", districts: ["Moquegua", "Carumas", "Cuchumbaya", "Samegua", "San Cristobal", "Torata"] },
      { id: "1802", name: "General Sánchez Cerro", districts: ["Omate", "Chojata", "Coalaque", "Ichuña", "La Capilla", "Lloque", "Matalaque", "Puquina", "Quinistaquillas", "Ubinas", "Yunga"] },
      { id: "1803", name: "Ilo", districts: ["Ilo", "El Algarrobal", "Pacocha"] }
    ]
  },
  {
    id: "19",
    name: "Pasco",
    provinces: [
      { id: "1901", name: "Pasco", districts: ["Chaupimarca", "Huachon", "Huariaca", "Huayllay", "Ninacaca", "Pallanchacra", "Paucartambo", "San Francisco de Asis de Yarusyacan", "Simon Bolivar", "Ticlacayan", "Tinyahuarco", "Vicco", "Yanacancha"] },
      { id: "1902", name: "Daniel Alcides Carrión", districts: ["Yanahuanca", "Chacayan", "Goyllarisquizga", "Paucar", "San Pedro de Pillao", "Santa Ana de Tusi", "Tapuc", "Vilcabamba"] },
      { id: "1903", name: "Oxapampa", districts: ["Oxapampa", "Chontabamba", "Huancabamba", "Palcazu", "Pozuzo", "Puerto Bermudez", "Villa Rica", "Constitución"] }
    ]
  },
  {
    id: "20",
    name: "Piura",
    provinces: [
      { id: "2001", name: "Piura", districts: ["Piura", "Castilla", "Catacaos", "Cura Mori", "El Tallan", "La Arena", "La Union", "Las Lomas", "Tambo Grande", "Veintiseis de Octubre"] },
      { id: "2002", name: "Ayabaca", districts: ["Ayabaca", "Frias", "Jilili", "Lagunas", "Montero", "Pacaipampa", "Paimas", "Sapillica", "Sicchez", "Suyo"] },
      { id: "2003", name: "Huancabamba", districts: ["Huancabamba", "Canchaque", "El Carmen de la Frontera", "Huarmaca", "Lalaquiz", "San Miguel de El Faique", "Sondor", "Sondorillo"] },
      { id: "2004", name: "Morropón", districts: ["Chulucanas", "Buenos Aires", "Chalaco", "La Matanza", "Morropon", "Salitral", "San Juan de Bigote", "Santa Catalina de Mossa", "Santo Domingo", "Yamango"] },
      { id: "2005", name: "Paita", districts: ["Paita", "Amotape", "Arenal", "Colan", "La Huaca", "Tamarindo", "Vichayal"] },
      { id: "2006", name: "Sullana", districts: ["Sullana", "Bellavista", "Ignacio Escudero", "Lancones", "Marcavelica", "Miguel Checa", "Querecotillo", "Salitral"] },
      { id: "2007", name: "Talara", districts: ["Pariñas", "El Alto", "La Brea", "Lobitos", "Los Organos", "Mancora"] },
      { id: "2008", name: "Sechura", districts: ["Sechura", "Bellavista de la Union", "Bernal", "Cristo Nos Valga", "Vice", "Rinconada Llicuar"] }
    ]
  },
  {
    id: "21",
    name: "Puno",
    provinces: [
      { id: "2101", name: "Puno", districts: ["Puno", "Acora", "Amantani", "Atuncolla", "Capachica", "Chucuito", "Coata", "Huata", "Mañazo", "Paucarcolla", "Pichacani", "Plateria", "San Antonio", "Tiquillaca", "Vilque"] },
      { id: "2102", name: "Azángaro", districts: ["Azangaro", "Achaya", "Arapa", "Asillo", "Caminaca", "Chupa", "Jose Domingo Choquehuanca", "Muñani", "Potoni", "Saman", "San Anton", "San Jose", "San Juan de Salinas", "Santiago de Pupuja", "Tirapata"] },
      { id: "2103", name: "Carabaya", districts: ["Macusani", "Ajoyani", "Ayapata", "Coasa", "Corani", "Crucero", "Ituata", "Ollachea", "San Gaban", "Usicayos"] },
      { id: "2104", name: "Chucuito", districts: ["Juli", "Desaguadero", "Huacullani", "Kelluyo", "Pisacoma", "Pomata", "Zepita"] },
      { id: "2105", name: "El Collao", districts: ["Ilave", "Capazo", "Pilcuyo", "Santa Rosa", "Conduriri"] },
      { id: "2106", name: "Huancané", districts: ["Huancane", "Cojata", "Huatasani", "Inchupalla", "Pusi", "Rosaspata", "Taraco", "Vilque Chico"] },
      { id: "2107", name: "Lampa", districts: ["Lampa", "Cabanilla", "Calapuja", "Nicasio", "Ocuviri", "Palca", "Paratia", "Pucara", "Santa Lucia", "Vilavila"] },
      { id: "2108", name: "Melgar", districts: ["Ayaviri", "Antauta", "Cupi", "Llalli", "Macari", "Nuñoa", "Orurillo", "Santa Rosa", "Umachiri"] },
      { id: "2109", name: "Moho", districts: ["Moho", "Conima", "Huayrapata", "Tilali"] },
      { id: "2110", name: "San Antonio de Putina", districts: ["Putina", "Ananea", "Pedro Vilca Apaza", "Quilcapuncu", "Sina"] },
      { id: "2111", name: "San Román", districts: ["Juliaca", "Cabana", "Cabanillas", "Caracoto", "San Miguel"] },
      { id: "2112", name: "Sandia", districts: ["Sandia", "Cuyocuyo", "Limbani", "Patambuco", "Phara", "Quiaca", "San Juan del Oro", "Yanahuaya", "Alto Inambari", "San Pedro de Putina Punco"] },
      { id: "2113", name: "Yunguyo", districts: ["Yunguyo", "Anapia", "Copani", "Cuturapi", "Ollaraya", "Tinicachi", "Unicachi"] }
    ]
  },
  {
    id: "22",
    name: "San Martín",
    provinces: [
      { id: "2201", name: "Moyobamba", districts: ["Moyobamba", "Calzada", "Habana", "Jepelacio", "Soritor", "Yantalo"] },
      { id: "2202", name: "Bellavista", districts: ["Bellavista", "Alto Biavo", "Bajo Biavo", "Huallaga", "Mazamari", "San Pablo", "San Rafael"] },
      { id: "2203", name: "El Dorado", districts: ["San Jose de Sisa", "Agua Blanca", "San Martin", "Santa Rosa", "Shatoja"] },
      { id: "2204", name: "Huallaga", districts: ["Saposoa", "Alto Saposoa", "Eslabon", "Piscoyacu", "Sacanche", "Tingo de Saposoa"] },
      { id: "2205", name: "Lamas", districts: ["Lamas", "Alonso de Alvarado", "Barranquita", "Caynarachi", "Cuñumbuqui", "Pinto Recodo", "Rumisapa", "San Roque de Cumbaza", "Shanao", "Tabalosos", "Zapatero"] },
      { id: "2206", name: "Mariscal Cáceres", districts: ["Juanjui", "Campanilla", "Huicungo", "Pachiza", "Pajarillo"] },
      { id: "2207", name: "Picota", districts: ["Picota", "Buenos Aires", "Caspisapa", "Pilluana", "Pucacaca", "San Cristobal", "San Hilarion", "Shamboyacu", "Tingo de Ponasa", "Tres Unidos"] },
      { id: "2208", name: "Rioja", districts: ["Rioja", "Awajun", "Elias Soplin Vargas", "Nueva Cajamarca", "Pardo Miguel", "Posic", "San Fernando", "Yorongos", "Yuracyacu"] },
      { id: "2209", name: "San Martín", districts: ["Tarapoto", "Alberto Leveau", "Cacatachi", "Chazuta", "Chipurana", "El Porvenir", "Huimbayoc", "Juan Guerra", "Morales", "Papaplaya", "San Antonio", "Sauce", "Shapaja", "La Banda de Shilcayo"] },
      { id: "2210", name: "Tocache", districts: ["Tocache", "Nuevo Progreso", "Polvora", "Shunte", "Uchiza"] }
    ]
  },
  {
    id: "23",
    name: "Tacna",
    provinces: [
      { id: "2301", name: "Tacna", districts: ["Tacna", "Alto de la Alianza", "Calana", "Ciudad Nueva", "Inclan", "Pachia", "Palca", "Pocollay", "Sama", "Coronel Gregorio Albarracin Lanchipa", "La Yarada Los Palos"] },
      { id: "2302", name: "Candarave", districts: ["Candarave", "Cairani", "Camilaca", "Curibaya", "Huanuara", "Quilahuani"] },
      { id: "2303", name: "Jorge Basadre", districts: ["Locumba", "Ilabaya", "Ite"] },
      { id: "2304", name: "Tarata", districts: ["Tarata", "Chucatamani", "Estique", "Estique-Pampa", "Sitajara", "Susapaya", "Tarucachi", "Ticaco"] }
    ]
  },
  {
    id: "24",
    name: "Tumbes",
    provinces: [
      { id: "2401", name: "Tumbes", districts: ["Tumbes", "Corrales", "La Cruz", "Pampas de Hospital", "San Jacinto", "San Juan de la Virgen"] },
      { id: "2402", name: "Contralmirante Villar", districts: ["Zorritos", "Casitas", "Canoas de Punta Sal"] },
      { id: "2403", name: "Zarumilla", districts: ["Zarumilla", "Aguas Verdes", "Matapalo", "Papayal"] }
    ]
  },
  {
    id: "25",
    name: "Ucayali",
    provinces: [
      { id: "2501", name: "Coronel Portillo", districts: ["Calleria", "Campoverde", "Iparia", "Masisea", "Yarinacocha", "Nueva Requena", "Manantay", "Independencia"] },
      { id: "2502", name: "Atalaya", districts: ["Raymondi", "Sepahua", "Tahuania", "Yurua"] },
      { id: "2503", name: "Padre Abad", districts: ["Padre Abad", "Irazola", "Curimana", "Neshuya", "Alexander Von Humboldt"] },
      { id: "2504", name: "Purús", districts: ["Purus"] }
    ]
  }
];
