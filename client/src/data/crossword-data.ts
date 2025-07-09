import { CrosswordGrid } from '../types/game';

export const LEVEL_1_DATA: CrosswordGrid = {
  cells: Array(50).fill(null).map(() => 
    Array(50).fill(null).map(() => ({
      value: '',
      revealed: false,
      isBlocked: true,
      belongsToClues: [],
      hintsUsed: 0
    }))
  ),
  clues: [
    {
      id: 1,
      number: 1,
      text: "Merek mobil Jerman, logo biru-putih, terkenal dengan seri 3 dan 5.",
      answer: "BMW",
      direction: 'across',
      startRow: 2,
      startCol: 7,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 2,
      number: 2,
      text: "Merek mobil Jepang, slogan 'Zoom-Zoom', model populer: CX-5.",
      answer: "MAZDA",
      direction: 'down',
      startRow: 2,
      startCol: 8,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 3,
      number: 3,
      text: "Supercar Italia, logo kuda jingkrak, identik dengan warna merah.",
      answer: "FERRARI",
      direction: 'across',
      startRow: 6,
      startCol: 4,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 4,
      number: 4,
      text: "Supercar Italia, logo banteng, model Aventador dan Huracán.",
      answer: "LAMBORGHINI",
      direction: 'down',
      startRow: 6,
      startCol: 13,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 5,
      number: 5,
      text: "Supercar eksotis Italia, model Zonda dan Huayra.",
      answer: "PAGANI",
      direction: 'down',
      startRow: 10,
      startCol: 9,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 6,
      number: 6,
      text: "Hypercar asal Swedia, model Agera dan Jesko.",
      answer: "KOENIGSEGG",
      direction: 'across',
      startRow: 12,
      startCol: 4,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 7,
      number: 7,
      text: "Pabrikan mobil sport Inggris, model 720S dan P1.",
      answer: "MCLAREN",
      direction: 'down',
      startRow: 1,
      startCol: 5,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 8,
      number: 8,
      text: "Mobil sport Inggris, terkenal lewat film James Bond.",
      answer: "ASTON MARTIN",
      direction: 'down',
      startRow: 8,
      startCol: 7,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 9,
      number: 9,
      text: "Merek mobil Swedia, terkenal dengan fitur keselamatan.",
      answer: "VOLVO",
      direction: 'across',
      startRow: 10,
      startCol: 12,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 10,
      number: 10,
      text: "Merek mobil Amerika, pelopor produksi massal, model Mustang.",
      answer: "FORD",
      direction: 'down',
      startRow: 11,
      startCol: 5,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 11,
      number: 11,
      text: "Mobil sport Jerman, model legendaris 911.",
      answer: "PORSCHE",
      direction: 'down',
      startRow: 9,
      startCol: 16,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 13,
      number: 13,
      text: "Mobil mewah Italia, logo trisula, model Ghibli dan Quattroporte.",
      answer: "MASERATI",
      direction: 'down',
      startRow: 18,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 14,
      number: 14,
      text: "Merek mobil Amerika, model Charger dan RAM.",
      answer: "DODGE",
      direction: 'down',
      startRow: 23,
      startCol: 4,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 15,
      number: 15,
      text: "Merek Jepang, logo tiga berlian, model Pajero dan Xpander.",
      answer: "MITSUBISHI",
      direction: 'across',
      startRow: 18,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 16,
      number: 16,
      text: "Merek mobil Jepang terbesar, model Avanza dan Camry.",
      answer: "TOYOTA",
      direction: 'across',
      startRow: 24,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
    {
      id: 12,
      number: 12,
      text: "Merek mobil Jepang, model Civic dan CR-V.",
      answer: "HONDA",
      direction: 'across',
      startRow: 4,
      startCol: 1,
      answered: false,
      hintsUsed: 0,
    },
  ]
};

// Initialize the grid based on clues
function initializeGrid(gridData: CrosswordGrid): CrosswordGrid {
  const newGrid = { ...gridData };
  
  // Set up cells for each clue
  newGrid.clues.forEach(clue => {
    const { startRow, startCol, answer, direction, id, number } = clue;
    
    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      if (row < newGrid.cells.length && col < newGrid.cells[0].length) {
        let cell = newGrid.cells[row][col] || {};
        let cellNumber = cell.number;
        if (i === 0) {
          if (cellNumber && cellNumber !== number) {
            // Gabungkan nomor jika sudah ada
            cellNumber = `${cellNumber}/${number}`;
          } else {
            cellNumber = number;
          }
        }
        newGrid.cells[row][col] = {
          ...cell,
          value: '',
          revealed: false,
          isBlocked: false,
          number: cellNumber,
          belongsToClues: [...(cell.belongsToClues || []), id],
          hintsUsed: 0
        };
      }
    }
  });
  
  return newGrid;
}

export const LEVEL_DATA: { [key: number]: CrosswordGrid } = {
  1: initializeGrid(LEVEL_1_DATA),
  2: initializeGrid({
    cells: Array(50).fill(null).map(() => 
      Array(50).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: [],
        hintsUsed: 0
      }))
    ),
    clues: [
      // Penomoran clues di level 2 diubah urut dari 1
      {
        id: 1,
        number: 1,
        text: "Kabupaten di Sulawesi Selatan, ibukotanya Turikale.",
        answer: "MAROS",
        direction: 'down',
        startRow: 5,
        startCol: 2,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 2,
        number: 2,
        text: "Ibukota Sulawesi Selatan, kota terbesar di Indonesia Timur.",
        answer: "MAKASSAR",
        direction: 'across',
        startRow: 5,
        startCol: 2,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 7,
        number: 7,
        text: "Ibukota provinsi Sulawesi Tengah.",
        answer: "PALU",
        direction: 'down',
        // Huruf ke-4 MAKASSAR = kolom 2+3=5, baris 5
        // Huruf ke-2 PALU = baris X+1, kolom Y
        // Jadi startRow PALU = 5-1=4, startCol PALU = 5
        startRow: 4,
        startCol: 5,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 3,
        number: 3,
        text: "Ibukota provinsi di utara Sulawesi, terkenal dengan Danau Limboto.",
        answer: "GORONTALO",
        direction: 'down',
        // Huruf ke-7 SOPPENG = startCol SOPPENG + 6 = 2+6=8, baris SOPPENG = 9
        // Huruf ke-1 GORONTALO = baris 9, kolom 8
        startRow: 9,
        startCol: 8,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 4,
        number: 4,
        text: "Kabupaten di Sulawesi Selatan, ibukotanya Belopa.",
        answer: "LUWU",
        direction: 'across',
        // Huruf ke-4 PALU = startRow PALU + 3 = 4+3=7
        // Huruf ke-2 LUWU = startCol + 1 = 5
        // Jadi startRow LUWU = 7, startCol LUWU = 5-1=4
        startRow: 7,
        startCol: 4,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 5,
        number: 5,
        text: "Kota di Sulawesi Selatan, dikenal sebagai kota niaga dan pelabuhan.",
        answer: "PAREPARE",
        direction: 'down',
        // Huruf ke-3 SOPPENG = startCol SOPPENG + 2 = 2+2=4, baris SOPPENG = 9
        // Huruf ke-1 PAREPARE = baris 9, kolom 4
        startRow: 9,
        startCol: 4,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 6,
        number: 6,
        text: "Kabupaten di Sulawesi Tenggara, ibukotanya Kolaka.",
        answer: "KOLAKA",
        direction: 'down',
        // Huruf ke-7 MAKASSAR = startCol MAKASSAR + 6 = 2+6=8, baris MAKASSAR = 5
        // Huruf ke-6 KOLAKA = startRow KOLAKA + 5 = 5, jadi startRow KOLAKA = 5-5=0
        // startCol KOLAKA = 8
        startRow: 0,
        startCol: 8,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 8,
        number: 8,
        text: "Kabupaten di Sulawesi Selatan, ibukotanya Sengkang.",
        answer: "WAJO",
        direction: 'down',
        // Huruf ke-9 BULUKUMBA = startCol 6+8=14, baris 16
        // Huruf ke-2 WAJO = startRow WAJO+1, startCol WAJO=14
        // Jadi startRow WAJO=16-1=15, startCol WAJO=14
        startRow: 15,
        startCol: 14,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 9,
        number: 9,
        text: "Ibukota provinsi Sulawesi Barat.",
        answer: "MAMUJU",
        direction: 'across',
        // Huruf ke-4 MALANG = startRow 26+3=29, startCol 8
        // Huruf ke-2 MAMUJU = startCol MAMUJU+1=8
        // Jadi startRow MAMUJU=29, startCol MAMUJU=7
        startRow: 29,
        startCol: 7,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 10,
        number: 10,
        text: "Kabupaten di Sulawesi Selatan, ibukotanya Watampone.",
        answer: "BONE",
        direction: 'across',
        // Huruf ke-2 KOLAKA = startRow KOLAKA + 1 = 0+1=1
        // Huruf ke-2 BONE = startCol BONE + 1 = startCol KOLAKA = 8
        // Jadi startRow BONE = 1, startCol BONE = 8-1=7
        startRow: 1,
        startCol: 7,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 11,
        number: 11,
        text: "Kabupaten di Sulawesi Selatan, ibukotanya Watansoppeng.",
        answer: "SOPPENG",
        direction: 'across',
        // Huruf ke-5 MAROS = startRow MAROS + 4 = 5+4=9
        // Huruf ke-1 SOPPENG = startCol MAROS = 2
        startRow: 9,
        startCol: 2,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 12,
        number: 12,
        text: "Kabupaten di Sulawesi Selatan, ibukotanya Bulukumba.",
        answer: "BULUKUMBA",
        direction: 'across',
        // Huruf ke-8 GORONTALO = startRow GORONTALO + 7, startCol GORONTALO
        // Huruf ke-3 BULUKUMBA = startCol BULUKUMBA + 2 = startCol GORONTALO
        // Jadi startRow BULUKUMBA = startRow GORONTALO + 7, startCol BULUKUMBA = startCol GORONTALO - 2
        startRow: 16,
        startCol: 6,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 13,
        number: 13,
        text: "Kabupaten di Sulawesi Tenggara, ibukotanya Pasarwajo.",
        answer: "BUTON",
        direction: 'across',
        // Huruf ke-6 GORONTALO = startRow 9+5=14, startCol 8
        // Huruf ke-3 BUTON = startCol BUTON+2=8
        // Jadi startRow BUTON=14, startCol BUTON=6
        startRow: 14,
        startCol: 6,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 14,
        number: 14,
        text: "Kabupaten di Sulawesi Tengah, ibukotanya Tolitoli.",
        answer: "TOLITOLI",
        direction: 'across',
        // Huruf ke-4 GORONTALO = startRow 9+3=12, startCol 8
        // Huruf ke-2 TOLITOLI = startCol TOLITOLI+1=8
        // Jadi startRow TOLITOLI=12, startCol TOLITOLI=7
        startRow: 12,
        startCol: 7,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 16,
        number: 16,
        text: "Kabupaten di Sulawesi Tengah, ibukotanya Banggai.",
        answer: "BANGGAI",
        direction: 'down',
        // Huruf ke-8 TOLITOLI = startCol 7+7=14, baris 12
        // Huruf ke-7 BANGGAI = startRow BANGGAI+6, startCol BANGGAI=14
        // Jadi startRow BANGGAI=12-6=6, startCol BANGGAI=14
        startRow: 6,
        startCol: 14,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 17,
        number: 17,
        text: "Kabupaten di Sulawesi Barat, ibukotanya Majene.",
        answer: "MAJENE",
        direction: 'down',
        // Huruf ke-8 SUNGAIPENUH = startCol 2+7=9, baris 22
        // Huruf ke-4 MAJENE = startRow MAJENE+3, startCol MAJENE=9
        // Jadi startRow MAJENE=22-3=19, startCol MAJENE=9
        startRow: 19,
        startCol: 9,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 18,
        number: 18,
        text: "Kabupaten di Jawa Tengah, ibukotanya Pemalang.",
        answer: "PEMALANG",
        direction: 'across',
        // Huruf ke-10 YOGYAKARTA = startRow 18+9=27, startCol 6
        // Huruf ke-4 PEMALANG = startCol PEMALANG+3=6
        // Jadi startRow PEMALANG=27, startCol PEMALANG=3
        startRow: 27,
        startCol: 3,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 19,
        number: 19,
        text: "Kabupaten di Maluku, ibukotanya Namlea.",
        answer: "BURU",
        direction: 'down',
        // Huruf ke-2 SUNGAIPENUH = startCol 2+1=3, baris 22
        // Huruf ke-2 BURU = startRow BURU+1, startCol BURU=3
        // Jadi startRow BURU=22-1=21, startCol BURU=3
        startRow: 21,
        startCol: 3,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 20,
        number: 20,
        text: "Kota di Jawa Timur, terkenal dengan julukan Kota Apel.",
        answer: "MALANG",
        direction: 'down',
        // Huruf ke-6 PEMALANG = startCol 3+5=8, baris 27
        // Huruf ke-2 MALANG = startRow MALANG+1, startCol MALANG=8
        // Jadi startRow MALANG=27-1=26, startCol MALANG=8
        startRow: 26,
        startCol: 8,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 21,
        number: 21,
        text: "Kota istimewa di Indonesia, terkenal dengan Malioboro.",
        answer: "YOGYAKARTA",
        direction: 'down',
        // Huruf ke-5 SUNGAIPENUH = startCol 2+4=6, baris 22
        // Huruf ke-5 YOGYAKARTA = startRow YOGYAKARTA+4, startCol YOGYAKARTA=6
        // Jadi startRow YOGYAKARTA=18, startCol YOGYAKARTA=6
        startRow: 18,
        startCol: 6,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 22,
        number: 22,
        text: "Kota di Jambi yang terkenal dengan Danau Kerinci.",
        answer: "SUNGAIPENUH",
        direction: 'across',
        startRow: 22,
        startCol: 2,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 23,
        number: 23,
        text: "Kota di Sumatera Barat yang dikenal sebagai kota serambi mekah kecil.",
        answer: "PADANGPANJANG",
        direction: 'across',
        startRow: 31,
        startCol: 7,
        answered: false,
        hintsUsed: 0,
      },
      {
        id: 15,
        number: 15,
        text: "Kota di Jawa Timur yang terkenal dengan industri gula dan kereta api.",
        answer: "PASURUAN",
        direction: 'down',
        startRow: 31,
        startCol: 7,
        answered: false,
        hintsUsed: 0,
      },
    ],
  }),
  3: initializeGrid({
    cells: Array(50).fill(null).map(() => 
      Array(50).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: [],
        hintsUsed: 0
      }))
    ),
    clues: [
      { id: 1, number: 1, text: 'Kabupaten di Sulawesi Tenggara, ibukotanya Unaaha.', answer: 'KONAWE', direction: 'across', startRow: 2, startCol: 2, answered: false, hintsUsed: 0 },
      { id: 2, number: 2, text: 'Kabupaten kepulauan di Sulawesi Selatan, terkenal dengan Taman Nasional Takabonerate.', answer: 'SELAYAR', direction: 'down', startRow: 1, startCol: 7, answered: false, hintsUsed: 0 },
      { id: 3, number: 3, text: 'Kabupaten di Sulawesi Tengah, ibukotanya Ampana.', answer: 'TOJOUNAUNA', direction: 'down', startRow: 1, startCol: 3, answered: false, hintsUsed: 0 },
      { id: 5, number: 5, text: 'Ibukota Provinsi Maluku, dikenal dengan Gong Perdamaian Dunia.', answer: 'AMBON', direction: 'across', startRow: 6, startCol: 7, answered: false, hintsUsed: 0 },
      { id: 6, number: 6, text: 'Kabupaten di Papua Tengah, ibukotanya Enarotali.', answer: 'PANIAI', direction: 'across', startRow: 9, startCol: 1, answered: false, hintsUsed: 0 },
      { id: 7, number: 7, text: 'Kabupaten di Maluku Utara, ibukotanya Jailolo.', answer: 'HALMAHERABARAT', direction: 'down', startRow: 3, startCol: 13, answered: false, hintsUsed: 0 },
      { id: 8, number: 8, text: 'Kota di Maluku Utara, terkenal dengan sejarah Kesultanan Ternate.', answer: 'TERNATE', direction: 'down', startRow: 9, startCol: 9, answered: false, hintsUsed: 0 },
      { id: 11, number: 11, text: 'Kabupaten di Papua, ibukotanya Serui.', answer: 'YAPEN', direction: 'across', startRow: 15, startCol: 12, answered: false, hintsUsed: 0, hidden: true },
      { id: 9, number: 9, text: 'Kota utama di Lembah Baliem, Papua Pegunungan.', answer: 'WAMENA', direction: 'across', startRow: 12, startCol: 17, answered: false, hintsUsed: 0, hidden: true },
      { id: 10, number: 10, text: 'Kabupaten di Nusa Tenggara Timur, terkenal dengan wisata bawah laut.', answer: 'ALOR', direction: 'across', startRow: 11, startCol: 6, answered: false, hintsUsed: 0 },
      { id: 12, number: 12, text: 'Kabupaten di Papua Barat, terkenal dengan Teluk Triton.', answer: 'KAIMANA', direction: 'down', startRow: 7, startCol: 21, answered: false, hintsUsed: 0, hidden: true },
      { id: 13, number: 13, text: 'Kabupaten di Papua Barat, dikenal dengan kuliner petatas dan kacang kenari.', answer: 'FAKFAK', direction: 'down', startRow: 7, startCol: 27, answered: false, hintsUsed: 0, hidden: true },
      { id: 14, number: 14, text: 'Kabupaten di Sulawesi Tengah, pusat industri nikel.', answer: 'MOROWALI', direction: 'across', startRow: 16, startCol: 17, answered: false, hintsUsed: 0, hidden: true },
      { id: 15, number: 15, text: 'Kabupaten di Sulawesi Utara, ibukotanya Tondano.', answer: 'MINAHASA', direction: 'down', startRow: 8, startCol: 6, answered: false, hintsUsed: 0 },
      { id: 16, number: 16, text: 'Kabupaten di Sulawesi Selatan, terkenal dengan rumah adat Tongkonan.', answer: 'TANATORAJA', direction: 'down', startRow: 11, startCol: 18, answered: false, hintsUsed: 0, hidden: true },
      { id: 17, number: 17, text: 'Kabupaten di Maluku, ibukotanya Bula.', answer: 'SERAMTIMUR', direction: 'down', startRow: 10, startCol: 24, answered: false, hintsUsed: 0, hidden: true },
      { id: 18, number: 18, text: 'Kabupaten di Papua, ibukotanya Sarmi.', answer: 'SARMI', direction: 'across', startRow: 10, startCol: 11, answered: false, hintsUsed: 0, hidden: true },
      { id: 19, number: 19, text: 'Kabupaten di Maluku, ibukotanya Namrole.', answer: 'BURUSELATAN', direction: 'across', startRow: 19, startCol: 22, answered: false, hintsUsed: 0, hidden: true },
      { id: 20, number: 20, text: 'Kabupaten di Papua Barat Daya, surga wisata bahari dunia.', answer: 'RAJAAMPAT', direction: 'across', startRow: 20, startCol: 11, answered: false, hintsUsed: 0, hidden: true },
      { id: 21, number: 21, text: 'Kabupaten di Gorontalo, ibukotanya Suwawa.', answer: 'BONEBOLANGO', direction: 'down', startRow: 16, startCol: 27, answered: false, hintsUsed: 0, hidden: true },
      { id: 22, number: 22, text: 'Kabupaten di Papua Pegunungan, ibukotanya Oksibil.', answer: 'PEGUNUNGANBINTANG', direction: 'across', startRow: 8, startCol: 13, answered: false, hintsUsed: 0, hidden: true },
      { id: 23, number: 23, text: 'Kabupaten di Sulawesi Selatan, ibukotanya Bantaeng.', answer: 'BANTAENG', direction: 'across', startRow: 16, startCol: 27, answered: false, hintsUsed: 0, hidden: true },
      { id: 24, number: 24, text: 'Ibukota Provinsi Papua, terletak di Teluk Yos Sudarso.', answer: 'JAYAPURA', direction: 'down', startRow: 4, startCol: 29, answered: false, hintsUsed: 0, hidden: true },
      { id: 25, number: 25, text: 'Kota di Maluku Utara, bekas Kesultanan Tidore.', answer: 'TIDOREKEPULAUAN', direction: 'down', startRow: 20, startCol: 19, answered: false, hintsUsed: 0, hidden: true },
      { id: 26, number: 26, text: 'Kabupaten di Jawa Tengah, terkenal dengan sate dan sumur minyak tua.', answer: 'BLORA', direction: 'across', startRow: 4, startCol: 17, answered: false, hintsUsed: 0, hidden: true },
      { id: 27, number: 27, text: 'Kabupaten di Jawa Timur, berbatasan dengan Jawa Tengah.', answer: 'NGAWI', direction: 'down', startRow: 21, startCol: 29, answered: false, hintsUsed: 0, hidden: true },
      { id: 28, number: 28, text: 'Kabupaten di Jawa Barat, dikenal sebagai kota mangga.', answer: 'INDRAMAYU', direction: 'across', startRow: 23, startCol: 23, answered: false, hintsUsed: 0, hidden: true },
      { id: 29, number: 29, text: 'Kabupaten di Jawa Tengah, terkenal dengan Pantai Ayah dan goa Jatijajar.', answer: 'KEBUMEN', direction: 'down', startRow: 2, startCol: 17, answered: false, hintsUsed: 0, hidden: true },
      { id: 30, number: 30, text: 'Ibukota Provinsi Kepulauan Riau, berada di Pulau Bintan.', answer: 'TANJUNGPINANG', direction: 'down', startRow: 10, startCol: 34, answered: false, hintsUsed: 0, hidden: true },
      { id: 100, number: 4, text: 'Kabupaten di Madura, Jawa Timur, terkenal dengan batik dan garam.', answer: 'PAMEKASAN', direction: 'across', startRow: 4, startCol: 6, answered: false, hintsUsed: 0 },
    ]
  }),
  4: initializeGrid({
    cells: Array(50).fill(null).map(() => 
      Array(50).fill(null).map(() => ({
        value: '',
        revealed: false,
        isBlocked: true,
        belongsToClues: [],
        hintsUsed: 0
      }))
    ),
    clues: [
      {
        id: 1,
        number: 1,
        text: "Advanced algorithm concept",
        answer: "RECURSION",
        direction: 'across',
        startRow: 1,
        startCol: 1,
        answered: false,
        hintsUsed: 0,
      },
      // Add more clues for level 4...
    ]
  }),
};
