/* =========================================================
   FANUSUM — SENİN GİZLİ NOTLARIN 💌
   Bu dosyayı istediğin gibi düzenleyebilirsin.
   ========================================================= */

// Kurulum ekranının en başında görünen cümle
window.FROM_TEXT = "Bu fanus sana Emre'den bir hediye 💝";

// Notların altına yazılan imza
window.NOTE_SIGN = "— Emre";

// Onun doğum günü "AA-GG" biçiminde (ör. "03-21"). O gün fanusta pasta, taç ve kutlama olur.
// Boş bırakırsan kendisi Ayarlar'dan girebilir.
window.HER_BIRTHDAY = "";

/* Her gün fanusta büyük bir kabarcık çıkar. Patlatınca SIRAYLA
   buradaki notlardan biri açılır (günde bir tane).
   - Düz yazı: sıradaki gün açılır.
   - { date: "2026-12-31", text: "..." }: sadece o gün (ya da sonrasında ilk
     açışta) çıkar, o günkü sıradan önce gelir.
   Notlar bitince balık kendi tatlı mesajlarını söylemeye devam eder. */
window.SECRET_NOTES = [
  "Bu balık artık ikimizin. Ona her baktığında beni de hatırla 🫧",
  "Bugün gülümsedin mi? Gülümsemediysen şimdi gülümse, balık da görsün 😊",
  "Seninle geçen her gün benim için ödül gibi 💙",
  "Bilgi: Betalar sahiplerini tanır. Bu balık da seni tanıyacak, tıpkı benim gibi ezbere 🐟",
  "Bugün yorulduysan biraz dinlen. Balığın da ben de buradayız 🤍",
  "Sana söylemeyi unuttuğum bir şey: Çok güzelsin. Hepsi bu 💗",
  "Fanusun suyu kadar berrak bir kalbin var ✨",
  "Bir hafta oldu! Balığın sana alıştı, ben zaten çoktan alışmıştım 🥹",
  "Bugün bana bir fotoğraf gönder, balığınla ikinizin 📸",
  "Seni düşündüğümde aklımda hep aynı şarkı çalıyor. Hangisi olduğunu tahmin et 🎶",
  "Eğer bugün kötü geçtiyse: yarın daha güzel olacak, söz 🌈",
  "Sen benim en güzel tesadüfümsün 🍀",
  "Balığına benim yerime bir öpücük gönder (cama değil ama 😄) 💋",
  "Seninle her şey daha kolay, daha güzel, daha komik 😂",
  "İki hafta! Bu fanus artık resmen bir ev oldu 🏠",
  "Bugün kendine güzel bir şey ısmarla, benden 🍫",
  "Gözlerin bu balığın rengi kadar güzel. Belki daha da fazla 👀",
  "Sana sarılmak istiyorum. Şu an. Hemen 🤗",
  "Seni seviyorum. Bunu sık söylüyorum ama her seferinde ciddiyim 💙",
  "Bugün balığına benden selam söyle, yüzgeç sallasın 👋",
  "Birlikte yapmak istediğim o kadar çok şey var ki ✈️",
  "Sen yanımdayken zaman çok hızlı geçiyor, haksızlık bu ⏳",
  "Hatırla: Sen harikasın. Bunu unutursan balığa sor 🐠",
  "Bir ay oldu! Bir ay boyunca bir canlıya bu kadar güzel baktın, gurur duyuyorum 🏆",
  { date: "2026-12-31", text: "Yeni yılın ilk dileği de son dileği de sensin 🎆" },
  { date: "2027-02-14", text: "Sevgililer günün kutlu olsun. Ben, sen ve bir balık. Mükemmel bir aile 💘" }
];

/* Hediye kutuları 🎁
   Fanusun "day". gününde çakılların üstünde bir hediye kutusu belirir.
   image: "hediyeler/foto.jpg" gibi bir dosya ekleyebilirsin (klasöre koy). */
window.GIFTS = [
  { day: 1,   title: "Hoş geldin hediyesi", text: "Fanusa hoş geldin! Bu küçük dünyayı senin için kurdum. İlk dekorunu almak için 20 kabarcık hediye 🫧", image: null, points: 20 },
  { day: 7,   title: "1. hafta hediyesi", text: "Bir haftadır harika bir bakıcısın! Bu hafta sonu ne istersen o 🎀", image: null },
  { day: 30,  title: "1. ay hediyesi", text: "Bir ay oldu! Bu kuponu bana göster: 1 adet istediğin yere yemek 🍝", image: null },
  { day: 100, title: "100. gün hediyesi", text: "100 gün! Sen, ben ve balık. Bunu büyük kutlamalıyız 🎉", image: null }
];
