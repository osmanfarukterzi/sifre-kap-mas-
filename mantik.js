// Oyun kuralları. Bu dosyada Firebase yok, sadece saf mantık var.

export const TAKIMLAR = {
  orange: { ad: "Belalılar", renk: "#ff8a3d" },
  purple: { ad: "Cezalılar", renk: "#9b6bff" },
};

export const diger = (t) => (t === "orange" ? "purple" : "orange");

export function karistir(dizi, rnd = Math.random) {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 25 kelime seçer. Başlayan takımın 9, diğerinin 8 kartı olur. 1 siyah, 7 tarafsız kart.
export function tahtaKur(kelimeHavuzu, rnd = Math.random) {
  const kelimeler = karistir(kelimeHavuzu, rnd).slice(0, 25);
  const baslayan = rnd() < 0.5 ? "orange" : "purple";
  const ikinci = diger(baslayan);
  const renkler = [
    ...Array(9).fill(baslayan),
    ...Array(8).fill(ikinci),
    "black",
    ...Array(7).fill("neutral"),
  ];
  return {
    kelimeler,
    anahtar: karistir(renkler, rnd),
    baslayan,
    kalan: { [baslayan]: 9, [ikinci]: 8 },
  };
}

// Bir kart açıldığında ne olacağını hesaplar.
// sonraki: "devam" (aynı takım tahmin etmeye devam eder), "gecis" (sıra karşıya geçer), "bitti" (oyun biter)
export function tahminiSonuclandir({ takim, renk, kalan }) {
  const k = { ...kalan };
  if (renk === "black") {
    return { renk, sonraki: "bitti", kazanan: diger(takim), neden: "black", kalan: k, dogru: false };
  }
  if (renk === "neutral") {
    return { renk, sonraki: "gecis", kalan: k, dogru: false };
  }
  k[renk] -= 1;
  if (k[renk] === 0) {
    return { renk, sonraki: "bitti", kazanan: renk, neden: "hepsi", kalan: k, dogru: renk === takim };
  }
  if (renk === takim) return { renk, sonraki: "devam", kalan: k, dogru: true };
  return { renk, sonraki: "gecis", kalan: k, dogru: false };
}

// Oda kodu: karışması kolay harfler (0, O, 1, I) yok.
export function odaKoduUret(rnd = Math.random) {
  const harfler = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += harfler[Math.floor(rnd() * harfler.length)];
  return s;
}

export const trKucuk = (s) => String(s).toLocaleLowerCase("tr-TR");
export const trBuyuk = (s) => String(s).toLocaleUpperCase("tr-TR");
