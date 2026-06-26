import { Punishment } from "@/types";

export const punishments: Punishment[] = [
  { id: 1, text: "Katakan 3 hal yang kamu suka dari pasanganmu sekarang!", type: "sweet" },
  { id: 2, text: "Peluk pasanganmu selama 10 detik!", type: "romantic" },
  { id: 3, text: "Buat ekspresi wajah lucu sampai pasanganmu tertawa!", type: "funny" },
  { id: 4, text: "Kirim pesan suara romantis ke pasanganmu!", type: "romantic" },
  { id: 5, text: "Ceritakan momen paling memalukan yang kamu alami!", type: "embarrassing" },
  { id: 6, text: "Bernyanyilah 1 lagu cinta untuk pasanganmu!", type: "romantic" },
  { id: 7, text: "Buat janji manis untuk pasanganmu!", type: "sweet" },
  { id: 8, text: "Tirukan suara binatang pilihan pasanganmu!", type: "funny" },
  { id: 9, text: "Pegang tangan pasanganmu dan katakan 'Aku sayang kamu' dengan serius!", type: "romantic" },
  { id: 10, text: "Buat puisi 2 baris tentang cinta!", type: "sweet" },
  { id: 11, text: "Lakukan dance kocak selama 5 detik!", type: "funny" },
  { id: 12, text: "Bilang 'Maaf' untuk sesuatu yang belum pernah kamu minta maaf!", type: "embarrassing" },
  { id: 13, text: "Tatap mata pasanganmu selama 15 detik tanpa bicara!", type: "romantic" },
  { id: 14, text: "Sebutkan 5 alasan kenapa kamu bersyukur punya pasangan ini!", type: "sweet" },
  { id: 15, text: "Lakukan pose model kocak selama 3 detik!", type: "funny" },
  { id: 16, text: "Ceritakan mimpi teraneh yang pernah kamu ingat!", type: "embarrassing" },
  { id: 17, text: "Puji pasanganmu tanpa berhenti selama 10 detik!", type: "sweet" },
  { id: 18, text: "Buat story Instagram tentang pasanganmu sekarang juga!", type: "romantic" },
  { id: 19, text: "Baca chat lama dan kirim screenshot yang lucu!", type: "funny" },
  { id: 20, text: "Bisikin sesuatu yang manis di telinga pasanganmu!", type: "romantic" },
  { id: 21, text: "Akui 1 hal konyol yang diam-diam kamu lakukan!", type: "embarrassing" },
  { id: 22, text: "Rencanakan kencan dadakan untuk akhir pekan ini!", type: "romantic" },
  { id: 23, text: "Bikin kode tangan rahasia khusus untuk kalian berdua!", type: "funny" },
  { id: 24, text: "Tulis pesan cinta di tangan pasanganmu!", type: "sweet" },
  { id: 25, text: "Lakukan challenge: jangan berkedip sambil menatap pasanganmu!", type: "funny" },
];

export const getRandomPunishment = (): Punishment => {
  return punishments[Math.floor(Math.random() * punishments.length)];
};
